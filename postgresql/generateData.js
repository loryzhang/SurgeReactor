const faker = require('faker');

module.exports = () => {
  const supply = [];
  const views = [];
  const requests = [];

  for (let i = 0; i < 600000; i += 1) {
    const requestid = faker.random.uuid();
    const driverid = faker.random.uuid();
    const surgeid = faker.random.uuid();
    const issurged = faker.random.boolean();
    const surgeratio = faker.random.number(9);
    const timestamp1 = faker.date.between('2017-11-01', '2018-02-05');
    const timestamp2 = faker.date.between('2017-11-01', '2018-02-05');
    const timestamp3 = faker.date.between('2017-11-01', '2018-02-05');
    supply.push(` ('${driverid}', '${JSON.parse(JSON.stringify(timestamp3))}')`);
    views.push(` ('${surgeid}', '${JSON.parse(JSON.stringify(timestamp1))}', ${issurged}, ${surgeratio})`);
    requests.push(` ('${requestid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${issurged}', '${surgeratio}')`);
  }
  const data = [];
  const supplyQuery = `insert into supply (driver_id, time_stamp) values${supply.join(',')}`;
  data.push(supplyQuery);
  const viewsQuery = `insert into views (surge_id, time_stamp, is_surged, surge_ratio) values${views.join(',')}`;
  data.push(viewsQuery);
  const requestsQuery = `insert into requests (request_id, time_stamp, is_surged, surge_ratio) values${requests.join(',')}`;
  data.push(requestsQuery);
  return data.join(';');
};
