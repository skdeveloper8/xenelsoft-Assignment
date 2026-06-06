const { Pool } = require("pg");
require("dotenv").config();

const useMock = process.env.USE_MOCK_DB === "true";

const pool = useMock ? null : new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

module.exports = {
  pool,
  query: (text, params) => {
    if (useMock) return null;
    return pool.query(text, params);
  }
};
