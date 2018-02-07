const pg = require('pg');

const { Pool } = pg;

const pool = new Pool({
  database: 'surgereactor',
  user: 'surgereactor',
  password: 'surgereactor',
  // port: 5432,
  // host: 'localhost',
  // ssl: true,
  max: 100,
  min: 4,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 1000,
});


module.exports = pool;
