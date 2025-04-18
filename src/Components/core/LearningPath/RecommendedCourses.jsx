import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getRecommendedCourses } from '../../../services/operations/learningPathAPI';
import CourseSlider from '../Catalog/CourseSlider';

const RecommendedCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setLoading(true);
      if (token) {
        const courses = await getRecommendedCourses(token, dispatch);
        setRecommendedCourses(courses);
      }
      setLoading(false);
    };

    fetchRecommendedCourses();
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

  if (!recommendedCourses || recommendedCourses.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
          Recommended Courses
        </h2>
        <p className="text-richblack-300">
          Complete more courses to get personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-richblack-5 mb-6">
        Recommended Courses for You
      </h2>
      <CourseSlider Courses={recommendedCourses} />
    </div>
  );
};

export default RecommendedCourses;
