require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "rosterhrms",
  password: "dalvi91",
  port: 5432,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL Connected"))
  .catch(err => console.error("❌ Connection Error:", err));

module.exports = pool;