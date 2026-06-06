require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const initDb = require("./database/initDb");
const db = require("./database/db");
const registerChatHandlers = require("./controllers/chat");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Socket room chat API is running" });
});

io.on("connection", (socket) => {
  registerChatHandlers(io, socket);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

initDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed", error);
    process.exit(1);
  });

const shutdown = async () => {
  console.log("Shutting down server...");
  if (db.pool) {
    await db.pool.end().catch(() => {});
  }
  server.close(() => {
    console.log("HTTP and Socket server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
