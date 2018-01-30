const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2',
});

const sqs = new AWS.SQS();

module.exports = (req, res) => {
  const { rider_id, time_stamp, is_surged, surge_ratio } = req.body;
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
      is_surged: {
        DataType: 'String',
        StringValue: is_surged,
      },
      surge_ratio: {
        DataType: 'Number',
        StringValue: surge_ratio,
      },
    },
    MessageDeduplicationId: time_stamp,
    MessageGroupId: time_stamp,
    MessageBody: 'add a view',
    QueueUrl: process.env.views,
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
};
