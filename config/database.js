
const { Pool } = require('pg');

const pool = new Pool({
  host:  'localhost',
  port: 5432,
  database: 'rosterhrms',
  user: 'postgres',
  password: 'dalvi91',
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Connection error', err.stack);
  }
  console.log('Connected to database');
  release();
});

module.exports = pool;