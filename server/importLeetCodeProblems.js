const mongoose = require("mongoose");
const Problem = require("./models/Problem");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config();

// Sample LeetCode problems data
const sampleProblems = [
  {
    problemId: 1,
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n**Example 1:**\n\n```\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].\n```\n\n**Example 2:**\n\n```\nInput: nums = [3,2,4], target = 6\nOutput: [1,2]\n```\n\n**Example 3:**\n\n```\nInput: nums = [3,3], target = 6\nOutput: [0,1]\n```\n\n**Constraints:**\n\n- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`\n- Only one valid answer exists.",
    category: "Arrays & Hashing",
    tags: ["Array", "Hash Table"],
    acceptance: 49.1,
    frequency: 100,
    url: "https://leetcode.com/problems/two-sum/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Google", "Apple", "Microsoft", "Facebook"],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try to use the fact that the complement of a number can be found in constant time using a hash table.",
    ],
    solution:
      "The key insight is to use a hash map to store the numbers we've seen so far and their indices. For each number, we check if its complement (target - current number) exists in the hash map. If it does, we've found our pair.\n\n```javascript\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    \n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        \n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        \n        map.set(nums[i], i);\n    }\n    \n    return [];\n};\n```\n\nTime Complexity: O(n) where n is the length of the array\nSpace Complexity: O(n) for the hash map",
  },
  {
    problemId: 20,
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    description:
      "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n**Example 1:**\n\n```\nInput: s = \"()\"\nOutput: true\n```\n\n**Example 2:**\n\n```\nInput: s = \"()[]{}\"\nOutput: true\n```\n\n**Example 3:**\n\n```\nInput: s = \"(]\"\nOutput: false\n```\n\n**Constraints:**\n\n- `1 <= s.length <= 10^4`\n- `s` consists of parentheses only `'()[]{}'`.",
    category: "Stack",
    tags: ["String", "Stack"],
    acceptance: 40.5,
    frequency: 85,
    url: "https://leetcode.com/problems/valid-parentheses/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def isValid(self, s: str) -> bool:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Microsoft", "Facebook", "Google", "Apple"],
    hints: [
      "Think about using a stack data structure.",
      "When you encounter an opening bracket, push it onto the stack.",
      "When you encounter a closing bracket, check if it matches the top of the stack.",
    ],
    solution:
      "We can use a stack to keep track of opening brackets. When we encounter a closing bracket, we check if it matches the most recent opening bracket (the top of the stack).\n\n```javascript\nvar isValid = function(s) {\n    const stack = [];\n    const map = {\n        ')': '(',\n        '}': '{',\n        ']': '['\n    };\n    \n    for (let char of s) {\n        // If it's a closing bracket\n        if (char in map) {\n            // Pop the top element if the stack is not empty, otherwise use a dummy value\n            const topElement = stack.length > 0 ? stack.pop() : '#';\n            \n            // If the popped element doesn't match the corresponding opening bracket\n            if (topElement !== map[char]) {\n                return false;\n            }\n        } else {\n            // If it's an opening bracket, push onto the stack\n            stack.push(char);\n        }\n    }\n    \n    // If the stack is empty, all brackets were matched\n    return stack.length === 0;\n};\n```\n\nTime Complexity: O(n) where n is the length of the string\nSpace Complexity: O(n) for the stack",
  },
  {
    problemId: 121,
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.\n\n**Example 1:**\n\n```\nInput: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.\nNote that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.\n```\n\n**Example 2:**\n\n```\nInput: prices = [7,6,4,3,1]\nOutput: 0\nExplanation: In this case, no transactions are done and the max profit = 0.\n```\n\n**Constraints:**\n\n- `1 <= prices.length <= 10^5`\n- `0 <= prices[i] <= 10^4`",
    category: "Dynamic Programming",
    tags: ["Array", "Dynamic Programming"],
    acceptance: 54.3,
    frequency: 90,
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} prices\n * @return {number}\n */\nvar maxProfit = function(prices) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Facebook", "Microsoft", "Google"],
    hints: [
      "Try to find the minimum price seen so far and the maximum profit that can be achieved.",
      "You need to buy before you can sell.",
    ],
    solution:
      "We can solve this problem in one pass by keeping track of the minimum price seen so far and the maximum profit that can be achieved.\n\n```javascript\nvar maxProfit = function(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    \n    for (let i = 0; i < prices.length; i++) {\n        // Update the minimum price seen so far\n        if (prices[i] < minPrice) {\n            minPrice = prices[i];\n        }\n        // Update the maximum profit if selling at the current price would yield a higher profit\n        else if (prices[i] - minPrice > maxProfit) {\n            maxProfit = prices[i] - minPrice;\n        }\n    }\n    \n    return maxProfit;\n};\n```\n\nTime Complexity: O(n) where n is the length of the prices array\nSpace Complexity: O(1) as we only use two variables",
  },
  {
    problemId: 53,
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    difficulty: "Medium",
    description:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nA **subarray** is a contiguous part of an array.\n\n**Example 1:**\n\n```\nInput: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: [4,-1,2,1] has the largest sum = 6.\n```\n\n**Example 2:**\n\n```\nInput: nums = [1]\nOutput: 1\n```\n\n**Example 3:**\n\n```\nInput: nums = [5,4,-1,7,8]\nOutput: 23\n```\n\n**Constraints:**\n\n- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`\n\n**Follow up:** If you have figured out the `O(n)` solution, try coding another solution using the **divide and conquer** approach, which is more subtle.",
    category: "Dynamic Programming",
    tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
    acceptance: 49.5,
    frequency: 80,
    url: "https://leetcode.com/problems/maximum-subarray/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} nums\n * @return {number}\n */\nvar maxSubArray = function(nums) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Microsoft", "Apple", "Google", "Facebook"],
    hints: [
      "Try using Kadane's algorithm.",
      "Keep track of the current sum and the maximum sum seen so far.",
    ],
    solution:
      "We can use Kadane's algorithm to solve this problem in O(n) time. The idea is to keep track of the maximum sum ending at each position and the global maximum sum.\n\n```javascript\nvar maxSubArray = function(nums) {\n    let currentSum = nums[0];\n    let maxSum = nums[0];\n    \n    for (let i = 1; i < nums.length; i++) {\n        // Either start a new subarray or extend the existing one\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        // Update the maximum sum if the current sum is greater\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    \n    return maxSum;\n};\n```\n\nTime Complexity: O(n) where n is the length of the array\nSpace Complexity: O(1) as we only use two variables",
  },
  {
    problemId: 200,
    title: "Number of Islands",
    slug: "number-of-islands",
    difficulty: "Medium",
    description:
      'Given an `m x n` 2D binary grid `grid` which represents a map of `\'1\'`s (land) and `\'0\'`s (water), return the number of islands.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.\n\n**Example 1:**\n\n```\nInput: grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]\nOutput: 1\n```\n\n**Example 2:**\n\n```\nInput: grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]\nOutput: 3\n```\n\n**Constraints:**\n\n- `m == grid.length`\n- `n == grid[i].length`\n- `1 <= m, n <= 300`\n- `grid[i][j]` is `\'0\'` or `\'1\'`.',
    category: "Graph",
    tags: [
      "Array",
      "Depth-First Search",
      "Breadth-First Search",
      "Union Find",
      "Matrix",
    ],
    acceptance: 53.1,
    frequency: 75,
    url: "https://leetcode.com/problems/number-of-islands/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {character[][]} grid\n * @return {number}\n */\nvar numIslands = function(grid) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public int numIslands(char[][] grid) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Microsoft", "Google", "Facebook", "Bloomberg"],
    hints: [
      "Try using depth-first search (DFS) or breadth-first search (BFS) to explore each island.",
      "When you find a land cell ('1'), increment your island count and use DFS/BFS to mark all connected land cells as visited.",
    ],
    solution:
      "We can use depth-first search (DFS) to solve this problem. When we find a land cell ('1'), we increment our island count and use DFS to mark all connected land cells as visited by changing them to '0'.\n\n```javascript\nvar numIslands = function(grid) {\n    if (!grid || grid.length === 0) return 0;\n    \n    const rows = grid.length;\n    const cols = grid[0].length;\n    let count = 0;\n    \n    // DFS to mark all connected land cells as visited\n    const dfs = (r, c) => {\n        // Check if out of bounds or if the cell is water\n        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {\n            return;\n        }\n        \n        // Mark as visited\n        grid[r][c] = '0';\n        \n        // Check all four directions\n        dfs(r + 1, c); // down\n        dfs(r - 1, c); // up\n        dfs(r, c + 1); // right\n        dfs(r, c - 1); // left\n    };\n    \n    // Iterate through the grid\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (grid[r][c] === '1') {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    \n    return count;\n};\n```\n\nTime Complexity: O(m * n) where m is the number of rows and n is the number of columns\nSpace Complexity: O(m * n) in the worst case for the recursion stack",
  },
  {
    problemId: 42,
    title: "Trapping Rain Water",
    slug: "trapping-rain-water",
    difficulty: "Hard",
    description:
      "Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.\n\n**Example 1:**\n\n![Trapping Rain Water](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png)\n\n```\nInput: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6\nExplanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.\n```\n\n**Example 2:**\n\n```\nInput: height = [4,2,0,3,2,5]\nOutput: 9\n```\n\n**Constraints:**\n\n- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`",
    category: "Two Pointers",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    acceptance: 55.8,
    frequency: 70,
    url: "https://leetcode.com/problems/trapping-rain-water/",
    codeSnippets: [
      {
        language: "javascript",
        code: "/**\n * @param {number[]} height\n * @return {number}\n */\nvar trap = function(height) {\n    \n};",
      },
      {
        language: "python",
        code: "class Solution:\n    def trap(self, height: List[int]) -> int:\n        ",
      },
      {
        language: "java",
        code: "class Solution {\n    public int trap(int[] height) {\n        \n    }\n}",
      },
      {
        language: "cpp",
        code: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};",
      },
    ],
    companies: ["Amazon", "Google", "Microsoft", "Facebook", "Apple"],
    hints: [
      "Try using two pointers from left and right.",
      "The amount of water that can be trapped at each position depends on the minimum of the maximum height to its left and right.",
    ],
    solution:
      "We can use a two-pointer approach to solve this problem efficiently. The idea is to maintain two pointers, left and right, and two variables to keep track of the maximum height seen from the left and right sides.\n\n```javascript\nvar trap = function(height) {\n    if (height.length === 0) return 0;\n    \n    let left = 0;\n    let right = height.length - 1;\n    let leftMax = height[left];\n    let rightMax = height[right];\n    let water = 0;\n    \n    while (left < right) {\n        if (leftMax < rightMax) {\n            left++;\n            leftMax = Math.max(leftMax, height[left]);\n            water += leftMax - height[left];\n        } else {\n            right--;\n            rightMax = Math.max(rightMax, height[right]);\n            water += rightMax - height[right];\n        }\n    }\n    \n    return water;\n};\n```\n\nTime Complexity: O(n) where n is the length of the height array\nSpace Complexity: O(1) as we only use a constant amount of extra space",
  },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the same database connection string as the main server
    const dbUrl =
      process.env.MONGODB_URL || "mongodb://localhost:27017/u-chitkara";

    console.log("Connecting to MongoDB at:", dbUrl);

    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Import problems
const importProblems = async () => {
  try {
    await connectDB();

    // Clear existing problems
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert sample problems
    const result = await Problem.insertMany(sampleProblems);
    console.log(`Imported ${result.length} problems successfully`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error importing problems:", error);
    process.exit(1);
  }
};

// Run the import
importProblems();
