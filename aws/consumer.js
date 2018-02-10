const Consumer = require('sqs-consumer');
const db = require('../postgresql/queries.js');

module.exports = {
  addSupply: Consumer.create({
    queueUrl: `${process.env.sqs}addSupply.fifo`,
    region: 'us-west-2',
    batchSize: 10,
    handleMessage: (message, done) => {
      const msgBody = JSON.parse(message.Body);
      db.insertSupply(msgBody, done);
      // return done();
    },
  }),
  addView: Consumer.create({
    queueUrl: `${process.env.sqs}views.fifo`,
    region: 'us-west-2',
    batchSize: 10,
    handleMessage: (message, done) => {
      const msgBody = JSON.parse(message.Body);
      db.insertView(msgBody, done);
    },
  }),
  addRequest: Consumer.create({
    queueUrl: `${process.env.sqs}requests.fifo`,
    region: 'us-west-2',
    batchSize: 10,
    handleMessage: (message, done) => {
      const msgBody = JSON.parse(message.Body);
      db.insertRequest(msgBody, done);
    },
  }),
};
