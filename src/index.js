const path = require("path");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

// Đường dẫn tĩnh đến thư mục 'public'
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Biến đếm ban đầu
let count = 0;

// Kết nối socket
io.on("connection", (socket) => {
  console.log("Bước 1: Một người dùng đã kết nối"); // Log khi một client kết nối

  // Gửi giá trị đếm hiện tại khi user kết nối
  socket.emit("countupdate", count);
  console.log(`Bước 2: Gửi giá trị đếm ban đầu: ${count}`); // Log giá trị đếm hiện tại

  // Lắng nghe sự kiện 'increment' từ client
  socket.on("increment", () => {
    count++; // Tăng giá trị đếm
    console.log(`Bước 3: Nhận sự kiện increment, giá trị đếm mới: ${count}`); // Log khi nhận sự kiện increment
    // Phát sự kiện 'countupdate' với giá trị mới đến tất cả các client
    io.emit("countupdate", count);
    console.log(
      `Bước 4: Phát lại giá trị đếm mới cho tất cả các client: ${count}`
    ); // Log khi phát giá trị mới
  });
});

// Lắng nghe server trên port 3000
server.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`); // Log khi server bắt đầu lắng nghe
});
