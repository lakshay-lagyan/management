const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:'localhost',
  user: 'postgres',
  password: 'bazidajattan',
  database: "data_server",
  port:5432,
});

module.exports = pool;
