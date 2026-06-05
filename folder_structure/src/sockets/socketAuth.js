const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Socket auth token required"));
    }

    socket.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return next(new Error("Invalid socket token"));
  }
}

module.exports = { socketAuth };
