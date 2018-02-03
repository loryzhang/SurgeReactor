const faker = require('faker');

module.exports = () => {
  const supply = [];
  const demand = [];
  const reduceDemand = [];
  const reduceSupply = [];
  const views = [];
  const requests = [];

  for (let i = 0; i < 300000; i += 1) {
    const requestid = faker.random.uuid();
    const driverid = faker.random.uuid();
    const riderid = faker.random.uuid();
    const surgeid = faker.random.uuid();
    const issurged = faker.random.boolean();
    const surgeratio = faker.random.number(9);
    const timestamp1 = faker.date.between('2017-11-01', '2018-01-31');
    const timestamp2 = faker.date.future(0, timestamp1);
    const timestamp3 = faker.date.past(0, timestamp1);
    supply.push(` ('${driverid}', '${JSON.parse(JSON.stringify(timestamp3))}')`);
    views.push(` ('${surgeid}', '${JSON.parse(JSON.stringify(timestamp1))}', ${issurged}, ${surgeratio})`);
    demand.push(` ('${riderid}', '${JSON.parse(JSON.stringify(timestamp1))}', '${surgeid}')`);
    requests.push(` ('${requestid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${issurged}', '${surgeratio}')`);
    reduceSupply.push(` ('${driverid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${requestid}')`);
    reduceDemand.push(` ('${riderid}', '${JSON.parse(JSON.stringify(timestamp2))}', '${requestid}')`);
  }
  const data = [];
  const supplyQuery = `insert into supply (driver_id, time_stamp) values${supply.join(',')}`;
  data.push(supplyQuery);
  const demandQuery = `insert into demand (rider_id, time_stamp, surge_id) values${demand.join(',')}`;
  data.push(demandQuery);
  const reduceSupplyQuery = `insert into reducesupply (driver_id, time_stamp, request_id) values${reduceSupply.join(',')}`;
  data.push(reduceSupplyQuery);
  const reduceDemandQuery = `insert into reducedemand (rider_id, time_stamp, request_id) values${reduceDemand.join(',')}`;
  data.push(reduceDemandQuery);
  const viewsQuery = `insert into views (surge_id, time_stamp, is_surged, surge_ratio) values${views.join(',')}`;
  data.push(viewsQuery);
  const requestsQuery = `insert into requests (request_id, time_stamp, is_surged, surge_ratio) values${requests.join(',')}`;
  data.push(requestsQuery);
  return data.join(';');
};
