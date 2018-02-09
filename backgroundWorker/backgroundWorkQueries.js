const db = require('../postgresql');

const writeResults = (query) => {
  return db.connect()
    .then((client) => {
       client.query(query)
        .then(() => {
          client.release();
          console.log ('success write logs realising');
        })
        .catch(e => console.log('failed to wirte logs: ', e));
    })
    .catch(e => console.log(e));
};

module.exports = {
  getCounts: (start, end) => {
    console.log ('start: ', start);
    const query = `select * from supply where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';select * from views where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';select * from requests where time_stamp between '${start.toISOString()}' and '${end.toISOString()}';`;
    db.connect()
      .then((client) => {
        client.query(query)
          .then((results) => {
            client.release();
            console.log('success read from supply, views and requests tables', query);
            const supply = results[0].rowCount;
            const viewCounts = results[1].rowCount;
            const requestCounts = results[2].rowCount;
            const viewData = JSON.parse(JSON.stringify(results[1].rows));
            let surgeRatio = 1;
            if (viewData.length > 0) {
              surgeRatio = viewData[0].surge_ratio;
            }
            const queries = `insert into sdlogs (time_stamp, supply, demand) values ('${start.toISOString()}', ${supply - requestCounts}, ${viewCounts - requestCounts});insert into vrlogs (time_stamp, views, requests, surge_ratio) values ('${start.toISOString()}',${viewCounts},${requestCounts}, ${surgeRatio});`;
            console.log('write query string: ', queries);
            writeResults(queries);
          })
          .catch(e => console.log('failed to read from tables: ', e));
      })
      .catch(e => console.log (e));
  },
};

