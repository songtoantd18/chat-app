// server.js
const path = require("path");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

/// server.js
let count = 0;

// server.js
io.on("connection", (socket) => {
  console.log("Client connected");

  // Lắng nghe sự kiện "join" từ client và gửi thông báo đến tất cả các client khác
  socket.on("join", (data) => {
    console.log(`New user joined from ${data.location} at ${data.time}`);
    socket.broadcast.emit(
      "message",
      `A new user has joined the chat from ${data.location} at ${data.time}`
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    socket.broadcast.emit("message", "A user has left the chat");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
