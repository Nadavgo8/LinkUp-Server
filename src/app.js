const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profilesRoutes = require("./routes/profilesRoutes");
const chatRoutes = require("./routes/chatRoutes");
const eventRoutes = require("./routes/eventRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const { StreamChat } = require("stream-chat");
const { createStreamRouter } = require("./routes/streamRoutes");
const { createChatRouter } = require("./routes/chat");
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(morgan("dev"));
app.use(express.json());

const { STREAM_API_KEY, STREAM_API_SECRET } = process.env;
if (!STREAM_API_KEY || !STREAM_API_SECRET) {
  throw new Error("Missing STREAM_API_KEY / STREAM_API_SECRET");
}
const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/profile", profilesRoutes);
// app.use("/chats", chatRoutes);
app.use("/events", eventRoutes);
app.use("/connections", connectionRoutes);
app.use("/api/stream", createStreamRouter(serverClient)); // POST /api/stream/token
app.use("/api/chat", createChatRouter(serverClient)); // POST /api/chat/ensure-dm

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

module.exports = app;
