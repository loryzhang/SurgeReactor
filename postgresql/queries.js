const db = require('../postgresql');

const writeLogs = query => db.connect()
  .then(client => client.query(query)
    .then(() => client.release())
    .catch((e) => {
      client.release();
      throw e;
    }));

module.exports = {
  insertSupply: (msgs, done) => {
    const data = `insert into supply (driver_id, time_stamp) values ('${msgs.driver_id}', '${msgs.time_stamp}');`;
    db.connect()
      .then(client => client.query(data)
        .then(() => {
          client.release();
          console.log ('success');
          return done();
        })
        .catch((e) => {
          client.release();
          return done(e);
        }));
  },
  insertView: (msgs, done) => {
    const data = `insert into views (surge_id, time_stamp, is_surged, surge_ratio) values ('${msgs.surge_id}', '${msgs.time_stamp}', '${msgs.is_surged}', '${msgs.surge_ratio}');`;
    db.connect()
      .then(client => client.query(data)
        .then(() => {
          client.release();
          console.log ('view polled');
          return done();
        })
        .catch((e) => {
          client.release();
          return done(e);
        }));
  },
  insertRequest: (msgs, done) => {
    const data = `insert into requests (request_id, time_stamp, is_surged, surge_ratio) values ('${msgs.request_id}', '${msgs.time_stamp}', '${msgs.is_surged}', '${msgs.surge_ratio}');`;
    db.connect()
      .then(client => client.query(data)
        .then(() => {
          client.release();
          return done();
        })
        .catch((e) => {
          client.release();
          return done(e);
        }));
  },
  getSDlogs: (time, end) => {
    const query = `select * from sdlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
    return db.connect()
      .then(client => client.query(query)
        .then((result) => {
          client.release();
          return result;
        })
        .catch((e) => {
          client.release();
          throw e;
        }));
  },
  getVRlogs: (time, end) => {
    const query = `select * from vrlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
    return db.connect()
      .then(client => client.query(query)
        .then((result) => {
          client.release();
          return result;
        })
        .catch((e) => {
          client.release();
          throw e;
        }));
  },
  getCounts: (start, end) => {
    const query = `select * from supply where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';select * from views where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';select * from requests where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';`;
    return db.connect()
      .then(client => client.query(query)
        .then((results) => {
          client.release();
          const supply = results[0].rowCount;
          const viewCounts = results[1].rowCount;
          const requestCounts = results[2].rowCount;
          const viewData = JSON.parse(JSON.stringify(results[1].rows));
          let surgeRatio = 1;
          if (viewData.length > 0) {
            surgeRatio = viewData[0].surge_ratio;
          }
          const queries = `insert into sdlogs (time_stamp, supply, demand) values ('${start.toISOString()}', ${supply - requestCounts}, ${viewCounts - requestCounts});insert into vrlogs (time_stamp, views, requests, surge_ratio) values ('${start.toISOString()}',${viewCounts},${requestCounts}, ${surgeRatio});`;
          writeLogs(queries);
        })
        .catch((e) => {
          client.release();
          return e;
        }));
  },
};
