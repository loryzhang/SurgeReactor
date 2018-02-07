const db = require('../postgresql');

module.exports = {
  insertSupply: (msgs) => {
    const { driver_id, time_stamp } = msgs;
    const data = `insert into supply (driver_id, time_stamp) values ('${driver_id}', '${time_stamp}');`;
    const t = process.hrtime();
    db.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`insertion to supply table cost ${diff[1] / 1000000} ms`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
  insertView: (msgs) => {
    const { surge_id, time_stamp, is_surged, surge_ratio } = msgs;
    const data = `insert into views (surge_id, time_stamp, is_surged, surge_ratio) values ('${surge_id}', '${time_stamp}', '${is_surged}', '${surge_ratio}');`;
    const t = process.hrtime();
    db.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`insertion to views table cost ${diff[1] / 1000000} ms`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
  insertRequest: (msgs) => {
    const { request_id, time_stamp, is_surged, surge_ratio } = msgs;
    const data = `insert into requests (request_id, time_stamp, is_surged, surge_ratio) values ('${request_id}', '${time_stamp}', '${is_surged}', '${surge_ratio}');`;
    const t = process.hrtime();
    db.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
            console.log (`insertion to request table cost ${diff[1] / 1000000} ms`);
          })
          .catch((e) => {
            client.release();
            console.log(e);
          });
      });
  },
};
