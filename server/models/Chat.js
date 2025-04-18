const mongoose = require("mongoose");

// Define the schema for individual chat messages
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      enum: ["user", "ai"], // Message can be from user or AI
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

// Define the schema for chat sessions
const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [messageSchema],
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Export the Mongoose model for the chat schema
module.exports = mongoose.model("Chat", chatSchema);
