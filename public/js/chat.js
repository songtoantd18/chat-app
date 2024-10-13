const socket = io();

// Lắng nghe sự kiện 'countupdate' từ server
socket.on("countupdate", (count) => {
  console.log("Đã nhận sự kiện count update từ server", count);
});

document.getElementById("increment").addEventListener("click", () => {
  console.log("Nút +1 được nhấn");
  // Gửi sự kiện 'increment' đến server khi nút được nhấn
  socket.emit("increment");
});
