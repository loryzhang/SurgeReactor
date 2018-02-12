const express = require('express');
const cron = require('cron');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dbQueries = require('../postgresql/queries.js');

const app = express();
const port = process.env.port || 3000;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const worker = () => {
  const start = new Date();
  start.setDate(start.getDate() - 1);
  start.setUTCHours(6);
  start.setMinutes(0);
  start.setMilliseconds(0);
  const end = new Date();
  end.setDate(end.getDate() - 1);
  end.setUTCHours(6);
  end.setMinutes(15);
  end.setMilliseconds(0);
  const finish = new Date();
  finish.setUTCHours(0);
  finish.setMinutes(0);
  finish.setMilliseconds(0);

  while (end <= finish) {
    dbQueries.getCounts(start, end);
    end.setMinutes(end.getMinutes() + 15);
    start.setMinutes(start.getMinutes() + 15);
  }
  return true;
};

const job = new cron.CronJob({
  cronTime: '00 00 03 * *',
  onTick: worker,
  start: false,
  timeZone: 'America/Los_Angeles',
});

job.start();

app.listen(port, () => {
  console.log(`cronWorker server listening to port ${port}`);
});

module.exports = app;
