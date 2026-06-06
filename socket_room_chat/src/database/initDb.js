const { pool } = require("./db");

async function initDb() {
  if (process.env.USE_MOCK_DB === "true") {
    console.log("Running in Mock/In-Memory Database mode.");
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      room VARCHAR(100) NOT NULL,
      username VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_messages_room ON messages(room)
  `);

  console.log("Database schema verified.");
}

module.exports = initDb;
