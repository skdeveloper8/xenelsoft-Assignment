// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const routes = require("./routes");
// const { env } = require("./config/env");
// const { errorHandler } = require("./middleware/errorHandler");
// const { notFound } = require("./middleware/notFound");

// const app = express();

// app.use(helmet());
// app.use(cors({ origin: env.clientUrl, credentials: true }));
// app.use(express.json());
// app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

// app.get("/health", (req, res) => {
//   res.json({ status: "ok" });
// });

// app.use("/api", routes);
// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;
