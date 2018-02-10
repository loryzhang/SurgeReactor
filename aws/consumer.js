const Consumer = require('sqs-consumer');
const db = require('../postgresql/queries.js');

const addSupply = Consumer.create({
  queueUrl: `${process.env.sqs}addSupply.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertSupply(msgBody, done);
    // return done();
  },
});

addSupply.on('error when poiling message from supply', (err) => {
  console.log(err.message);
});
addSupply.start();

const addView = Consumer.create({
  queueUrl: `${process.env.sqs}views.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertView(msgBody, done);
  },
});

addView.on('error when polling message from views', (err) => {
  console.log(err.message);
});
addView.start();

const addRequest = Consumer.create({
  queueUrl: `${process.env.sqs}requests.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertRequest(msgBody, done);
  },
});

addRequest.on('error when polling from requests', (err) => {
  console.log(err.message);
});
addRequest.start();
module.exports = {
  addSupply,
  addView,
  addRequest,
};
