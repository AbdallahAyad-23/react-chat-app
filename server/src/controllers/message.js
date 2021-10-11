const Message = require("../models/message");

exports.createMessage = (req, res, next) => {
  const sender = req.userId;
  const content = req.body.content;
  const conversationId = req.body.conversationId;

  const message = Message({
    sender,
    content,
    conversation: conversationId,
  });

  message.save().then((m) => res.json({ message: m }));
};
