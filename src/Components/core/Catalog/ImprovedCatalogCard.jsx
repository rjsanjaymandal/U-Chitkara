import React, { useEffect, useState, memo } from "react";
import { Link } from "react-router-dom";
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";
import { motion } from "framer-motion";
import { FaRegBookmark, FaBookmark, FaRegClock } from "react-icons/fa";
import { MdOutlinePeopleAlt } from "react-icons/md";

const ImprovedCatalogCard = ({ course, index }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if course and ratingAndReviews exist before calculating average
    if (course && course.ratingAndReviews) {
      const count = GetAvgRating(course.ratingAndReviews);
      setAvgReviewCount(count);
    } else {
      setAvgReviewCount(0);
    }
  }, [course]);

  // Return null if course is undefined or null - AFTER hooks are declared
  if (!course) {
    console.warn("ImprovedCatalogCard received undefined or null course");
    return null;
  }

  // Calculate estimated duration (just for display purposes)
  const estimatedDuration = (() => {
    // Check if courseContent exists and is an array
    if (course?.courseContent && Array.isArray(course.courseContent)) {
      return course.courseContent.reduce((total, section) => {
        // Check if section.subSection exists and is an array
        if (section?.subSection && Array.isArray(section.subSection)) {
          return total + section.subSection.length * 10;
        }
        return total;
      }, 0);
    }
    // Fallback to random duration if courseContent is not available or not an array
    return Math.floor(Math.random() * 10 + 5);
  })();

  // Format the duration into hours and minutes
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Stagger the animations
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-richblack-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link to={`/courses/${course._id}`} className="block h-full">
        <div className="relative">
          {/* Thumbnail */}
          <img
            src={course?.thumbnail}
            alt={course?.courseName}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />

          {/* Bookmark button */}
          <button
            className="absolute top-3 right-3 bg-richblack-900 bg-opacity-60 p-2 rounded-full text-white hover:bg-opacity-80 transition-all"
            onClick={(e) => {
              e.preventDefault();
              setIsBookmarked(!isBookmarked);
            }}
          >
            {isBookmarked ? (
              <FaBookmark className="text-yellow-50" />
            ) : (
              <FaRegBookmark />
            )}
          </button>

          {/* Category tag */}
          {course?.category?.name && (
            <div className="absolute bottom-3 left-3 bg-richblack-900 bg-opacity-70 px-3 py-1 rounded-full text-xs text-yellow-50">
              {course.category.name}
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Course title */}
          <h3 className="text-lg font-semibold text-richblack-5 line-clamp-2 mb-2">
            {course?.courseName || "Untitled Course"}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-richblack-300 mb-3">
            By{" "}
            <span className="text-yellow-50">
              {course?.instructor
                ? `${course.instructor.firstName || ""} ${
                    course.instructor.lastName || ""
                  }`.trim() || "Unknown Instructor"
                : "Unknown Instructor"}
            </span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-50 font-medium">
              {typeof avgReviewCount === "number"
                ? avgReviewCount.toFixed(1)
                : "0.0"}
            </span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className="text-richblack-300 text-sm">
              (
              {course?.ratingAndReviews &&
              Array.isArray(course.ratingAndReviews)
                ? course.ratingAndReviews.length
                : 0}
              )
            </span>
          </div>

          {/* Course meta */}
          <div className="flex justify-between items-center text-sm text-richblack-300">
            <div className="flex items-center gap-1">
              <FaRegClock />
              <span>{formatDuration(estimatedDuration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdOutlinePeopleAlt />
              <span>
                {course?.studentsEnrolled &&
                Array.isArray(course.studentsEnrolled)
                  ? `${course.studentsEnrolled.length} students`
                  : "0 students"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xl font-bold text-yellow-50">
              ₹{course?.price || 0}
            </p>
            <span className="bg-richblack-700 text-richblack-50 text-xs px-2 py-1 rounded">
              {course?.tag && Array.isArray(course.tag) && course.tag.length > 0
                ? course.tag[0]
                : "Course"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(ImprovedCatalogCard);
