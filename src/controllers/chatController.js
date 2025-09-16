const Chat = require("../models/Chat");
const Message = require("../models/Message");

exports.getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.userId,
    })
      .populate("participants", "fullName photoUrl")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId,
    });

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found or access denied" });
    }

    const messages = await Message.find({ chatId })
      .populate("sender", "fullName photoUrl")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.sendMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = "text" } = req.body;

    if (!content) {
      return res.status(400).json({ msg: "Message content is required" });
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.userId,
    });

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found or access denied" });
    }

    const newMessage = new Message({
      chatId,
      sender: req.userId,
      content,
      messageType,
    });

    await newMessage.save();

    chat.lastMessage = newMessage._id;
    chat.updatedAt = new Date();
    await chat.save();

    await newMessage.populate("sender", "fullName photoUrl");

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
};
