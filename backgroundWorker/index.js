const dbQueries = require('./backgroundWorkQueries');

module.exports = () => {
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
