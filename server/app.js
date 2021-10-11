require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { httpServer, app, io } = require("./socket");
const authRouter = require("./src/routes/auth");
const messageRouter = require("./src/routes/message");
const conversationRouter = require("./src/routes/conversation");
const mongoose = require("mongoose");

const mongoDB = process.env.DB;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(authRouter);
app.use(messageRouter);
app.use(conversationRouter);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message, data: error.data });
});

const port = process.env.PORT || 5000;

let users = [];
io.on("connection", (socket) => {
  const { username, userId } = socket.handshake.auth;
  console.log("connected", username);
  users.push({ username, userId });
  console.log(users);
  socket.emit("users", users);
  socket.broadcast.emit("user join", { username, userId });

  socket.on("join room", (convId) => {
    console.log("joined");
    socket.join(convId);
    socket.on("chat message", (message) => {
      console.log(message);
      socket.to(convId).emit("private message", message);
    });
  });

  socket.on("disconnect", () => {
    users = users.filter((user) => user.userId !== userId);
    socket.broadcast.emit("users", users);
  });
});

httpServer.listen(port, () => {
  console.log("Listening on " + port);
});
