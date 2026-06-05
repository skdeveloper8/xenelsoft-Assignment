const express = require("express");
const { authenticate } = require("../../middleware/authenticate");
const { getMe } = require("./user.controller");

const router = express.Router();

router.get("/me", authenticate, getMe);

module.exports = router;
