const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
  database: 'logger',
  user: 'surgereactor',
  password: 'surge',
  port: 5432,
  host: 'ec2-54-200-168-147.us-west-2.compute.amazonaws.com',
  max: 100,
  min: 4,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});

// const pool = new Pool({
//   database: 'surgereactor',
//   user: 'surgereactor',
//   password: 'surgereactor',
//   max: 100,
//   min: 4,
//   idleTimeoutMillis: 1000,
//   connectionTimeoutMillis: 1000,
// });

module.exports = pool;
