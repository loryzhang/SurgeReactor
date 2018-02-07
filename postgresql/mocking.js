const faker = require('faker');
const axios = require('axios');

const driver_id = faker.random.uuid();
const rider_id = faker.random.uuid();
const surge_id = faker.random.uuid();
const request_id = faker.random.uuid();
const is_surged = faker.random.boolean();
const surge_ratio = faker.random.number(9);
const time_stamp = new Date();

axios.post('http://localhost:8080/driver/enqueue', {
  driver_id,
  time_stamp,
})
  .then(() => {
    console.log('success for sending supply data');
  })
  .catch((error) => {
    console.log(error);
  });

axios.post('http://localhost:8080/prices', {
  rider_id,
  time_stamp,
  is_surged,
  surge_ratio,
  surge_id,
})
  .then(() => {
    console.log('success for sending views data');
  })
  .catch((error) => {
    console.log(error);
  });

axios.post('http://localhost:8080/requests', {
  request_id,
  time_stamp,
  is_surged,
  surge_ratio,
})
  .then(() => {
    console.log('success for sending requests data');
  })
  .catch((error) => {
    console.log(error);
  });
