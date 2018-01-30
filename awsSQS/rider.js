const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-1',
});

const sqs = new AWS.SQS();

module.exports = {
  enqueue: (req, res) => {
    const { rider_id, time_stamp, locations } = req.body;
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        rider_id: {
          DataType: 'String',
          StringValue: rider_id,
        },
        time_stamp: {
          DataType: 'String',
          StringValue: time_stamp,
        },
        latitude: {
          DataType: 'String',
          StringValue: locations.latitude,
        },
        longitude: {
          DataType: 'String',
          StringValue: locations.longitude,
        },
      },
      MessageBody: 'add rider in demand',
      QueueUrl: process.env.SQS_QUEUE_DISTRIBUTION,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401).send(err);
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.json(data);
      }
    });
  },
  dequeue: (req, res) => {
    const { rider_id, time_stamp } = req.body;
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        rider_id: {
          DataType: 'String',
          StringValue: rider_id,
        },
        time_stamp: {
          DataType: 'String',
          StringValue: time_stamp,
        },
      },
      MessageBody: 'remove rider from demand',
      QueueUrl: process.env.SQS_QUEUE_DISTRIBUTION,
    };
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log('Error', err);
        res.status(401).send(err);
      } else {
        console.log('Success', data.MessageId);
        res.status(200);
        res.json(data);
      }
    });
  },
};

