const Consumer = require('sqs-consumer');

const addSupply = Consumer.create({
  queueUrl: `${process.env.sqs}addSupply.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});

const addDemand = Consumer.create({
  queueUrl: `${process.env.sqs}addDemand.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});
const reduceSupply = Consumer.create({
  queueUrl: `${process.env.sqs}reduceSupply.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});
const reduceDemand = Consumer.create({
  queueUrl: `${process.env.sqs}reduceDemand.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});
const addViews = Consumer.create({
  queueUrl: `${process.env.sqs}views.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});
const addRequests = Consumer.create({
  queueUrl: `${process.env.sqs}requests.fifo`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    console.log(msgBody);
    return done();
  },
});

reduceSupply.on('error', (err) => {
  console.log(err.message);
});

reduceSupply.start();
module.exports = reduceDemand;
