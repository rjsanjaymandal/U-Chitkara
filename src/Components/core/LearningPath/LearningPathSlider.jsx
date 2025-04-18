import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import LearningPathCard from './LearningPathCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const LearningPathSlider = ({ learningPaths, userLearningPaths = [] }) => {
  // If no learning paths, show a message
  if (!learningPaths || learningPaths.length === 0) {
    return (
      <div className="text-center text-richblack-300 py-8">
        No learning paths available at the moment.
      </div>
    );
  }

  // Create a map of enrolled learning paths with their progress
  const enrolledPathsMap = {};
  userLearningPaths.forEach(path => {
    enrolledPathsMap[path._id] = path.userProgress || 0;
  });

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        className="py-10"
      >
        {learningPaths.map((path) => (
          <SwiperSlide key={path._id}>
            <LearningPathCard 
              learningPath={path} 
              userProgress={enrolledPathsMap[path._id] || 0}
              enrolled={enrolledPathsMap.hasOwnProperty(path._id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LearningPathSlider;
