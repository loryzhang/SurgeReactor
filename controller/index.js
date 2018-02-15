const db = require('../postgresql/queries.js');
const {
  handleError,
  syncToHardDisk,
  sendTenMessages,
  unlinkFile,
  reSync,
} = require('./fsHelper.js');

let addSupply = [];
let views = [];
let requests = [];

let i = 0;
let j = 0;
let k = 0;

handleError('addSupply', addSupply);
handleError('views', views);
handleError('requests', requests);

module.exports = {
  addSupply: (req, res) => {
    addSupply.push({
      Id: i.toString(),
      MessageBody: JSON.stringify(req.body),
    });
    i += 1;
    syncToHardDisk('addSupply', i, req.body);
    if (addSupply.length === 10) {
      sendTenMessages('addSupply', addSupply, (err, data) => {
        if (err) {
          res.status(401).end();
        } else {
          addSupply = [];
          unlinkFile('addSupply');
          if (data.Failed) {
            data.Failed.forEach((message) => {
              addSupply.push({
                Id: message.Id,
                MessageBody: message.Message.MessageBody,
              });
              reSync('addSupply', message);
            });
          }
        }
      });
    }
    res.status(200).end();
  },
  addView: (req, res) => {
    views.push({
      Id: j.toString(),
      MessageBody: JSON.stringify(req.body),
    });
    j += 1;
    syncToHardDisk('views', j, req.body);
    if (views.length === 10) {
      sendTenMessages('views', views, (err, data) => {
        if (err) {
          res.status(401).end();
        } else {
          views = [];
          unlinkFile('views');
          if (data.Failed) {
            data.Failed.forEach((message) => {
              views.push({
                Id: message.Id,
                MessageBody: message.Message.MessageBody,
              });
              reSync('views', message);
            });
          }
        }
      });
    }
    res.status(200).end();
  },
  addRequest: (req, res) => {
    requests.push({
      Id: k.toString(),
      MessageBody: JSON.stringify(req.body),
    });
    k += 1;
    syncToHardDisk('requests', k, req.body);
    if (requests.length === 10) {
      sendTenMessages('requests', requests, (err, data) => {
        if (err) {
          res.status(401).end();
        } else {
          requests = [];
          unlinkFile('requests');
          if (data.Failed) {
            data.Failed.forEach((message) => {
              requests.push({
                Id: message.Id,
                MessageBody: message.Message.MessageBody,
              });
              reSync('requests', message);
            });
          }
        }
      });
    }
    res.status(200).end();
  },
  getSDlogs: (req, res) => {
    const { time } = req.params;
    if (Number.isNaN(Date.parse(time))) {
      res.status(400).send({ error: 'Invalid time stamp!' });
    } else {
      const end = new Date(time);
      end.setUTCHours(end.getMinutes() + 45);
      db.getSDlogs(time, end)
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result.rows));
          if (!data.length) {
            res.status(404).json({ message: 'Sorry! No data at this point! Try again later!' });
          } else {
            res.status(200).json({
              time_stamp: data[0].time_stamp,
              demand: data[0].demand,
              supply: data[0].supply,
            });
          }
        })
        .catch((e) => {
          res.status(503).send({ error: e });
        });
    }
  },
  getVRlogs: (req, res) => {
    const { time } = req.params;
    if (Number.isNaN(Date.parse(time))) {
      res.status(400).send('Invalid time stamp!');
    } else {
      const end = new Date(time);
      end.setMinutes(end.getMinutes() + 45);
      db.getVRlogs(time, end)
        .then((result) => {
          const data = JSON.parse(JSON.stringify(result.rows));
          if (!data.length) {
            res.status(404).json({ message: 'Sorry! No data at this point! Try again later!' });
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
          res.status(503).send({ error: e });
        });
    }
  },
};
