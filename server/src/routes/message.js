const express = require("express");
const messageController = require("../controllers/message");
const isAuth = require("../middlewares/isAuth");

const router = express.Router();

router.post("/messages", isAuth, messageController.createMessage);

module.exports = router;
