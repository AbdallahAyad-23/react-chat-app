const express = require("express");
const conversationController = require("../controllers/conversation");
const isAuth = require("../middlewares/isAuth");
const router = express.Router();

router.post("/conversations", isAuth, conversationController.getConversation);
router.get(
  "/conversations/:conversationId",
  isAuth,
  conversationController.getConversationMessages
);
// router.post(
//   "/conversations",
//   isAuth,
//   conversationController.createConversation
// );

module.exports = router;
