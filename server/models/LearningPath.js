const mongoose = require("mongoose");

// Define the schema for a learning path
const learningPathSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
      order: {
        type: Number,
        required: true,
      },
    },
  ],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  estimatedCompletionTime: {
    type: Number, // in hours
    required: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Draft", "Published"],
    default: "Draft",
  },
});

// Create and export the model
module.exports = mongoose.model("LearningPath", learningPathSchema);
