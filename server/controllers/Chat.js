const Chat = require("../models/Chat");
const User = require("../models/User");
const axios = require("axios");
require("dotenv").config();

// Create a new chat session
exports.createChat = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newChat = await Chat.create({
      user: userId,
      title: "New Chat",
      messages: [],
    });

    return res.status(201).json({
      success: true,
      data: newChat,
      message: "Chat session created successfully",
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create chat session",
      error: error.message,
    });
  }
};

// Get all chat sessions for a user
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const chats = await Chat.find({ user: userId })
      .sort({ lastUpdated: -1 })
      .select("title lastUpdated _id");

    return res.status(200).json({
      success: true,
      data: chats,
      message: "User chats retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving user chats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user chats",
      error: error.message,
    });
  }
};

// Get a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Ensure the user owns this chat
    if (chat.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to chat",
      });
    }

    return res.status(200).json({
      success: true,
      data: chat,
      message: "Chat retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve chat",
      error: error.message,
    });
  }
};

// Send a message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message, courseContext } = req.body;
    const userId = req.user.id;

    // Find the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Ensure the user owns this chat
    if (chat.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to chat",
      });
    }

    // Add user message to chat
    chat.messages.push({
      sender: "user",
      content: message,
    });

    // Update lastUpdated timestamp
    chat.lastUpdated = Date.now();

    // If this is the first message, update the chat title
    if (chat.messages.length === 1) {
      // Use the first ~30 characters of the message as the title
      chat.title = message.length > 30 ? message.substring(0, 30) + "..." : message;
    }

    // Save the chat with the user message
    await chat.save();

    // Prepare context for AI
    let context = "You are an AI tutor helping a student with their studies. ";
    
    if (courseContext) {
      context += `The student is currently studying: ${courseContext}. `;
    }
    
    context += "Provide helpful, educational responses that guide the student to understand concepts rather than just giving answers.";

    // Get AI response
    try {
      // Call your preferred AI API here (OpenAI, Anthropic, etc.)
      // This is a placeholder for the actual API call
      const aiResponse = await getAIResponse(message, context, chat.messages);

      // Add AI response to chat
      chat.messages.push({
        sender: "ai",
        content: aiResponse,
      });

      // Save the chat with the AI response
      await chat.save();

      return res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          aiResponse: aiResponse,
          chatId: chat._id,
        },
        message: "Message sent and response received",
      });
    } catch (aiError) {
      console.error("Error getting AI response:", aiError);
      
      // Even if AI response fails, we've already saved the user message
      return res.status(500).json({
        success: false,
        message: "Failed to get AI response",
        error: aiError.message,
        chatId: chat._id,
        userMessageSaved: true,
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Ensure the user owns this chat
    if (chat.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to chat",
      });
    }

    await Chat.findByIdAndDelete(chatId);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

// Clear chat messages
exports.clearChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Ensure the user owns this chat
    if (chat.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to chat",
      });
    }

    // Clear messages but keep the chat
    chat.messages = [];
    chat.title = "New Chat";
    await chat.save();

    return res.status(200).json({
      success: true,
      message: "Chat cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear chat",
      error: error.message,
    });
  }
};

// Helper function to get AI response
// This is a placeholder - you'll need to implement the actual API call
async function getAIResponse(userMessage, context, chatHistory) {
  try {
    // For demonstration purposes, we'll use a simple API call
    // In production, you would use a more sophisticated AI service like OpenAI or Anthropic
    
    // Check if AI API key is configured
    if (!process.env.AI_API_KEY) {
      console.log("AI API key is not configured");
      return "I'm sorry, but the AI service is not properly configured. Please contact the administrator.";
    }
    
    // Format chat history for context
    const formattedHistory = chatHistory
      .slice(-10) // Only use the last 10 messages for context
      .map(msg => `${msg.sender === 'user' ? 'Student' : 'AI Tutor'}: ${msg.content}`)
      .join('\n');
    
    // In a real implementation, you would call your AI service here
    // For now, we'll return a placeholder response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where you would make the actual API call
    // const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //   model: "gpt-3.5-turbo",
    //   messages: [
    //     { role: "system", content: context },
    //     ...chatHistory.map(msg => ({
    //       role: msg.sender === 'user' ? 'user' : 'assistant',
    //       content: msg.content
    //     }))
    //   ]
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AI_API_KEY}`,
    //     'Content-Type': 'application/json'
    //   }
    // });
    
    // return response.data.choices[0].message.content;
    
    // For now, return a placeholder response
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return "Hello! I'm your AI study assistant. How can I help you with your learning today?";
    } else if (userMessage.toLowerCase().includes('javascript')) {
      return "JavaScript is a versatile programming language primarily used for web development. What specific aspect of JavaScript are you struggling with?";
    } else if (userMessage.toLowerCase().includes('python')) {
      return "Python is known for its readability and simplicity, making it great for beginners. What Python concept would you like me to explain?";
    } else if (userMessage.toLowerCase().includes('algorithm')) {
      return "Algorithms are step-by-step procedures for solving problems. They're fundamental to computer science and programming. Would you like me to explain a specific algorithm or concept?";
    } else {
      return "I understand you're asking about: " + userMessage + ". Could you provide more details about what you're trying to learn or what's challenging you? That way, I can give you more targeted help.";
    }
  } catch (error) {
    console.error("Error in AI response generation:", error);
    return "I'm sorry, but I encountered an error while processing your request. Please try again later.";
  }
}
