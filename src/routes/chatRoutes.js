const express = require("express");
const auth = require("../middlewares/authMiddleware");
const {
  getChats,
  getMessages,
  sendMessage,
} = require("../controllers/chatController");

const router = express.Router();

// All chat routes require authentication
router.use(auth);

// GET /chats - Get all user chats/matches
router.get("/", getChats);

// GET /chats/:chatId/messages - Get messages for specific chat
router.get("/:chatId/messages", getMessages);

// POST /chats/:chatId/messages - Send a message to specific chat
router.post("/:chatId/messages", sendMessage);

module.exports = router;
