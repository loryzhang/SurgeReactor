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
            console.log ('queryTime: ', costTime);
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
};
