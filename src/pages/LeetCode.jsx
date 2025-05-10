import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tabs, Typography, Layout, Breadcrumb, Button } from "antd";
import {
  CodeOutlined,
  UserOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { setUser } from "../slices/profileSlice";
import useTokenRefresh from "../hooks/useTokenRefresh";

// Import components
import LeetCodeUsernameForm from "../Components/core/LeetCode/LeetCodeUsernameForm";
import LeetCodeStats from "../Components/core/LeetCode/LeetCodeStats";
import ProblemList from "../Components/core/LeetCode/ProblemList";
import LeetCodeDashboard from "../Components/core/LeetCode/LeetCodeDashboard";

const { Title, Text } = Typography;
const { Content } = Layout;
const { TabPane } = Tabs;

const LeetCode = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use our custom hook to handle token refresh
  const { refreshToken } = useTokenRefresh();

  // Check token validity and fetch LeetCode data when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        const isValid = await refreshToken();
        if (!isValid) {
          // Token is invalid and couldn't be refreshed
          console.log("Token is invalid and couldn't be refreshed");
        }
      }
    };

    checkAuth();

    // Check if LeetCode username is stored in localStorage
    const storedUsername = localStorage.getItem("leetCodeUsername");
    if (storedUsername && user && !user.leetCodeUsername) {
      // If username is in localStorage but not in user object, update the user object
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

  return (
    <Layout className="min-h-screen bg-richblack-900">
      <Content className="max-w-maxContent mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb
            className="mb-4"
            items={[
              {
                title: (
                  <Link to="/" className="text-richblack-300">
                    Home
                  </Link>
                ),
              },
              {
                title: (
                  <span className="text-yellow-50">LeetCode Practice</span>
                ),
              },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Title level={2} style={{ color: "#F5F5F5", margin: 0 }}>
                <CodeOutlined style={{ marginRight: 12, color: "#FFD60A" }} />
                LeetCode Practice
              </Title>
              <Text style={{ color: "#AFAFAF" }}>
                Enhance your coding skills with LeetCode problems
              </Text>
            </div>

            {!token && (
              <Link to="/login">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: "#FFD60A",
                    borderColor: "#FFD60A",
                    color: "#000000",
                  }}
                >
                  Log In to Track Progress
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          type="card"
          size="large"
          className="custom-tabs"
          tabBarStyle={{ marginBottom: 24, borderBottom: "1px solid #424854" }}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <LeetCodeDashboard />
                  </div>
                  <div className="lg:col-span-1 space-y-6">
                    {/* Only show the username form if no LeetCode username is linked */}
                    {!user?.leetCodeUsername &&
                      !localStorage.getItem("leetCodeUsername") && (
                        <LeetCodeUsernameForm />
                      )}
                    <LeetCodeStats />
                  </div>
                </div>
              ),
            },
            {
              key: "problems",
              label: (
                <span>
                  <AppstoreOutlined />
                  Problems
                </span>
              ),
              children: <ProblemList />,
            },
            {
              key: "profile",
              label: (
                <span>
                  <UserOutlined />
                  Profile
                </span>
              ),
              children: (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Only show the username form if no LeetCode username is linked */}
                  {!user?.leetCodeUsername &&
                  !localStorage.getItem("leetCodeUsername") ? (
                    <>
                      <div className="lg:col-span-1">
                        <LeetCodeUsernameForm />
                      </div>
                      <div className="lg:col-span-2">
                        <LeetCodeStats />
                      </div>
                    </>
                  ) : (
                    <div className="lg:col-span-3">
                      <LeetCodeStats />
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />

        {/* Resources Section */}
        <div className="mt-12 bg-richblack-800 p-6 rounded-lg shadow-md">
          <Title level={4} style={{ color: "#F5F5F5", marginBottom: 16 }}>
            <LinkOutlined style={{ marginRight: 8, color: "#FFD60A" }} />
            LeetCode Resources
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-richblack-700 p-4 rounded-md">
              <Title level={5} style={{ color: "#F5F5F5" }}>
                Patterns
              </Title>
              <Text style={{ color: "#AFAFAF" }}>
                Learn common problem-solving patterns like Two Pointers, Sliding
                Window, and more.
              </Text>
              <div className="mt-4">
                <Button
                  type="link"
                  href="https://leetcode.com/discuss/study-guide/448285/List-of-questions-sorted-by-common-patterns"
                  target="_blank"
                  style={{ color: "#FFD60A", paddingLeft: 0 }}
                >
                  View Patterns
                </Button>
              </div>
            </div>
            <div className="bg-richblack-700 p-4 rounded-md">
              <Title level={5} style={{ color: "#F5F5F5" }}>
                Top Interview Questions
              </Title>
              <Text style={{ color: "#AFAFAF" }}>
                Practice the most frequently asked questions in technical
                interviews.
              </Text>
              <div className="mt-4">
                <Button
                  type="link"
                  href="https://leetcode.com/explore/interview/card/top-interview-questions-medium/"
                  target="_blank"
                  style={{ color: "#FFD60A", paddingLeft: 0 }}
                >
                  View Questions
                </Button>
              </div>
            </div>
            <div className="bg-richblack-700 p-4 rounded-md">
              <Title level={5} style={{ color: "#F5F5F5" }}>
                Coding Contests
              </Title>
              <Text style={{ color: "#AFAFAF" }}>
                Participate in weekly contests to improve your problem-solving
                speed.
              </Text>
              <div className="mt-4">
                <Button
                  type="link"
                  href="https://leetcode.com/contest/"
                  target="_blank"
                  style={{ color: "#FFD60A", paddingLeft: 0 }}
                >
                  View Contests
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default LeetCode;
