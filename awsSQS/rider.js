const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

const sqs = new AWS.SQS();

module.exports = {
  enqueue: (req, res) => {
    const { rider_id, time_stamp, locations } = req.body;
    const params = {
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
      MessageDeduplicationId: time_stamp,
      MessageGroupId: rider_id,
      MessageBody: 'add rider in demand',
      QueueUrl: process.env.addDemand,
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
      MessageDeduplicationId: time_stamp,
      MessageGroupId: rider_id,
      MessageBody: 'remove rider from demand',
      QueueUrl: process.env.reduceDemand,
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

