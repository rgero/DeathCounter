const { Server } = require("socket.io");
const io = new Server(7778, {
  cors: {
    origin: "http://localhost:6200",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`Joined room ${room}`);
    io.to(room).emit("message", `User joined room: ${room}`);
  });

  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.to(data.room).emit("message", data.text);
  });
});
