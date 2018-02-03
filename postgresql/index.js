const pool = require('./pool');
const generateData = require('./generateData');

module.exports = {
  insertData: (req, res) => {
    const data = generateData();
    const start = new Date();
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const costTime = new Date() - start;
            const diff = process.hrtime(t);
            console.log ('insertTime: ', costTime);
            console.log (`cost ${diff[0]} second, ${diff[1]} nanoseconds`);
            res.end();
          })
          .catch((e) => {
            client.release();
            console.log(e);
            res.end();
          });
      });
  },
  queryData: (req, res) => {
    const query = 'select count(*) from supply where time_stamp between \'2017-12-19 00:00:00\' and \'2017-12-19 00:15:00\'';
    const start = new Date();
    const t = process.hrtime();
    pool.connect()
      .then((client) => {
        return client.query(query)
          .then((result) => {
            client.release();
            const costTime = new Date() - start;
            const diff = process.hrtime(t);
            console.log ('queryTime: ', costTime);
            console.log (`cost ${diff[0]} second, ${diff[1]} nanoseconds`);
            res.send(result);
          })
          .catch((e) => {
            client.release();
            console.log(e);
            res.end();
          });
      }); 
  }
};
