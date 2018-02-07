const faker = require('faker');
const axios = require('axios');

const mockOneKData = () => {
  const data = {
    supply: [],
    views: [],
    requests: [],
  };

  for (let i = 0; i < 2; i += 1) {
    const requestid = faker.random.uuid();
    const driverid = faker.random.uuid();
    const surgeid = faker.random.uuid();
    const issurged = faker.random.boolean();
    const surgeratio = faker.random.number(9);
    const timestamp1 = faker.date.between('2018-02-05', '2018-02-06');
    const timestamp2 = faker.date.between('2018-02-05', '2018-02-06');
    const timestamp3 = faker.date.between('2017-02-05', '2018-02-06');
    data.supply.push({
      driver_id: driverid,
      time_stamp: timestamp1,
    });
    data.views.push({
      surge_id: surgeid,
      is_surged: issurged,
      surge_ratio: surgeratio,
      time_stamp: timestamp2,
    });
    data.requests.push({
      request_id: requestid,
      is_surged: issurged,
      surge_ratio: surgeratio,
      time_stamp: timestamp3,
    });
  }
  return data;
};

const incomingData = mockOneKData();

const mockPostSupply = (messages) => {
  messages.forEach((message) => {
    axios.post('http://localhost:8080/driver/enqueue', message)
      .then(() => {
        console.log('success for sending supply data');
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const mockPostViews = (messages) => {
  messages.forEach((message) => {
    axios.post('http://localhost:8080/prices', message)
      .then(() => {
        console.log('success for sending views data');
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

const mockPostRequests = (messages) => {
  messages.forEach((message) => {
    axios.post('http://localhost:8080/requests', message)
      .then(() => {
        console.log('success for sending requests data');
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

mockPostSupply(incomingData.supply);
mockPostViews(incomingData.views);
mockPostRequests(incomingData.requests);
