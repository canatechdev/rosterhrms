require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then((client) => {
    console.log("Database connection established");
    client.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
    process.exit(1);
  });

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;