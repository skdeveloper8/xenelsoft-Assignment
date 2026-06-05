require("dotenv").config();

const express = require("express");
const initDb = require("./database/initDb");
const messageRoutes = require("./routes/messages");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PostgreSQL message API is running" });
});

app.use("/api/messages", messageRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed", error);
    process.exit(1);
  });
