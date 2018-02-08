const db = require('../postgresql');

module.exports = {
  getSDlogs: (req, res) => {
    const { time } = req.params;
    if (Number.isNaN(Date.parse(time))) {
      res.status(400).send('Invalid time stamp!');
    } else {
      const end = new Date(time);
      end.setUTCHours(end.getMinutes() + 45);
      const query = `select * from sdlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
      db.connect()
        .then((client) => {
          client.query(query)
            .then((result) => {
              client.release();
              const data = JSON.parse(JSON.stringify(result.rows));
              if (!data.length) {
                res.body = { message: 'Sorry! No data at this point! Try again later!' };
                res.status(404);
                res.json(res.body);
              } else {
                res.body = {
                  time_stamp: data[0].time_stamp,
                  demand: data[0].demand,
                  supply: data[0].supply,
                };
                res.json(res.body);
              }
            })
            .catch((e) => {
              res.status(404).send(`failed to fetch sdlogs: ${e}`);
            });
        })
        .catch((e) => {
          res.status(404).send(`failed to connect sdlogs: ${e}`);
        });
    }
  },
  getVRlogs: (req, res) => {
    const { time } = req.params;
    if (Number.isNaN(Date.parse(time))) {
      res.status(400).send('Invalid time stamp!');
    } else {
      const end = new Date(time);
      end.setUTCHours(end.getMinutes() + 45);
      const query = `select * from vrlogs where time_stamp between '${time}' and '${end.toISOString()}'`;
      db.connect()
        .then((client) => {
          client.query(query)
            .then((result) => {
              client.release();
              const data = JSON.parse(JSON.stringify(result.rows));
              if (!data.length) {
                res.body = { message: 'Sorry! No data at this point! Try again later!' };
                res.status(404);
                res.json(res.body);
              } else {
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
              }
            })
            .catch((e) => {
              res.status(503).send(`failed to fetch vrlogs: ${e}`);
            });
        })
        .catch((e) => {
          res.status(503).send(`failed to connect vrlogs: ${e}`);
        });
    }
  },
};
