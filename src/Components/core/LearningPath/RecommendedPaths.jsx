import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRecommendedLearningPaths, getUserLearningPaths } from '../../../services/operations/learningPathAPI';
import LearningPathSlider from './LearningPathSlider';

const RecommendedPaths = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [userPaths, setUserPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (token) {
        // Fetch both recommended paths and user's enrolled paths
        const [paths, userEnrolledPaths] = await Promise.all([
          getRecommendedLearningPaths(token, dispatch),
          getUserLearningPaths(token, dispatch)
        ]);
        
        setRecommendedPaths(paths);
        setUserPaths(userEnrolledPaths);
      }
      setLoading(false);
    };

    fetchData();
  }, [token, dispatch]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-richblack-700 rounded-md mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-richblack-800 rounded-lg h-[300px]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendedPaths || recommendedPaths.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
          Recommended Learning Paths
        </h2>
        <p className="text-richblack-300">
          Complete more courses to get personalized learning path recommendations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
        Recommended Learning Paths for You
      </h2>
      <LearningPathSlider 
        learningPaths={recommendedPaths} 
        userLearningPaths={userPaths} 
      />
    </div>
  );
};

export default RecommendedPaths;
