const path = require("path");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Cung cấp thư mục public
app.use(express.static(path.join(__dirname, "../public")));

// Lưu trữ thông tin người dùng và phòng
const users = {};

io.on("connection", (socket) => {
  console.log("Client connected");

  // Khi người dùng tham gia phòng
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);
    users[socket.id] = { username, room };

    socket.emit("message", {
      username: "Admin",
      message: `Chào mừng ${username} đến với ${room}!`,
    });

    socket.broadcast.to(room).emit("message", {
      username: "Admin",
      message: `${username} đã tham gia!`,
    });
  });

  // Khi người dùng gửi tin nhắn
  socket.on("chatMessage", ({ username, room, message }) => {
    io.to(room).emit("message", { username, message });
  });

  // Khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      socket.broadcast.to(user.room).emit("message", {
        username: "Admin",
        message: `${user.username} đã rời khỏi phòng!`,
      });
      delete users[socket.id];
    }
  });
});

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
