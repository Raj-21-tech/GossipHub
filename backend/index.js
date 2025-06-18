const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");

// ✅ Load environment variables
dotenv.config();

// ✅ Create Express app and server
const app = express();
const server = http.createServer(app);

// ✅ CORS setup for frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://gossiphub-frontend.vercel.app",
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

// ✅ API routes
app.use("/api/auth", authRoutes);

// ✅ MongoDB connection
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ✅ Socket.io initialization
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected");

  socket.on("send_message", (message) => {
    socket.broadcast.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
