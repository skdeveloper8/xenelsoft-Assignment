const pool = require("../database/db");

async function getMessages(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const result = await pool.query(
      `SELECT id, sender_id, sender_name, sender_email, message, created_at
       FROM messages
       ORDER BY created_at DESC, id DESC
       LIMIT $1`,
      [limit]
    );

    return res.json({
      count: result.rowCount,
      messages: result.rows.reverse(),
    });
  } catch (error) {
    return next(error);
  }
}

function getMessagesFromResponse(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return data.messages || data.data || data.results || [];
}

function normalizeMessage(message) {
  const sender = message.sender || message.user || {};

  return {
    source_message_id: message.id?.toString() || null,
    sender_id: message.sender_id?.toString() || sender.id?.toString() || "unknown",
    sender_name: message.sender_name || sender.name || message.name || "Unknown Sender",
    sender_email: message.sender_email || sender.email || message.email || null,
    message: message.message || message.text || message.body,
    created_at: message.created_at || message.createdAt || new Date(),
  };
}

async function importMessages(req, res, next) {
  try {
    const sourceUrl = req.body.url || process.env.MESSAGE_SOURCE_URL;
    const limit = Math.min(Number(req.body.limit) || 20, 100);

    if (!sourceUrl) {
      return res.status(400).json({
        message: "source url is required",
      });
    }

    const response = await fetch(sourceUrl);

    if (!response.ok) {
      return res.status(502).json({
        message: "could not fetch messages from source",
      });
    }

    const data = await response.json();
    const sourceMessages = getMessagesFromResponse(data).slice(0, limit);
    const savedMessages = [];

    for (const sourceMessage of sourceMessages) {
      const newMessage = normalizeMessage(sourceMessage);

      if (!newMessage.message) {
        continue;
      }

      const result = await pool.query(
        `INSERT INTO messages (
          source_message_id,
          sender_id,
          sender_name,
          sender_email,
          message,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, source_message_id, sender_id, sender_name, sender_email, message, created_at`,
        [
          newMessage.source_message_id,
          newMessage.sender_id,
          newMessage.sender_name,
          newMessage.sender_email,
          newMessage.message,
          newMessage.created_at,
        ]
      );

      savedMessages.push(result.rows[0]);
    }

    return res.status(201).json({
      message: "Messages imported",
      count: savedMessages.length,
      messages: savedMessages,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getMessages,
  importMessages,
};
