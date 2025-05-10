const mongoose = require("mongoose");

// Define the UserProblemProgress schema
const userProblemProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["solved", "attempted", "bookmarked", "skipped"],
      default: "attempted",
    },
    lastSubmittedCode: {
      type: String,
      default: null,
    },
    language: {
      type: String,
      default: "javascript",
    },
    submissionTime: {
      type: Date,
      default: Date.now,
    },
    executionTime: {
      type: Number, // in milliseconds
      default: null,
    },
    memoryUsed: {
      type: Number, // in KB
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    difficulty: {
      type: Number, // User-rated difficulty (1-5)
      min: 1,
      max: 5,
      default: null,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one progress entry per problem
userProblemProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

// Export the UserProblemProgress model
module.exports = mongoose.model("UserProblemProgress", userProblemProgressSchema);
