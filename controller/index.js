const sqs = require('../aws');
const db = require('../postgresql/queries.js');

module.exports = {
  addSupply: (req, res) => {
    const params = {
     // MessageDeduplicationId: `${req.body.time_stamp}${req.body.driver_id}`,
     // MessageGroupId: req.body.time_stamp,
      MessageBody: JSON.stringify(req.body),
      QueueUrl: `${process.env.sqs}addSupply`,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        res.status(401).json({ error: `${err}` });
      } else {
        res.status(200).json({ messageId: `${data.MessageId}` });
      }
    });
  },
  addView: (req, res) => {
    const paramsView = {
     // MessageDeduplicationId: req.body.surge_id,
     // MessageGroupId: req.body.time_stamp,
      MessageBody: JSON.stringify(req.body),
      QueueUrl: `${process.env.sqs}views`,
    };
    sqs.sendMessage(paramsView, (err, data) => {
      if (err) {
        res.status(401).json({ error: `${err}` });
      } else {
        res.status(200).json({ messageId: `${data.MessageId}` });
      }
    });
  },
  addRequest: (req, res) => {
    const params = {
      //MessageDeduplicationId: req.body.request_id,
     // MessageGroupId: req.body.time_stamp,
      MessageBody: JSON.stringify(req.body),
      QueueUrl: `${process.env.sqs}requests`,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        res.status(401).json({ error: `${err}` });
      } else {
        res.status(200).json({ messageId: `${data.MessageId}` });
      }
    });
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
