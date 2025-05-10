import React from 'react';
import { motion } from 'framer-motion';

const CourseCardSkeleton = ({ index }) => {
  // Animation variants for skeleton loading
  const skeletonVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
      }
    }
  };

  // Pulse animation for skeleton
  const pulseVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="bg-richblack-800 rounded-xl overflow-hidden shadow-md"
      variants={skeletonVariants}
      initial="initial"
      animate="animate"
    >
      {/* Thumbnail skeleton */}
      <motion.div 
        className="w-full h-48 bg-richblack-700"
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />
      
      <div className="p-4">
        {/* Title skeleton */}
        <motion.div 
          className="h-6 bg-richblack-700 rounded-md mb-3 w-3/4"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
        
        {/* Instructor skeleton */}
        <motion.div 
          className="h-4 bg-richblack-700 rounded-md mb-3 w-1/2"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-2 mb-3">
          <motion.div 
            className="h-4 bg-richblack-700 rounded-md w-24"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        
        {/* Meta info skeleton */}
        <div className="flex justify-between items-center">
          <motion.div 
            className="h-4 bg-richblack-700 rounded-md w-16"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div 
            className="h-4 bg-richblack-700 rounded-md w-16"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />
        </div>
        
        {/* Price skeleton */}
        <motion.div 
          className="h-6 bg-richblack-700 rounded-md mt-4 w-20"
          variants={pulseVariants}
          initial="initial"
          animate="animate"
        />
      </div>
    </motion.div>
  );
};

export default CourseCardSkeleton;
