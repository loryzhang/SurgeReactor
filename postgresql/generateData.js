const faker = require('faker');

module.exports = () => {
  const supply = [];
  const demand = [];
  const reduceSupply = [];
  const reduceDemand = [];
  const views = [];
  const requests = [];

  for (let i = 0; i < 100000; i += 1) {
    const requestid = faker.random.uuid();
    const driverid = faker.random.uuid();
    const riderid = faker.random.uuid();
    const surgeid = faker.random.uuid();
    const issurged = faker.random.boolean();
    const surgeratio = faker.random.number(9);
    const timestamp1 = faker.date.between('2017-11-01', '2018-01-31');
    const timestamp2 = faker.date.future(0, timestamp1);
    const timestamp3 = faker.date.past(0, timestamp1);
    supply.push(`insert into supply (driver_id, time_stamp) values ('${driverid}', '${JSON.parse(JSON.stringify(timestamp3))}')`);
    views.push(`insert into views (surge_id, time_stamp, is_surged, surge_ratio) values ('${surgeid}', '${JSON.parse(JSON.stringify(timestamp1))}', ${issurged}, ${surgeratio})`);
    demand.push(`insert into demand (rider_id, time_stamp, surge_id) values ('${riderid}', '${JSON.parse(JSON.stringify(timestamp1))}', '${surgeid}')`);
    requests.push(`insert into requests (request_id, time_stamp, is_surged, surge_ratio) values ('${requestid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${issurged}', '${surgeratio}')`);
    reduceSupply.push(`insert into reducesupply (driver_id, time_stamp, request_id) values ('${driverid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${requestid}')`);
    reduceDemand.push(`insert into reducedemand (rider_id, time_stamp, request_id) values ('${riderid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${requestid}')`);
  }
  const data = [...supply, ...demand, ...reduceSupply, ...reduceDemand, ...views, ...requests];
  return data.join(';');
};
