const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
  deleteChat,
  clearChat,
} = require("../controllers/Chat");

// Create a new chat session
router.post("/create", auth, createChat);

// Get all chat sessions for a user
router.get("/", auth, getUserChats);

// Get a specific chat by ID
router.get("/:chatId", auth, getChatById);

// Send a message and get AI response
router.post("/message", auth, sendMessage);

// Delete a chat
router.delete("/:chatId", auth, deleteChat);

// Clear chat messages
router.put("/clear/:chatId", auth, clearChat);

module.exports = router;
