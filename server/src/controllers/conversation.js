const mongoose = require("mongoose");
const Message = require("../models/message");
const Conversation = require("../models/conversation");

// get conversationId between two users
exports.getConversation = (req, res, next) => {
  const m1 = req.userId;
  const m2 = req.body.member;
  Conversation.findOne({
    $or: [
      { members: [mongoose.Types.ObjectId(m1), mongoose.Types.ObjectId(m2)] },
      { members: [mongoose.Types.ObjectId(m2), mongoose.Types.ObjectId(m1)] },
    ],
  }).then((conv) => {
    if (conv) {
      return res.json({ convId: conv._id });
    } else {
      const conversation = Conversation({
        members: [mongoose.Types.ObjectId(m1), mongoose.Types.ObjectId(m2)],
      });
      conversation
        .save()
        .then((conv) => {
          return res.json({ convId: conv._id, new: true });
        })
        .catch((err) => next(err));
    }
  });
};

exports.getConversationMessages = (req, res, next) => {
  const conversationId = req.params.conversationId;

  Conversation.findById(conversationId)
    .then((conversation) => {
      if (!conversation) {
        const error = new Error("This conversation doesn't exist");
        error.statusCode = 400;
        return next(error);
      }
      Message.find({ conversation: conversationId }).then((messages) => {
        return res.json({ messages });
      });
    })

    .catch((err) => next(err));
};
