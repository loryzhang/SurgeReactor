const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Consumer = require('sqs-consumer');
const db = require('../postgresql/queries.js');

const app = express();
const port = process.env.port || 8000;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const addSupply = Consumer.create({
  queueUrl: `${process.env.sqs}addSupply`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    //db.insertSupply(msgBody, done);
    return done();
  },
});
const addView = Consumer.create({
  queueUrl: `${process.env.sqs}views`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    //db.insertView(msgBody, done);
    return done();
  },
});
const addRequest = Consumer.create({
  queueUrl: `${process.env.sqs}requests`,
  region: 'us-west-2',
  batchSize: 10,
  handleMessage: (message, done) => {
    const msgBody = JSON.parse(message.Body);
    //db.insertRequest(msgBody, done);
    return done();
  },
});

addSupply.on('error when poiling message from supply', (err) => {
  console.log(err.message);
});
addView.on('error when polling message from views', (err) => {
  console.log(err.message);
});
addRequest.on('error when polling from requests', (err) => {
  console.log(err.message);
});

addSupply.start();
addView.start();
addRequest.start();

app.listen(port, () => {
  console.log (`SQSconsumer server listening to port ${port}`);
});

module.exports = app;
