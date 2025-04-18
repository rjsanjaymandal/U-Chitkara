import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getLearningPathDetails, enrollInLearningPath, updateLearningPathProgress } from '../services/operations/learningPathAPI';
import ProgressBar from "@ramonak/react-progress-bar";
import { FaClock, FaGraduationCap, FaCheckCircle, FaCircle, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const LearningPathDetails = () => {
  const { pathId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [learningPath, setLearningPath] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLearningPathDetails = async () => {
      setLoading(true);
      
      const pathDetails = await getLearningPathDetails(pathId, dispatch);
      setLearningPath(pathDetails);
      
      // Check if user is enrolled and get progress
      if (token && pathDetails) {
        // This would typically come from the API, but for now we'll simulate it
        // In a real implementation, the API would return the user's progress for this path
        const userPathData = pathDetails.userProgress;
        if (userPathData) {
          setIsEnrolled(true);
          setUserProgress(userPathData.progress || 0);
        }
      }
      
      setLoading(false);
    };
    
    fetchLearningPathDetails();
  }, [pathId, token, dispatch]);
  
  const handleEnroll = async () => {
    if (!token) {
      toast.error("Please log in to enroll in a learning path");
      return;
    }
    
    const success = await enrollInLearningPath(pathId, token, dispatch);
    if (success) {
      setIsEnrolled(true);
      setUserProgress(0);
    }
  };
  
  const handleUpdateProgress = async (newProgress) => {
    if (!token || !isEnrolled) return;
    
    const success = await updateLearningPathProgress(pathId, newProgress, token, dispatch);
    if (success) {
      setUserProgress(newProgress);
      toast.success("Progress updated successfully");
    }
  };
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="w-11/12 max-w-maxContent mx-auto py-10">
        <div className="animate-pulse">
          <div className="h-10 w-1/3 bg-richblack-700 rounded-md mb-8"></div>
          <div className="h-6 w-1/4 bg-richblack-700 rounded-md mb-4"></div>
          <div className="h-4 w-full bg-richblack-800 rounded-md mb-8"></div>
          <div className="flex gap-8">
            <div className="w-2/3">
              <div className="h-8 w-1/3 bg-richblack-700 rounded-md mb-4"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-richblack-800 rounded-lg h-[100px]"></div>
                ))}
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-richblack-800 rounded-lg h-[300px]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!learningPath) {
    return (
      <div className="w-11/12 max-w-maxContent mx-auto py-10">
        <p className="text-richblack-300 text-center">Learning path not found.</p>
      </div>
    );
  }
  
  return (
    <div className="w-11/12 max-w-maxContent mx-auto py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-richblack-300 mb-2">
          <Link to="/learning-paths" className="hover:text-yellow-50">Learning Paths</Link>
          <span>/</span>
          <span>{learningPath.category?.name || "Uncategorized"}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-richblack-5 mb-3">{learningPath.name}</h1>
        
        <p className="text-richblack-300 mb-6">{learningPath.description}</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 bg-richblack-800 px-3 py-1 rounded-full">
            <FaGraduationCap className="text-yellow-50" />
            <span className="text-richblack-50">{learningPath.courses?.length || 0} Courses</span>
          </div>
          
          <div className="flex items-center gap-2 bg-richblack-800 px-3 py-1 rounded-full">
            <FaClock className="text-yellow-50" />
            <span className="text-richblack-50">{learningPath.estimatedCompletionTime || 0} hours</span>
          </div>
          
          <div className="flex items-center gap-2 bg-richblack-800 px-3 py-1 rounded-full">
            <span className="text-richblack-50">{learningPath.level}</span>
          </div>
        </div>
        
        {/* Progress bar for enrolled users */}
        {isEnrolled && (
          <div className="bg-richblack-800 p-4 rounded-lg mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-richblack-300">Your progress</span>
              <span className="text-yellow-50">{userProgress}%</span>
            </div>
            <ProgressBar 
              completed={userProgress} 
              bgColor="#FFD60A"
              height="10px"
              isLabelVisible={false}
              baseBgColor="#2C333F"
              borderRadius="5px"
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Course list */}
        <div className="lg:w-2/3">
          <h2 className="text-xl font-semibold text-richblack-5 mb-6">Path Curriculum</h2>
          
          <div className="space-y-4">
            {learningPath.courses?.map((courseItem, index) => {
              const course = courseItem.course;
              return (
                <div 
                  key={course._id} 
                  className="bg-richblack-800 rounded-lg p-4 border border-richblack-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {isEnrolled && userProgress >= (index / learningPath.courses.length) * 100 ? (
                        <FaCheckCircle className="text-caribbeangreen-300" />
                      ) : (
                        <FaCircle className="text-richblack-500" />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-richblack-5">
                          {index + 1}. {course.courseName}
                        </h3>
                        <span className="text-xs bg-richblack-700 text-yellow-50 px-2 py-1 rounded-full">
                          {courseItem.order} of {learningPath.courses.length}
                        </span>
                      </div>
                      
                      <p className="text-sm text-richblack-300 mt-1 line-clamp-2">
                        {course.courseDescription || "No description available"}
                      </p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-xs text-richblack-300">
                          <img 
                            src={course.instructor?.image || "https://api.dicebear.com/5.x/initials/svg?seed=Instructor"} 
                            alt={course.instructor?.firstName || "Instructor"} 
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{course.instructor?.firstName} {course.instructor?.lastName}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/courses/${course._id}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm text-yellow-50 hover:text-yellow-25"
                      >
                        View Course <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Progress update buttons for enrolled users */}
          {isEnrolled && (
            <div className="mt-8 bg-richblack-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-richblack-5 mb-4">Update Your Progress</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 25, 50, 75, 100].map(progress => (
                  <button
                    key={progress}
                    onClick={() => handleUpdateProgress(progress)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      userProgress === progress 
                        ? 'bg-yellow-50 text-richblack-900' 
                        : 'bg-richblack-700 text-richblack-50 hover:bg-richblack-600'
                    }`}
                  >
                    {progress}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-richblack-800 rounded-lg p-6 border border-richblack-700 sticky top-10">
            <h3 className="text-xl font-semibold text-richblack-5 mb-4">Path Overview</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-richblack-300">Courses</span>
                <span className="text-richblack-50">{learningPath.courses?.length || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-richblack-300">Estimated Time</span>
                <span className="text-richblack-50">{learningPath.estimatedCompletionTime || 0} hours</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-richblack-300">Level</span>
                <span className="text-richblack-50">{learningPath.level}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-richblack-300">Category</span>
                <span className="text-richblack-50">{learningPath.category?.name || "Uncategorized"}</span>
              </div>
            </div>
            
            {!isEnrolled ? (
              <button
                onClick={handleEnroll}
                className="w-full bg-yellow-50 text-richblack-900 py-3 rounded-md font-medium hover:bg-yellow-25 transition-all duration-200"
              >
                Enroll in Learning Path
              </button>
            ) : (
              <Link
                to={`/courses/${learningPath.courses?.[0]?.course?._id}`}
                className="block w-full text-center bg-yellow-50 text-richblack-900 py-3 rounded-md font-medium hover:bg-yellow-25 transition-all duration-200"
              >
                Continue Learning
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetails;
