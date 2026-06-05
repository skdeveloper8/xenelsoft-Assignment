const pool = require("./db");

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      source_message_id VARCHAR(100),
      sender_id VARCHAR(100) NOT NULL,
      sender_name VARCHAR(100) NOT NULL,
      sender_email VARCHAR(255),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE messages
    ADD COLUMN IF NOT EXISTS source_message_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `);
}

module.exports = initDb;
