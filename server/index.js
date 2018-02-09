const newRelic = require('newrelic');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router.js');
const consumer = require('../SQS/consumer.js');
const backgroundWork = require('../backgroundWorker');
const cron = require('cron');

const job = new cron.CronJob({
  cronTime: '00 00 03 * *',
  onTick: backgroundWork,
  start: false,
  timeZone: 'America/Los_Angeles',
});

job.start();
console.log('job status', job.running);

const app = express();
const port = process.env.port || 8080;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen(port, () => {
  console.log (`listening to port ${port}`);
});

module.exports = app;
