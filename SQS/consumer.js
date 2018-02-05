const Consumer = require('sqs-consumer');
const db = require('../postgresql');

const addSupply = Consumer.create({
  queueUrl: `${process.env.sqs}addSupply.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertSupply(msgBody);
    return done();
  },
});

addSupply.on('error', (err) => {
  console.log(err.message);
});
addSupply.start();

const addDemand = Consumer.create({
  queueUrl: `${process.env.sqs}addDemand.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertDemand(msgBody);
    return done();
  },
});


addDemand.on('error', (err) => {
  console.log(err.message);
});
addDemand.start();

const addView = Consumer.create({
  queueUrl: `${process.env.sqs}views.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertView(msgBody);
    return done();
  },
});

addView.on('error', (err) => {
  console.log(err.message);
});
addView.start();

const addRequest = Consumer.create({
  queueUrl: `${process.env.sqs}requests.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    db.insertRequest(msgBody);
    return done();
  },
});

addRequest.on('error', (err) => {
  console.log(err.message);
});
addRequest.start();

module.exports = {
  addSupply,
  addDemand,
  addView,
  addRequest,
};

