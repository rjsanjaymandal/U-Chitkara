import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaClock, FaGraduationCap } from 'react-icons/fa';
import ProgressBar from "@ramonak/react-progress-bar";

const LearningPathCard = ({ learningPath, userProgress = 0, enrolled = false }) => {
  // Calculate the number of courses in the learning path
  const courseCount = learningPath?.courses?.length || 0;
  
  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden transition-all duration-200 hover:scale-[1.03] border border-richblack-700">
      {/* Top section with category and level */}
      <div className="flex justify-between items-center bg-richblack-900 px-4 py-3">
        <div className="text-xs text-richblack-300 font-medium">
          {learningPath?.category?.name || "Uncategorized"}
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-richblack-700 text-yellow-50">
          {learningPath?.level || "Beginner"}
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-semibold text-richblack-5">
          {learningPath?.name || "Learning Path"}
        </h3>
        
        <p className="text-richblack-300 text-sm line-clamp-2">
          {learningPath?.description || "No description available"}
        </p>
        
        {/* Stats */}
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-richblack-300">
            <FaGraduationCap />
            <span className="text-sm">{courseCount} Courses</span>
          </div>
          <div className="flex items-center gap-2 text-richblack-300">
            <FaClock />
            <span className="text-sm">{learningPath?.estimatedCompletionTime || 0} hours</span>
          </div>
        </div>
        
        {/* Progress bar for enrolled paths */}
        {enrolled && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-richblack-300">Your progress</span>
              <span className="text-yellow-50">{userProgress}%</span>
            </div>
            <ProgressBar 
              completed={userProgress} 
              bgColor="#FFD60A"
              height="8px"
              isLabelVisible={false}
              baseBgColor="#2C333F"
              borderRadius="4px"
            />
          </div>
        )}
        
        {/* Action button */}
        <Link 
          to={`/learning-path/${learningPath?._id}`}
          className="mt-4 flex items-center justify-center gap-2 bg-yellow-50 text-richblack-900 py-2 px-4 rounded-md font-medium hover:bg-yellow-25 transition-all duration-200"
        >
          {enrolled ? "Continue Learning" : "View Path"}
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default LearningPathCard;
