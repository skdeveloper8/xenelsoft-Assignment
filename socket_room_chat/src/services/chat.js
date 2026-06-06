const db = require("../database/db");

const useMock = process.env.USE_MOCK_DB === "true";
const mockStore = {};

async function getRoomHistory(room) {
  if (useMock) {
    return mockStore[room] || [];
  }

  const result = await db.query(
    `SELECT id, room, username, message, created_at
     FROM (
       SELECT id, room, username, message, created_at
       FROM messages
       WHERE room = $1
       ORDER BY created_at DESC, id DESC
       LIMIT 20
     ) sub
     ORDER BY created_at ASC, id ASC`,
    [room]
  );
  return result.rows;
}

async function saveMessage(room, username, message) {
  if (useMock) {
    if (!mockStore[room]) {
      mockStore[room] = [];
    }
    const newMsg = {
      id: Date.now() + Math.random(),
      room,
      username,
      message,
      created_at: new Date()
    };
    mockStore[room].push(newMsg);
    if (mockStore[room].length > 20) {
      mockStore[room] = mockStore[room].slice(-20);
    }
    return newMsg;
  }

  const client = await db.pool.connect();

  try {
    await client.query("BEGIN");

    const insertRes = await client.query(
      `INSERT INTO messages (room, username, message)
       VALUES ($1, $2, $3)
       RETURNING id, room, username, message, created_at`,
      [room, username, message]
    );

    await client.query(
      `DELETE FROM messages
       WHERE room = $1
         AND id NOT IN (
           SELECT id FROM messages
           WHERE room = $1
           ORDER BY created_at DESC, id DESC
           LIMIT 20
         )`,
      [room]
    );

    await client.query("COMMIT");
    return insertRes.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  getRoomHistory,
  saveMessage,
};
