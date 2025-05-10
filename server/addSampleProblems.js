const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Define the Problem schema
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
    url: {
      type: String,
      required: true,
    },
    tags: [String],
    codeSnippets: [
      {
        language: String,
        code: String,
      },
    ],
  },
  { timestamps: true }
);

// Create the Problem model
const Problem = mongoose.model("Problem", problemSchema);

// Sample problems
const sampleProblems = [
  {
    problemId: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    url: "https://leetcode.com/problems/two-sum/",
    tags: ["Array", "Hash Table"],
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      },
    ],
  },
  {
    problemId: 2,
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    url: "https://leetcode.com/problems/add-two-numbers/",
    tags: ["Linked List", "Math", "Recursion"],
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};",
      },
    ],
  },
  {
    problemId: 3,
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    tags: ["Hash Table", "String", "Sliding Window"],
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};",
      },
    ],
  },
];

// Connect to MongoDB and add sample problems
async function addSampleProblems() {
  try {
    // Connect to MongoDB
    const dbUrl =
      process.env.MONGODB_URL || "mongodb://localhost:27017/u-chitkara";
    console.log("Connecting to MongoDB at:", dbUrl);

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert sample problems
    const result = await Problem.insertMany(sampleProblems);
    console.log(`Added ${result.length} sample problems`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function
addSampleProblems();
