// require("dotenv").config();

// const http = require("http");
// const app = require("./app");
// const { env } = require("./config/env");
// const { connectDb } = require("./database/pool");
// const { createSocketServer } = require("./sockets");

// const server = http.createServer(app);

// createSocketServer(server);

// async function startServer() {
//   await connectDb();

//   server.listen(env.port, () => {
//     console.log(`Server running on port ${env.port}`);
//   });
// }

// startServer().catch((error) => {
//   console.error("Server startup failed", error);
//   process.exit(1);
// });
