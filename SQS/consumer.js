const Consumer = require('sqs-consumer');
const db = require('../postgresql/SQSQueries');

const addSupply = Consumer.create({
  queueUrl: `${process.env.sqs}addSupply.fifo`,
  region: 'us-west-2',
  batchSize: 1,
  handleMessage: (message, done) => {
    console.log('polled one message from supply', message.Body);
    const msgBody = JSON.parse(message.Body);
    db.insertSupply(msgBody);
    return done();
  },
});

addSupply.on('error when poiling message from supply', (err) => {
  console.log(err.message);
});
addSupply.start();

const addView = Consumer.create({
  queueUrl: `${process.env.sqs}views.fifo`,
  region: 'us-west-2',
  batchSize: 1,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log('polled one message from views', message.Body);
    db.insertView(msgBody);
    return done();
  },
});

addView.on('error when polling message from views', (err) => {
  console.log(err.message);
});
addView.start();

const addRequest = Consumer.create({
  queueUrl: `${process.env.sqs}requests.fifo`,
  region: 'us-west-2',
  batchSize: 1,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log('poiled one message from requests', message.Body);
    db.insertRequest(msgBody);
    return done();
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
