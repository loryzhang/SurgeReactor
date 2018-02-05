const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

const sqs = new AWS.SQS();

module.exports = {
  addSupply: (req, res) => {
    const { driver_id, time_stamp } = req.body;
    const params = {
      MessageDeduplicationId: time_stamp,
      MessageGroupId: driver_id,
      MessageBody: JSON.stringify({ driver_id, time_stamp }),
      QueueUrl: `${process.env.sqs}addSupply.fifo`,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401);
        res.end();
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.end();
      }
    });
  },
  addView: (req, res) => {
    const { rider_id, time_stamp, is_surged, surge_ratio, surge_id } = req.body;
    const paramsView = {
      MessageDeduplicationId: time_stamp,
      MessageGroupId: time_stamp,
      MessageBody: JSON.stringify({
        surge_id,
        time_stamp,
        is_surged,
        surge_ratio,
      }),
      QueueUrl: `${process.env.sqs}views.fifo`,
    };
    const paramsDemand = {
      MessageDeduplicationId: time_stamp,
      MessageGroupId: rider_id,
      MessageBody: JSON.stringify({ rider_id, time_stamp }),
      QueueUrl: `${process.env.sqs}addDemand.fifo`,
    };
    sqs.sendMessage(paramsView, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401);
        res.end();
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.end();
      }
    });
    sqs.sendMessage(paramsDemand, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401);
        res.end();
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.end();
      }
    });
  },
  addRequest: (req, res) => {
    const { request_id, time_stamp, is_surged, surge_ratio } = req.body;
    const params = {
      MessageDeduplicationId: request_id,
      MessageGroupId: time_stamp,
      MessageBody: JSON.stringify({
        request_id,
        time_stamp,
        is_surged,
        surge_ratio,
      }),
      QueueUrl: `${process.env.sqs}requests.fifo`,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401);
        res.end();
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.end();
      }
    });
  },
};
