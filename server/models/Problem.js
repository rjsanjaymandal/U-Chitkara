const mongoose = require("mongoose");

// Define the Problem schema for LeetCode problems
const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Algorithms",
    },
    tags: {
      type: [String],
      default: [],
    },
    acceptance: {
      type: Number, // Percentage of acceptance
      default: 0,
    },
    frequency: {
      type: Number, // Popularity/frequency score
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
    codeSnippets: [
      {
        language: {
          type: String,
          required: true,
        },
        code: {
          type: String,
          required: true,
        },
      },
    ],
    companies: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    solution: {
      type: String,
      default: null,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create indexes for efficient querying
problemSchema.index({ problemId: 1 });
problemSchema.index({ slug: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

// Export the Problem model
module.exports = mongoose.model("Problem", problemSchema);
