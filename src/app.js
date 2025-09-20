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

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/profile", profilesRoutes);
app.use("/chats", chatRoutes);
app.use("/events", eventRoutes);
app.use("/connections", connectionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

module.exports = app;
