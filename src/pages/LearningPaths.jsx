import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllLearningPaths, getUserLearningPaths } from '../services/operations/learningPathAPI';
import LearningPathCard from '../Components/core/LearningPath/LearningPathCard';
import RecommendedPaths from '../Components/core/LearningPath/RecommendedPaths';
import RecommendedCourses from '../Components/core/LearningPath/RecommendedCourses';
import { FaFilter, FaSearch } from 'react-icons/fa';

const LearningPaths = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [allLearningPaths, setAllLearningPaths] = useState([]);
  const [userLearningPaths, setUserLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories from learning paths
  const categories = ['All', ...new Set(allLearningPaths.map(path => path.category?.name).filter(Boolean))];
  
  // Levels for filtering
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch all learning paths
      const paths = await getAllLearningPaths(dispatch);
      setAllLearningPaths(paths);
      
      // If user is logged in, fetch their enrolled learning paths
      if (token) {
        const userPaths = await getUserLearningPaths(token, dispatch);
        setUserLearningPaths(userPaths);
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [dispatch, token]);
  
  // Filter learning paths based on search query, level, and category
  const filteredLearningPaths = allLearningPaths.filter(path => {
    const matchesSearch = path.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         path.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = selectedLevel === 'All' || path.level === selectedLevel;
    
    const matchesCategory = selectedCategory === 'All' || 
                           path.category?.name === selectedCategory;
    
    return matchesSearch && matchesLevel && matchesCategory;
  });
  
  // Create a map of enrolled learning paths with their progress
  const enrolledPathsMap = {};
  userLearningPaths.forEach(path => {
    enrolledPathsMap[path._id] = path.userProgress || 0;
  });
  
  // Render loading skeleton
  if (loading) {
    return (
      <div className="w-11/12 max-w-maxContent mx-auto py-10">
        <div className="animate-pulse">
          <div className="h-10 w-1/3 bg-richblack-700 rounded-md mb-8"></div>
          <div className="h-8 w-full bg-richblack-800 rounded-md mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-richblack-800 rounded-lg h-[300px]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-11/12 max-w-maxContent mx-auto py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-richblack-5 mb-3">Learning Paths</h1>
        <p className="text-richblack-300">
          Follow structured learning paths to master new skills efficiently
        </p>
      </div>
      
      {/* Recommendations for logged in users */}
      {token && (
        <div className="mb-16 space-y-12">
          <RecommendedPaths />
          <RecommendedCourses />
        </div>
      )}
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search learning paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-richblack-700 text-richblack-5 rounded-md px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="appearance-none bg-richblack-700 text-richblack-5 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level} Level</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
          </div>
          
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-richblack-700 text-richblack-5 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-yellow-50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
          </div>
        </div>
      </div>
      
      {/* All learning paths grid */}
      {filteredLearningPaths.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-richblack-300 text-lg">No learning paths found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLearningPaths.map(path => (
            <LearningPathCard 
              key={path._id} 
              learningPath={path} 
              userProgress={enrolledPathsMap[path._id] || 0}
              enrolled={enrolledPathsMap.hasOwnProperty(path._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPaths;
