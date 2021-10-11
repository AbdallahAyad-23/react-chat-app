const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
