const db = require('../postgresql');

module.exports = {
  getSDlogs: (req, res) => {
    const { time } = req.params;
    const end = new Date(time);
    end.setUTCHours(end.getMinutes() + 45);
    const query = `select * from sdlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
    db.connect()
      .then((client) => {
        client.query(query)
          .then((result) => {
            client.release();
            const data = JSON.parse(JSON.stringify(result.rows[0]));
            console.log ('data', data);
            res.body = {
              time_stamp: data.time_stamp,
              demand: data.demand,
              supply: data.supply,
            };
            console.log ('res.body', res.body);
            res.json(res.body);
          })
          .catch((e) => {
            console.log('failed to fetch vrlogs: ', e);
            res.end();
          });
      })
      .catch((e) => {
        console.log('failed to connect: ', e);
        res.end();
      });
  },
  getVRlogs: (req, res) => {
    const { time } = req.params;
    const end = new Date(time);
    end.setUTCHours(end.getMinutes() + 45);
    const query = `select * from vrlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
    db.connect()
      .then((client) => {
        client.query(query)
          .then((result) => {
            client.release();
            const data = JSON.parse(JSON.stringify(result.rows));
            console.log ('data', data);
            res.body = {
              time_stamp: time,
              totalViews: 0,
              totalRequests: 0,
              averageSurge: 0,
            };
            data.forEach((row) => {
              res.body.totalViews += row.views;
              res.body.totalRequests += row.requests;
              res.body.averageSurge += row.surge_ratio;
            });
            res.body.averageSurge /= data.length;
            res.json(res.body);
          })
          .catch((e) => {
            console.log('failed to fetch vrlogs: ', e);
            res.end();
          });
      })
      .catch((e) => {
        console.log('failed to connect: ', e);
        res.end();
      });
  },
};
