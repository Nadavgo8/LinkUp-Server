// const express = require("express");
// const auth = require("../middlewares/authMiddleware");
// const {
//   getChats,
//   getMessages,
//   sendMessage,
// } = require("../controllers/chatController");

// const router = express.Router();

// // All chat routes require authentication
// router.use(auth);

// // GET /chats - Get all user chats/matches
// router.get("/", getChats);

// // GET /chats/connections - Get all matches (users that liked each other)
// router.get("/connections", async (req, res) => {
//   try {
//     // Here you will want to write logic in the controller:
//     // 1. Find all users I did the same to
//     // 2. Find all users who did the same to me
//     // 3. Return the cut (matches)
//     res.json({ msg: "Connections list (matches)" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // GET /chats/:chatId/messages - Get messages for specific chat
// router.get("/:chatId/messages", getMessages);

// // POST /chats/:chatId/messages - Send a message to specific chat
// router.post("/:chatId/messages", sendMessage);

// module.exports = router;
