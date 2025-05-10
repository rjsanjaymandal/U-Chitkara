import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";
import { updateLeetCodeUsername } from "../../../services/operations/leetCodeAPI";
import { getAuthToken } from "../../../utils/tokenUtils";
import { setUser } from "../../../slices/profileSlice";
import { handleTokenExpiration } from "../../../utils/tokenRefresh";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaCode } from "react-icons/fa";
import { Input, Button, Form, Typography, Space, Divider } from "antd";
import { GithubOutlined, CodeOutlined, LinkOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const LeetCodeUsernameForm = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.leetCodeUsername || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      console.warn(
        "User is not authenticated. LeetCode username cannot be updated."
      );
    }
  }, []);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting LeetCode username:", values.username);

      // Check if token is valid or refresh it
      const isTokenValid = await handleTokenExpiration(dispatch);

      if (!isTokenValid) {
        console.error("Token is invalid and could not be refreshed");
        toast.error("Your session has expired. Please log in again.");
        // Redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      // Get token from Redux or localStorage
      const authToken = token || getAuthToken();

      if (!authToken) {
        console.error("No authentication token available");
        toast.error("Authentication required. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      // Try direct API call first for better reliability
      try {
        console.log("Trying direct API call to update username");
        const directResponse = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/leetcode/username`,
          { leetCodeUsername: values.username },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("Direct API response:", directResponse.data);

        if (directResponse.data.success) {
          // Update the user in Redux store
          dispatch(setUser(directResponse.data.user));

          // Store the username in localStorage for persistence
          localStorage.setItem("leetCodeUsername", values.username);

          toast.success("LeetCode username linked successfully!");

          // No need to reload the page, Redux will update the UI
          return;
        }
      } catch (directError) {
        console.error(
          "Direct API call failed, falling back to service function:",
          directError
        );

        // Check if token expired error
        if (
          directError.response &&
          (directError.response.status === 401 ||
            directError.response.data?.message?.includes("expired") ||
            directError.response.data?.message?.includes("invalid token"))
        ) {
          console.log("Token expired during API call, attempting to refresh");

          // Try to refresh token
          const refreshSuccessful = await handleTokenExpiration(dispatch);

          if (!refreshSuccessful) {
            toast.error("Your session has expired. Please log in again.");
            setTimeout(() => {
              navigate("/login");
            }, 2000);
            return;
          }

          // Get new token after refresh
          const newAuthToken = localStorage.getItem("token");

          // Retry the API call with new token
          try {
            const retryResponse = await axios.put(
              `${process.env.REACT_APP_BASE_URL}/leetcode/username`,
              { leetCodeUsername: values.username },
              {
                headers: {
                  Authorization: `Bearer ${newAuthToken}`,
                },
              }
            );

            if (retryResponse.data.success) {
              dispatch(setUser(retryResponse.data.user));
              localStorage.setItem("leetCodeUsername", values.username);
              toast.success("LeetCode username linked successfully!");
              return;
            }
          } catch (retryError) {
            console.error(
              "Retry API call failed after token refresh:",
              retryError
            );
          }
        }
      }

      // Fall back to the service function
      const result = await updateLeetCodeUsername(
        values.username,
        authToken,
        dispatch
      );
      console.log("Result from updateLeetCodeUsername:", result);

      if (result && result.success) {
        // Store the username in localStorage for persistence
        localStorage.setItem("leetCodeUsername", values.username);

        toast.success("LeetCode username linked successfully!");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);

      // Check if token expired error
      if (
        error.response &&
        (error.response.status === 401 ||
          error.response.data?.message?.includes("expired") ||
          error.response.data?.message?.includes("invalid token"))
      ) {
        toast.error("Your session has expired. Please log in again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error("Failed to update LeetCode username. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-richblack-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <CodeOutlined
          style={{ fontSize: 24, color: "#FFD60A" }}
          className="text-yellow-50"
        />
        <Title level={4} style={{ margin: 0, color: "#F5F5F5" }}>
          Connect LeetCode Account
        </Title>
      </div>

      <Paragraph style={{ color: "#AFAFAF", marginBottom: 16 }}>
        Link your LeetCode account to track your progress and practice coding
        problems directly from our platform. Enter your LeetCode username (the
        name that appears in your LeetCode profile URL).
      </Paragraph>

      <Form
        name="leetcode-username-form"
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{ username }}
      >
        <Form.Item
          name="username"
          label={<span style={{ color: "#F5F5F5" }}>LeetCode Username</span>}
          rules={[
            {
              required: true,
              message: "Please enter your LeetCode username",
            },
            {
              pattern: /^[a-zA-Z0-9_-]+$/,
              message:
                "Username can only contain letters, numbers, underscores, and hyphens",
            },
          ]}
          help="Enter the username from your LeetCode profile (e.g., 'user123')"
        >
          <Input
            prefix={<CodeOutlined style={{ color: "#AFAFAF" }} />}
            placeholder="Enter your LeetCode username"
            style={{
              backgroundColor: "#2C333F",
              color: "#F5F5F5",
              border: "1px solid #424854",
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            style={{
              backgroundColor: "#FFD60A",
              borderColor: "#FFD60A",
              color: "#000000",
              width: "100%",
            }}
          >
            {user?.leetCodeUsername ? "Update Username" : "Connect Account"}
          </Button>
        </Form.Item>
      </Form>

      <Divider style={{ borderColor: "#424854" }} />

      <div className="flex justify-between items-center">
        <Text style={{ color: "#AFAFAF" }}>Don't have a LeetCode account?</Text>
        <Button
          type="link"
          icon={<LinkOutlined />}
          href="https://leetcode.com/accounts/signup/"
          target="_blank"
          style={{ color: "#FFD60A" }}
        >
          Sign up on LeetCode
        </Button>
      </div>
    </div>
  );
};

export default LeetCodeUsernameForm;
