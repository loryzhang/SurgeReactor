const db = require('../postgresql');

module.exports = (req, res) => {
  const { driver_id, time_stamp } = req.body;
  const query = `insert into supply (driver_id, time_stamp) values ('${driver_id}', '${time_stamp}')`;
  db.connect()
    .then((client) => {
      client.query(query)
        .then(() => {
          client.release();
          res.status(200).send('success');
        })
        .catch((e) => {
          res.status(404).send(e);
        });
    })
    .catch((e) => {
      res.status(404).send(e);
    });
};
