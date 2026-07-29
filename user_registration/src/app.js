require("dotenv").config();

const express = require("express");
const authRoutes = require("./routes/auth");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "User registration API is running" });
});

app.use("/api/users", authRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
