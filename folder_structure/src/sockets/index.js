const { Server } = require("socket.io");
const { env } = require("../config/env");
const { socketAuth } = require("./socketAuth");
const { registerChatSocket } = require("./chat.socket");

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    registerChatSocket(io, socket);
  });

  return io;
}

module.exports = { createSocketServer };
