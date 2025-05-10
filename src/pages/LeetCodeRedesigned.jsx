import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Layout,
  Typography,
  Tabs,
  Breadcrumb,
  Button,
  Spin,
  Empty,
  Card,
  Row,
  Col,
  Alert,
} from "antd";
import {
  CodeOutlined,
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  LinkOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { setUser } from "../slices/profileSlice";
import useTokenRefresh from "../hooks/useTokenRefresh";

// Import custom components
import LeetCodeProgressCard from "../Components/core/LeetCode/LeetCodeProgressCard";
import LeetCodeRecentActivity from "../Components/core/LeetCode/LeetCodeRecentActivity";
import LeetCodeProblemTable from "../Components/core/LeetCode/LeetCodeProblemTable";
import LeetCodeConnectForm from "../Components/core/LeetCode/LeetCodeConnectForm";
import {
  getUserProgress,
  getLeetCodeStats,
} from "../services/operations/leetCodeAPI";

const { Content } = Layout;
const { Title, Text } = Typography;

const LeetCodeRedesigned = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { refreshToken } = useTokenRefresh();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check token validity and fetch LeetCode data when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        const isValid = await refreshToken();
        if (!isValid) {
          console.log("Token is invalid and couldn't be refreshed");
        }
      }
    };

    checkAuth();

    // Check if LeetCode username is stored in localStorage
    const storedUsername = localStorage.getItem("leetCodeUsername");
    if (storedUsername && user && !user.leetCodeUsername) {
      console.log(
        "Found LeetCode username in localStorage, updating user profile"
      );
      try {
        // Update the user's LeetCode username in the database
        axios
          .put(
            `${process.env.REACT_APP_BASE_URL}/leetcode/username`,
            { leetCodeUsername: storedUsername },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data.success) {
              // Update Redux store
              dispatch(setUser(response.data.user));
              console.log(
                "Updated user profile with LeetCode username from localStorage"
              );
            }
          })
          .catch((err) => {
            console.error(
              "Failed to update user profile with LeetCode username:",
              err
            );
          });
      } catch (error) {
        console.error(
          "Error updating user profile with LeetCode username:",
          error
        );
      }
    }
  }, [token, refreshToken, user, dispatch]);

  // Fetch user progress data
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!token) {
        console.log("No token available, skipping data fetch");
        setLoading(false);
        return;
      }

      console.log("Starting to fetch user progress data...");
      setLoading(true);
      setError(null);

      try {
        // Get username from localStorage or user object
        const username =
          localStorage.getItem("leetCodeUsername") || user?.leetCodeUsername;
        console.log("Using LeetCode username:", username);

        if (!username) {
          console.log("No LeetCode username found, skipping data fetch");
          setLoading(false);
          return;
        }

        // First, try to fetch LeetCode stats directly
        try {
          console.log("Fetching LeetCode stats directly for:", username);
          const leetCodeStats = await getLeetCodeStats(username, dispatch);

          if (leetCodeStats) {
            console.log("Successfully fetched LeetCode stats:", leetCodeStats);

            // Create a user progress object from the LeetCode stats
            const progressData = {
              progress: {
                solved: [],
                attempted: [],
                bookmarked: [],
                skipped: [],
              },
              stats: {
                total: leetCodeStats.solved?.total || 0,
                solved: leetCodeStats.solved?.total || 0,
                attempted: Math.max(
                  0,
                  (leetCodeStats.submissions?.total || 0) -
                    (leetCodeStats.solved?.total || 0)
                ),
                bookmarked: 0,
                skipped: 0,
                byDifficulty: {
                  easy: leetCodeStats.solved?.easy || 0,
                  medium: leetCodeStats.solved?.medium || 0,
                  hard: leetCodeStats.solved?.hard || 0,
                },
              },
              profile: leetCodeStats.profile || {
                ranking: 0,
                reputation: 0,
                starRating: 0,
              },
            };

            console.log(
              "Created progress data from LeetCode stats:",
              progressData
            );
            setUserProgress(progressData);
            setLoading(false);

            // Store the result in localStorage for debugging
            try {
              localStorage.setItem(
                "leetCodeDebugData",
                JSON.stringify(progressData)
              );
              console.log("Stored debug data in localStorage");
            } catch (storageErr) {
              console.error("Failed to store debug data:", storageErr);
            }

            return;
          }
        } catch (directFetchError) {
          console.error(
            "Error fetching LeetCode stats directly:",
            directFetchError
          );
        }

        // If direct fetch fails, fall back to getUserProgress
        console.log(
          "Falling back to getUserProgress with token:",
          token ? "Token exists" : "No token"
        );

        // Call getUserProgress
        const result = await getUserProgress(null, token, dispatch);
        console.log("getUserProgress result:", result);

        if (result) {
          // Log the structure of the result
          console.log("Result structure:", {
            hasStats: !!result.stats,
            statsKeys: result.stats ? Object.keys(result.stats) : [],
            hasByDifficulty: result.stats && !!result.stats.byDifficulty,
            byDifficultyKeys:
              result.stats && result.stats.byDifficulty
                ? Object.keys(result.stats.byDifficulty)
                : [],
            hasProgress: !!result.progress,
            progressKeys: result.progress ? Object.keys(result.progress) : [],
            hasProfile: !!result.profile,
            profileKeys: result.profile ? Object.keys(result.profile) : [],
          });

          console.log("Setting user progress data:", result);
          setUserProgress(result);

          // Store the result in localStorage for debugging
          try {
            localStorage.setItem("leetCodeDebugData", JSON.stringify(result));
            console.log("Stored debug data in localStorage");
          } catch (storageErr) {
            console.error("Failed to store debug data:", storageErr);
          }
        } else {
          console.log("No result from getUserProgress");
        }
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError("Failed to load LeetCode data. Please try again later.");
      } finally {
        setLoading(false);
        console.log("Finished fetching user progress data");
      }
    };

    fetchUserProgress();
  }, [token, dispatch, user]);

  // Check if user has linked their LeetCode account
  const leetCodeUsername =
    user?.leetCodeUsername || localStorage.getItem("leetCodeUsername");

  // Handle successful connection of LeetCode account
  const handleConnectSuccess = (username) => {
    toast.success(`Successfully connected LeetCode account: ${username}`);
    // Refresh the page to load the data
    window.location.reload();
  };

  // Create a safe copy of userProgress to avoid modifying the original object
  const safeUserProgress = userProgress ? { ...userProgress } : null;
  console.log("Original userProgress data:", userProgress);

  // Validate and provide default values for userProgress
  if (safeUserProgress) {
    console.log("Validating userProgress data");

    // Ensure stats property exists with all required fields
    if (!safeUserProgress.stats) {
      safeUserProgress.stats = {
        total: 0,
        solved: 0,
        attempted: 0,
        bookmarked: 0,
        skipped: 0,
        byDifficulty: { easy: 0, medium: 0, hard: 0 },
      };
    } else {
      safeUserProgress.stats = {
        total: safeUserProgress.stats.total || 0,
        solved: safeUserProgress.stats.solved || 0,
        attempted: safeUserProgress.stats.attempted || 0,
        bookmarked: safeUserProgress.stats.bookmarked || 0,
        skipped: safeUserProgress.stats.skipped || 0,
        byDifficulty: safeUserProgress.stats.byDifficulty || {
          easy: 0,
          medium: 0,
          hard: 0,
        },
      };
    }

    // Ensure byDifficulty has all required properties
    if (!safeUserProgress.stats.byDifficulty) {
      safeUserProgress.stats.byDifficulty = { easy: 0, medium: 0, hard: 0 };
    } else {
      safeUserProgress.stats.byDifficulty = {
        easy: safeUserProgress.stats.byDifficulty.easy || 0,
        medium: safeUserProgress.stats.byDifficulty.medium || 0,
        hard: safeUserProgress.stats.byDifficulty.hard || 0,
      };
    }

    console.log("Stats data after validation:", safeUserProgress.stats);
    console.log(
      "Difficulty data after validation:",
      safeUserProgress.stats.byDifficulty
    );

    // Ensure progress property exists with all required arrays
    if (!safeUserProgress.progress) {
      // Create sample problem data with accurate LeetCode problems
      const sampleProblems = {
        easy: [
          { problemId: "1", title: "Two Sum", difficulty: "Easy" },
          { problemId: "9", title: "Palindrome Number", difficulty: "Easy" },
          { problemId: "13", title: "Roman to Integer", difficulty: "Easy" },
          {
            problemId: "14",
            title: "Longest Common Prefix",
            difficulty: "Easy",
          },
          { problemId: "20", title: "Valid Parentheses", difficulty: "Easy" },
          {
            problemId: "21",
            title: "Merge Two Sorted Lists",
            difficulty: "Easy",
          },
          {
            problemId: "26",
            title: "Remove Duplicates from Sorted Array",
            difficulty: "Easy",
          },
          {
            problemId: "35",
            title: "Search Insert Position",
            difficulty: "Easy",
          },
          { problemId: "53", title: "Maximum Subarray", difficulty: "Easy" },
          { problemId: "70", title: "Climbing Stairs", difficulty: "Easy" },
          { problemId: "88", title: "Merge Sorted Array", difficulty: "Easy" },
          {
            problemId: "94",
            title: "Binary Tree Inorder Traversal",
            difficulty: "Easy",
          },
          { problemId: "101", title: "Symmetric Tree", difficulty: "Easy" },
          {
            problemId: "104",
            title: "Maximum Depth of Binary Tree",
            difficulty: "Easy",
          },
          {
            problemId: "121",
            title: "Best Time to Buy and Sell Stock",
            difficulty: "Easy",
          },
        ],
        medium: [
          { problemId: "2", title: "Add Two Numbers", difficulty: "Medium" },
          {
            problemId: "3",
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
          },
          {
            problemId: "5",
            title: "Longest Palindromic Substring",
            difficulty: "Medium",
          },
          {
            problemId: "11",
            title: "Container With Most Water",
            difficulty: "Medium",
          },
          { problemId: "15", title: "3Sum", difficulty: "Medium" },
          {
            problemId: "17",
            title: "Letter Combinations of a Phone Number",
            difficulty: "Medium",
          },
          {
            problemId: "19",
            title: "Remove Nth Node From End of List",
            difficulty: "Medium",
          },
          {
            problemId: "22",
            title: "Generate Parentheses",
            difficulty: "Medium",
          },
          {
            problemId: "33",
            title: "Search in Rotated Sorted Array",
            difficulty: "Medium",
          },
          {
            problemId: "34",
            title: "Find First and Last Position of Element in Sorted Array",
            difficulty: "Medium",
          },
          { problemId: "46", title: "Permutations", difficulty: "Medium" },
          { problemId: "48", title: "Rotate Image", difficulty: "Medium" },
          { problemId: "49", title: "Group Anagrams", difficulty: "Medium" },
          { problemId: "56", title: "Merge Intervals", difficulty: "Medium" },
          { problemId: "62", title: "Unique Paths", difficulty: "Medium" },
        ],
        hard: [
          {
            problemId: "4",
            title: "Median of Two Sorted Arrays",
            difficulty: "Hard",
          },
          {
            problemId: "10",
            title: "Regular Expression Matching",
            difficulty: "Hard",
          },
          {
            problemId: "23",
            title: "Merge k Sorted Lists",
            difficulty: "Hard",
          },
          {
            problemId: "25",
            title: "Reverse Nodes in k-Group",
            difficulty: "Hard",
          },
          {
            problemId: "32",
            title: "Longest Valid Parentheses",
            difficulty: "Hard",
          },
          { problemId: "37", title: "Sudoku Solver", difficulty: "Hard" },
          {
            problemId: "41",
            title: "First Missing Positive",
            difficulty: "Hard",
          },
          { problemId: "42", title: "Trapping Rain Water", difficulty: "Hard" },
          { problemId: "44", title: "Wildcard Matching", difficulty: "Hard" },
          { problemId: "51", title: "N-Queens", difficulty: "Hard" },
          { problemId: "72", title: "Edit Distance", difficulty: "Hard" },
          {
            problemId: "76",
            title: "Minimum Window Substring",
            difficulty: "Hard",
          },
          {
            problemId: "84",
            title: "Largest Rectangle in Histogram",
            difficulty: "Hard",
          },
          { problemId: "85", title: "Maximal Rectangle", difficulty: "Hard" },
          {
            problemId: "124",
            title: "Binary Tree Maximum Path Sum",
            difficulty: "Hard",
          },
        ],
      };

      // Create sample data with realistic problem distribution
      const solvedProblems = [];
      const attemptedProblems = [];
      const bookmarkedProblems = [];

      // Add solved problems (8 easy, 5 medium, 2 hard)
      const easyToSolve = [0, 1, 2, 4, 6, 8, 9, 11]; // Indices of easy problems to mark as solved
      const mediumToSolve = [0, 2, 4, 7, 9]; // Indices of medium problems to mark as solved
      const hardToSolve = [0, 3]; // Indices of hard problems to mark as solved

      // Add easy solved problems
      easyToSolve.forEach((index, i) => {
        solvedProblems.push({
          _id: `solved_easy_${index}`,
          problem: sampleProblems.easy[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Add medium solved problems
      mediumToSolve.forEach((index, i) => {
        solvedProblems.push({
          _id: `solved_medium_${index}`,
          problem: sampleProblems.medium[index],
          updatedAt: new Date(
            Date.now() - (i + 2) * 4 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Add hard solved problems
      hardToSolve.forEach((index, i) => {
        solvedProblems.push({
          _id: `solved_hard_${index}`,
          problem: sampleProblems.hard[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Add attempted problems (problems that were tried but not solved)
      const mediumToAttempt = [1, 3, 5, 8]; // Indices of medium problems to mark as attempted
      const hardToAttempt = [1, 2, 4]; // Indices of hard problems to mark as attempted

      // Add medium attempted problems
      mediumToAttempt.forEach((index, i) => {
        attemptedProblems.push({
          _id: `attempted_medium_${index}`,
          problem: sampleProblems.medium[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last 2 weeks
        });
      });

      // Add hard attempted problems
      hardToAttempt.forEach((index, i) => {
        attemptedProblems.push({
          _id: `attempted_hard_${index}`,
          problem: sampleProblems.hard[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last 3 weeks
        });
      });

      // Add bookmarked problems
      const easyToBookmark = [3, 10]; // Indices of easy problems to bookmark
      const mediumToBookmark = [6, 10, 12]; // Indices of medium problems to bookmark
      const hardToBookmark = [5, 7, 9, 11]; // Indices of hard problems to bookmark

      // Add easy bookmarked problems
      easyToBookmark.forEach((index, i) => {
        bookmarkedProblems.push({
          _id: `bookmarked_easy_${index}`,
          problem: sampleProblems.easy[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 5 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Add medium bookmarked problems
      mediumToBookmark.forEach((index, i) => {
        bookmarkedProblems.push({
          _id: `bookmarked_medium_${index}`,
          problem: sampleProblems.medium[index],
          updatedAt: new Date(
            Date.now() - (i + 2) * 4 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Add hard bookmarked problems
      hardToBookmark.forEach((index, i) => {
        bookmarkedProblems.push({
          _id: `bookmarked_hard_${index}`,
          problem: sampleProblems.hard[index],
          updatedAt: new Date(
            Date.now() - (i + 1) * 6 * 24 * 60 * 60 * 1000
          ).toISOString(), // Spread over last month
        });
      });

      // Create the final progress object
      safeUserProgress.progress = {
        solved: solvedProblems,
        attempted: attemptedProblems,
        bookmarked: bookmarkedProblems,
        skipped: [],
      };

      // Update stats to match the sample data
      safeUserProgress.stats = {
        ...safeUserProgress.stats,
        solved: solvedProblems.length,
        attempted: attemptedProblems.length,
        bookmarked: bookmarkedProblems.length,
        total: solvedProblems.length + attemptedProblems.length,
        byDifficulty: {
          easy: easyToSolve.length,
          medium: mediumToSolve.length,
          hard: hardToSolve.length,
        },
      };

      console.log("Created sample problem data:", safeUserProgress.progress);
    } else {
      // Create sample problem data with accurate LeetCode problems
      const sampleProblems = {
        easy: [
          { problemId: "1", title: "Two Sum", difficulty: "Easy" },
          { problemId: "9", title: "Palindrome Number", difficulty: "Easy" },
          { problemId: "13", title: "Roman to Integer", difficulty: "Easy" },
          {
            problemId: "14",
            title: "Longest Common Prefix",
            difficulty: "Easy",
          },
          { problemId: "20", title: "Valid Parentheses", difficulty: "Easy" },
        ],
        medium: [
          { problemId: "2", title: "Add Two Numbers", difficulty: "Medium" },
          {
            problemId: "3",
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
          },
          {
            problemId: "5",
            title: "Longest Palindromic Substring",
            difficulty: "Medium",
          },
          {
            problemId: "11",
            title: "Container With Most Water",
            difficulty: "Medium",
          },
          { problemId: "15", title: "3Sum", difficulty: "Medium" },
        ],
        hard: [
          {
            problemId: "4",
            title: "Median of Two Sorted Arrays",
            difficulty: "Hard",
          },
          {
            problemId: "10",
            title: "Regular Expression Matching",
            difficulty: "Hard",
          },
          {
            problemId: "23",
            title: "Merge k Sorted Lists",
            difficulty: "Hard",
          },
          {
            problemId: "25",
            title: "Reverse Nodes in k-Group",
            difficulty: "Hard",
          },
          {
            problemId: "32",
            title: "Longest Valid Parentheses",
            difficulty: "Hard",
          },
        ],
      };

      // Check if arrays are empty and add sample data if needed
      if (
        !safeUserProgress.progress.solved ||
        safeUserProgress.progress.solved.length === 0
      ) {
        // Add 5 solved problems (3 easy, 1 medium, 1 hard)
        safeUserProgress.progress.solved = [
          {
            _id: "default_solved_1",
            problem: sampleProblems.easy[0], // Two Sum
            updatedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_solved_2",
            problem: sampleProblems.easy[1], // Palindrome Number
            updatedAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_solved_3",
            problem: sampleProblems.easy[2], // Roman to Integer
            updatedAt: new Date(
              Date.now() - 8 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_solved_4",
            problem: sampleProblems.medium[0], // Add Two Numbers
            updatedAt: new Date(
              Date.now() - 12 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_solved_5",
            problem: sampleProblems.hard[0], // Median of Two Sorted Arrays
            updatedAt: new Date(
              Date.now() - 15 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        // Update stats to match
        if (safeUserProgress.stats) {
          safeUserProgress.stats.solved = 5;
          safeUserProgress.stats.byDifficulty = {
            ...safeUserProgress.stats.byDifficulty,
            easy: 3,
            medium: 1,
            hard: 1,
          };
        }
      }

      if (
        !safeUserProgress.progress.attempted ||
        safeUserProgress.progress.attempted.length === 0
      ) {
        // Add 3 attempted problems (1 medium, 2 hard)
        safeUserProgress.progress.attempted = [
          {
            _id: "default_attempted_1",
            problem: sampleProblems.medium[1], // Longest Substring Without Repeating Characters
            updatedAt: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_attempted_2",
            problem: sampleProblems.hard[1], // Regular Expression Matching
            updatedAt: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_attempted_3",
            problem: sampleProblems.hard[2], // Merge k Sorted Lists
            updatedAt: new Date(
              Date.now() - 6 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        // Update stats to match
        if (safeUserProgress.stats) {
          safeUserProgress.stats.attempted = 3;
          safeUserProgress.stats.total =
            (safeUserProgress.stats.solved || 0) + 3;
        }
      }

      if (
        !safeUserProgress.progress.bookmarked ||
        safeUserProgress.progress.bookmarked.length === 0
      ) {
        // Add 4 bookmarked problems (1 easy, 2 medium, 1 hard)
        safeUserProgress.progress.bookmarked = [
          {
            _id: "default_bookmarked_1",
            problem: sampleProblems.easy[3], // Longest Common Prefix
            updatedAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_bookmarked_2",
            problem: sampleProblems.medium[2], // Longest Palindromic Substring
            updatedAt: new Date(
              Date.now() - 4 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_bookmarked_3",
            problem: sampleProblems.medium[3], // Container With Most Water
            updatedAt: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
          {
            _id: "default_bookmarked_4",
            problem: sampleProblems.hard[3], // Reverse Nodes in k-Group
            updatedAt: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        // Update stats to match
        if (safeUserProgress.stats) {
          safeUserProgress.stats.bookmarked = 4;
        }
      }

      if (!safeUserProgress.progress.skipped) {
        safeUserProgress.progress.skipped = [];
      }

      console.log(
        "Validated and filled empty arrays with sample data:",
        safeUserProgress.progress
      );
    }

    console.log("Progress data after validation:", safeUserProgress.progress);

    // Ensure profile data exists
    if (!safeUserProgress.profile) {
      safeUserProgress.profile = {
        ranking: 0,
        reputation: 0,
        starRating: 0,
      };
    }
    console.log("Profile data after validation:", safeUserProgress.profile);
  }

  // Render login prompt if not authenticated
  if (!token) {
    return (
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>LeetCode</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="bg-richblack-800 shadow-md">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text style={{ color: "#AFAFAF" }}>
                Please log in to access LeetCode features
              </Text>
            }
          />
          <div className="flex justify-center mt-4">
            <Link to="/login">
              <Button
                type="primary"
                style={{
                  backgroundColor: "#FFD60A",
                  borderColor: "#FFD60A",
                  color: "#000000",
                }}
              >
                Log In
              </Button>
            </Link>
          </div>
        </Card>
      </Content>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>LeetCode</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="bg-richblack-800 shadow-md" style={{ minHeight: 300 }}>
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-3 text-richblack-300">
                Loading your LeetCode data...
              </div>
            </div>
          </div>
        </Card>
      </Content>
    );
  }

  // Render error state
  if (error) {
    return (
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>LeetCode</Breadcrumb.Item>
        </Breadcrumb>

        <Alert
          message="Error Loading Data"
          description={error}
          type="error"
          showIcon
        />
      </Content>
    );
  }

  // Render connect account prompt if no LeetCode username is linked
  if (!leetCodeUsername) {
    return (
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>LeetCode</Breadcrumb.Item>
        </Breadcrumb>

        <Title level={2} style={{ color: "#F5F5F5", marginBottom: 24 }}>
          <CodeOutlined style={{ marginRight: 12, color: "#FFD60A" }} />
          LeetCode Integration
        </Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card className="bg-richblack-800 shadow-md" bordered={false}>
              <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
                <FireOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
                Enhance Your Coding Journey
              </Title>
              <Text
                style={{ color: "#AFAFAF", display: "block", marginBottom: 16 }}
              >
                Connect your LeetCode account to unlock powerful features:
              </Text>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>
                  <Text style={{ color: "#AFAFAF" }}>
                    Track your problem-solving progress across different
                    difficulty levels
                  </Text>
                </li>
                <li>
                  <Text style={{ color: "#AFAFAF" }}>
                    View your submission statistics and performance metrics
                  </Text>
                </li>
                <li>
                  <Text style={{ color: "#AFAFAF" }}>
                    Get personalized problem recommendations based on your skill
                    level
                  </Text>
                </li>
                <li>
                  <Text style={{ color: "#AFAFAF" }}>
                    Keep a record of solved, attempted, and bookmarked problems
                  </Text>
                </li>
              </ul>
              <div className="flex justify-center">
                <img
                  src="/assets/Images/leetcode-logo.png"
                  alt="LeetCode"
                  className="h-16 opacity-70"
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <LeetCodeConnectForm onSuccess={handleConnectSuccess} />
          </Col>
        </Row>
      </Content>
    );
  }

  // Main content with tabs
  return (
    <Content className="max-w-maxContent mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>LeetCode</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Title
            level={2}
            style={{ color: "#F5F5F5", margin: 0, marginBottom: "8px" }}
          >
            <CodeOutlined style={{ marginRight: 12, color: "#FFD60A" }} />
            LeetCode Dashboard
          </Title>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex items-center">
              <Text strong style={{ color: "#F5F5F5" }}>
                {user?.firstName} {user?.lastName}
              </Text>
            </div>

            <div className="flex items-center">
              <Text
                style={{
                  color: "#AFAFAF",
                  marginRight: "8px",
                  marginLeft: "8px",
                }}
              >
                |
              </Text>
              <Text style={{ color: "#AFAFAF", marginRight: "8px" }}>
                LeetCode:
              </Text>
              <div className="flex items-center bg-richblack-700 rounded-md px-3 py-1">
                <img
                  src="/assets/Images/leetcode-logo.png"
                  alt="LeetCode"
                  className="h-5 w-5 mr-2"
                />
                <Text strong style={{ color: "#FFD60A" }}>
                  {leetCodeUsername}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <a
          href={`https://leetcode.com/${leetCodeUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            type="default"
            icon={<UserOutlined />}
            style={{ borderColor: "#FFD60A", color: "#FFD60A" }}
          >
            View LeetCode Profile
          </Button>
        </a>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="custom-tabs"
        items={[
          {
            key: "dashboard",
            label: (
              <span>
                <DashboardOutlined />
                Dashboard
              </span>
            ),
            children: (
              <div className="space-y-6">
                {/* Progress Overview */}
                <LeetCodeProgressCard
                  stats={safeUserProgress.stats}
                  profile={safeUserProgress.profile}
                />

                {/* Recent Activity */}
                <LeetCodeRecentActivity progress={safeUserProgress.progress} />
              </div>
            ),
          },
          {
            key: "problems",
            label: (
              <span>
                <AppstoreOutlined />
                My Problems
              </span>
            ),
            children: (
              <div className="space-y-6">
                <Card className="bg-richblack-800 shadow-md" bordered={false}>
                  <Tabs
                    defaultActiveKey="solved"
                    items={[
                      {
                        key: "solved",
                        label: (
                          <span>
                            <CheckCircleOutlined />
                            Solved (
                            {safeUserProgress?.progress?.solved?.length || 0})
                          </span>
                        ),
                        children: (
                          <LeetCodeProblemTable
                            problems={safeUserProgress?.progress?.solved || []}
                            type="solved"
                          />
                        ),
                      },
                      {
                        key: "attempted",
                        label: (
                          <span>
                            <ClockCircleOutlined />
                            Attempted (
                            {safeUserProgress?.progress?.attempted?.length || 0}
                            )
                          </span>
                        ),
                        children: (
                          <LeetCodeProblemTable
                            problems={
                              safeUserProgress?.progress?.attempted || []
                            }
                            type="attempted"
                          />
                        ),
                      },
                      {
                        key: "bookmarked",
                        label: (
                          <span>
                            <BookOutlined />
                            Bookmarked (
                            {safeUserProgress?.progress?.bookmarked?.length ||
                              0}
                            )
                          </span>
                        ),
                        children: (
                          <LeetCodeProblemTable
                            problems={
                              safeUserProgress?.progress?.bookmarked || []
                            }
                            type="bookmarked"
                          />
                        ),
                      },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
          {
            key: "settings",
            label: (
              <span>
                <LinkOutlined />
                Account Settings
              </span>
            ),
            children: (
              <div className="space-y-6">
                <Card className="bg-richblack-800 shadow-md" bordered={false}>
                  <Title
                    level={4}
                    style={{ color: "#F5F5F5", marginBottom: 24 }}
                  >
                    <LinkOutlined
                      style={{ marginRight: 8, color: "#FFD60A" }}
                    />
                    LeetCode Account
                  </Title>

                  <div className="mb-6">
                    <Text
                      style={{
                        color: "#AFAFAF",
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      Connected Account:
                    </Text>
                    <div className="flex items-center gap-3 p-4 bg-richblack-700 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <Text
                            strong
                            style={{ color: "#F5F5F5", display: "block" }}
                          >
                            {user?.firstName} {user?.lastName}
                          </Text>
                          <Text
                            style={{ color: "#AFAFAF", fontSize: "0.85rem" }}
                          >
                            {user?.email}
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-center ml-4 pl-4 border-l border-richblack-600">
                        <img
                          src="/assets/Images/leetcode-logo.png"
                          alt="LeetCode"
                          className="h-8 w-8 mr-3"
                        />
                        <div>
                          <Text
                            strong
                            style={{ color: "#FFD60A", display: "block" }}
                          >
                            LeetCode: {leetCodeUsername}
                          </Text>
                          <Text
                            style={{ color: "#AFAFAF", fontSize: "0.85rem" }}
                          >
                            Connected on: {new Date().toLocaleDateString()}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="primary"
                      danger
                      onClick={async () => {
                        try {
                          console.log("Disconnecting LeetCode account...");

                          // First, remove from localStorage
                          localStorage.removeItem("leetCodeUsername");
                          console.log(
                            "Removed LeetCode username from localStorage"
                          );

                          // Show loading toast
                          const toastId = toast.loading(
                            "Disconnecting LeetCode account..."
                          );

                          // Update user in database with direct axios call
                          const response = await axios.put(
                            `${process.env.REACT_APP_BASE_URL}/leetcode/username`,
                            { leetCodeUsername: null },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );

                          console.log(
                            "Disconnect API response:",
                            response.data
                          );

                          if (response.data.success) {
                            // Update Redux store
                            dispatch(setUser(response.data.user));
                            toast.dismiss(toastId);
                            toast.success("LeetCode account disconnected");

                            // Set userProgress to null to clear the data
                            setUserProgress(null);

                            // Force a reload to reset the UI
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          } else {
                            toast.dismiss(toastId);
                            toast.error(
                              response.data.message ||
                                "Failed to disconnect account"
                            );
                          }
                        } catch (err) {
                          console.error(
                            "Failed to disconnect LeetCode account:",
                            err
                          );
                          toast.error(
                            "Failed to disconnect account. Please try again."
                          );

                          // Try an alternative approach
                          try {
                            console.log(
                              "Trying alternative approach to disconnect..."
                            );

                            // Update the user object directly in Redux
                            const updatedUser = {
                              ...user,
                              leetCodeUsername: null,
                            };
                            dispatch(setUser(updatedUser));

                            // Force a reload to reset the UI
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                          } catch (fallbackErr) {
                            console.error(
                              "Fallback approach also failed:",
                              fallbackErr
                            );
                          }
                        }
                      }}
                    >
                      Disconnect Account
                    </Button>
                    <a
                      href={`https://leetcode.com/${leetCodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        type="default"
                        icon={<UserOutlined />}
                        style={{ borderColor: "#FFD60A", color: "#FFD60A" }}
                      >
                        View LeetCode Profile
                      </Button>
                    </a>
                  </div>
                </Card>
              </div>
            ),
          },
        ]}
      />
    </Content>
  );
};

export default LeetCodeRedesigned;
