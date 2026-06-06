const chatService = require("../services/chat");

module.exports = (io, socket) => {
  socket.on("join_room", async ({ room, username }) => {
    if (!room || !username) {
      return socket.emit("error_message", { message: "Room and username are required." });
    }

    const cleanRoom = room.trim();
    const cleanUsername = username.trim();

    if (!cleanRoom || !cleanUsername) {
      return socket.emit("error_message", { message: "Room and username cannot be empty." });
    }

    if (socket.room && socket.room !== cleanRoom) {
      socket.leave(socket.room);
      socket.to(socket.room).emit("user_left", {
        username: socket.username,
        room: socket.room,
        message: `${socket.username} left the room.`
      });
    }

    socket.join(cleanRoom);
    socket.room = cleanRoom;
    socket.username = cleanUsername;

    console.log(`[Join] ${cleanUsername} joined room: ${cleanRoom}`);

    try {
      const history = await chatService.getRoomHistory(cleanRoom);
      socket.emit("room_history", { room: cleanRoom, history });

      socket.to(cleanRoom).emit("user_joined", {
        username: cleanUsername,
        room: cleanRoom,
        message: `${cleanUsername} joined the room.`
      });
    } catch (err) {
      console.error("Failed to load history:", err.message);
      socket.emit("error_message", { message: "Could not load room history." });
    }
  });

  socket.on("send_message", async (data) => {
    const room = socket.room || data?.room;
    const username = socket.username || data?.username;
    const message = data?.message;

    if (!room || !username || !message || !message.trim()) {
      return socket.emit("error_message", { message: "Message text is required." });
    }

    try {
      const savedMsg = await chatService.saveMessage(room, username, message.trim());
      io.to(room).emit("receive_message", savedMsg);
    } catch (err) {
      console.error("Failed to save message:", err.message);

      const fallbackMsg = {
        id: Date.now(),
        room,
        username,
        message: message.trim(),
        created_at: new Date()
      };
      io.to(room).emit("receive_message", fallbackMsg);
      socket.emit("error_message", { message: "Failed to persist message in DB." });
    }
  });

  socket.on("disconnect", () => {
    if (socket.room && socket.username) {
      console.log(`[Disconnect] ${socket.username} from room: ${socket.room}`);
      socket.to(socket.room).emit("user_left", {
        username: socket.username,
        room: socket.room,
        message: `${socket.username} has disconnected.`
      });
    }
  });
};
