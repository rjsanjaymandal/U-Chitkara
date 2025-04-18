const mongoose = require("mongoose");

// Define the schema for user preferences
const userPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  interests: [
    {
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
      weight: {
        type: Number,
        default: 1,
      },
    },
  ],
  preferredLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  careerGoals: [String],
  learningPaths: [
    {
      path: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LearningPath",
      },
      progress: {
        type: Number, // percentage of completion
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      lastActivity: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  learningStyle: {
    type: String,
    enum: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic", "Mixed"],
    default: "Mixed",
  },
  availableTimePerWeek: {
    type: Number, // in hours
    default: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
module.exports = mongoose.model("UserPreference", userPreferenceSchema);
