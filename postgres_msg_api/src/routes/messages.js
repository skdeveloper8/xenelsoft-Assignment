const express = require("express");
const { getMessages, importMessages } = require("../controllers/messages");

const router = express.Router();

router.get("/", getMessages);
router.post("/import", importMessages);

module.exports = router;
