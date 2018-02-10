const newRelic = require('newrelic');
const consumer = require('../aws/consumer.js');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');
const job = require('./worker.js');

const app = express();
const port = process.env.port || 8080;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

consumer.addSupply.on('error when poiling message from supply', (err) => {
  console.log(err.message);
});
consumer.addView.on('error when polling message from views', (err) => {
  console.log(err.message);
});
consumer.addRequest.on('error when polling from requests', (err) => {
  console.log(err.message);
});

consumer.addSupply.start();
consumer.addView.start();
consumer.addRequest.start();

job.start();
console.log('job status', job.running);

app.listen(port, () => {
  console.log (`listening to port ${port}`);
});

module.exports = app;
