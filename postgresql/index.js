const pool = require('./pool');

module.exports = {
  insertSupply: (msgs) => {
    const data = `insert into supply (driver_id, time_stamp)${msgs.join(',')};`;
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`10 insertion to supply table cost ${diff[0]} second, ${diff[1]} nanoseconds`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
  insertDemand: (msgs) => {
    const data = `insert into demand (rider_id, time_stamp)${msgs.join(',')};`;
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`10 insertion to demand table cost ${diff[0]} second, ${diff[1]} nanoseconds`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
  insertView: (msgs) => {
    const data = `insert into views (surge_id, time_stamp, is_surged, surge_ratio)${msgs.join(',')};`;
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`10 insertion to views table cost ${diff[0]} second, ${diff[1]} nanoseconds`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
  insertRequest: (msgs) => {
    const data = `insert into requests (request_id, time_stamp, is_surged, surge_ratio)${msgs.join(',')};`;
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`10 insertion to request table cost ${diff[0]} second, ${diff[1]} nanoseconds`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
};
