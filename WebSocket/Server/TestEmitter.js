const { io } = require("socket.io-client");

const socket = io("wss://your-server-url.com", {
  withCredentials: true,
  // You can add headers or tokens here if needed for your backend
});

socket.on("connect", () => {
  console.log("✅ Connected to server");

  // Join the same room your React app is listening to
  const roomId = "my-room-id";
  socket.emit("join-room", roomId);

  console.log(`🚪 Joined room: ${roomId}`);

  // Send a test message to that room after a short delay
  setTimeout(() => {
    socket.emit("message", {
      room: roomId,
      text: "📢 Hello from script!",
    });
    console.log("📨 Message sent to room");
  }, 1000);
});

socket.on("connect_error", (err) => {
  console.error("Connection error:", err.message);
});
