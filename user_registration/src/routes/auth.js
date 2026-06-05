const express = require("express");
const { registerUser } = require("../controllers/auth");

const router = express.Router();

router.post("/auth/register", registerUser);

module.exports = router;
