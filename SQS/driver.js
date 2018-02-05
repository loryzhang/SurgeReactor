const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

const sqs = new AWS.SQS();

module.exports = {
  enqueue: (req, res) => {
    const { driver_id, time_stamp } = req.body;
    const params = {
      MessageAttributes: {
        driver_id: {
          DataType: 'String',
          StringValue: driver_id,
        },
        time_stamp: {
          DataType: 'String',
          StringValue: time_stamp,
        },
      },
      MessageDeduplicationId: time_stamp,
      MessageGroupId: driver_id,
      MessageBody: 'add driver in supply',
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
  dequeue: (req, res) => {
    const { driver_id, time_stamp, request_id } = req.body;
    const params = {
      // MessageAttributes: {
      //   driver_id: {
      //     DataType: 'String',
      //     StringValue: driver_id,
      //   },
      //   time_stamp: {
      //     DataType: 'String',
      //     StringValue: time_stamp,
      //   },
      //   request_id: {
      //     DataType: 'String',
      //     StringValue: request_id,
      //   },
      // },
      MessageDeduplicationId: time_stamp,
      MessageGroupId: driver_id,
      MessageBody: JSON.stringify({ driver_id, time_stamp, request_id }),
      QueueUrl: `${process.env.sqs}reduceSupply.fifo`,
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

