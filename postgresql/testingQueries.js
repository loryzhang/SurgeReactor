const db = require('../postgresql');
const generateData = require('./generateData');

module.exports = {
  insertData: (req, res) => {
    const data = generateData();
    const t = process.hrtime();
    db.connect()
      .then((client) => {
        return client.query(data)
          .then((result) => {
            client.release();
            const diff = process.hrtime(t);
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
