require("dotenv").config();
const express = require('express');
const http = require("http");
const pool = require('./src/config/db');
const { Server } = require("socket.io");
const authRoutes=require('./src/routes/authRoutes');


const app = express();
app.use(express.json());
const server = http.createServer(app);
app.use('/api/auth',authRoutes);
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/test.html");
});
const io = new Server(server, {
  cors: { origin: "*" }
});


let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers[userId] = socket.id;
    socket.join(userId);
  });

  socket.on("send_message", async (data) => {
    const { senderId, receiverId, message } = data;

    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message) VALUES ($1,$2,$3)",
      [senderId, receiverId, message]
    );

    io.to(receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
}); 
const PORT = process.env.PORT || 7000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});