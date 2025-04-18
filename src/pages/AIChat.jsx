import React from "react";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const AIChat = () => {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 text-richblack-5 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-richblack-800 rounded-lg p-8 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <FaRobot className="text-6xl text-yellow-50 mr-4" />
          <h1 className="text-3xl font-bold">AI Study Assistant</h1>
        </div>

        <div className="bg-richblack-700 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
          <p className="text-richblack-100 mb-4">
            We're working on an exciting new feature that will help you with
            your studies. The AI Study Assistant will be able to:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-richblack-100">
            <li>Answer questions about your course materials</li>
            <li>Explain complex concepts in simple terms</li>
            <li>Help you solve programming problems</li>
            <li>Provide study tips and learning strategies</li>
            <li>Guide you through difficult assignments</li>
          </ul>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/learning-paths"
            className="bg-richblack-700 hover:bg-richblack-600 transition-colors p-4 rounded-lg flex-1 text-center"
          >
            Explore Learning Paths
          </Link>

          <Link
            to="/code-playground"
            className="bg-yellow-50 text-richblack-900 hover:bg-yellow-100 transition-colors p-4 rounded-lg flex-1 text-center font-medium"
          >
            Try Code Playground
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
