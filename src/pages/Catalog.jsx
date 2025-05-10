import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FaGraduationCap, FaBook, FaChalkboardTeacher } from "react-icons/fa";

// API and Services
import { categories } from "../services/apis";
import { apiConnector } from "../services/apiConnector";
import { getCatalogaPageData } from "../services/operations/pageAndComponentData";

// Components
import ImprovedCatalogCard from "../Components/core/Catalog/ImprovedCatalogCard";
import CourseSlider from "../Components/core/Catalog/CourseSlider";
import FilterSection from "../Components/core/Catalog/FilterSection";
import CourseCardSkeleton from "../Components/core/Catalog/CourseCardSkeleton";
import BackToTop from "../Components/common/BackToTop";

const Catalog = () => {
  // Get category from URL params
  const { catalog } = useParams();

  // State variables
  const [categoryData, setCategoryData] = useState(null);
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Filter and sort state
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortOption, setSortOption] = useState("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();

  // Fetch category data
  const fetchCategoryData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      const categoryInfo = result.data.data.find(
        (item) => item.name === catalog
      );

      if (categoryInfo) {
        setCategoryID(categoryInfo._id);
        setCategoryData(categoryInfo);
      }
    } catch (error) {
      console.error("Could not fetch category data:", error);
    }
  }, [catalog]);

  // Fetch catalog page data
  const fetchCatalogPageData = useCallback(async () => {
    if (!categoryID) return;

    try {
      const result = await getCatalogaPageData(categoryID, dispatch);
      setCatalogPageData(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Could not fetch catalog page data:", error);
      setIsLoading(false);
    }
  }, [categoryID, dispatch]);

  // Filter and sort courses
  const filterAndSortCourses = useCallback(() => {
    if (!catalogPageData?.selectedCourses) return;

    let courses = [...catalogPageData.selectedCourses];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(
        (course) =>
          course.courseName.toLowerCase().includes(query) ||
          (course.instructor?.firstName + " " + course.instructor?.lastName)
            .toLowerCase()
            .includes(query) ||
          (course.tag &&
            course.tag.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Apply category filter
    if (activeFilter !== "all") {
      switch (activeFilter) {
        case "popular":
          courses = courses.sort(
            (a, b) =>
              (b.ratingAndReviews?.length || 0) -
              (a.ratingAndReviews?.length || 0)
          );
          break;
        case "new":
          courses = courses.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;
        case "beginner":
          courses = courses.filter(
            (course) =>
              course.tag &&
              course.tag.some((tag) =>
                ["beginner", "basics", "fundamental", "introduction"].includes(
                  tag.toLowerCase()
                )
              )
          );
          break;
        case "advanced":
          courses = courses.filter(
            (course) =>
              course.tag &&
              course.tag.some((tag) =>
                ["advanced", "expert", "professional"].includes(
                  tag.toLowerCase()
                )
              )
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        courses = courses.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        courses = courses.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        courses = courses.sort((a, b) => {
          const aRating =
            a.ratingAndReviews?.reduce(
              (sum, review) => sum + review.rating,
              0
            ) / (a.ratingAndReviews?.length || 1);
          const bRating =
            b.ratingAndReviews?.reduce(
              (sum, review) => sum + review.rating,
              0
            ) / (b.ratingAndReviews?.length || 1);
          return bRating - aRating;
        });
        break;
      default:
        // 'relevance' - no additional sorting
        break;
    }

    setFilteredCourses(courses);
  }, [catalogPageData, activeFilter, sortOption, searchQuery]);

  // Effect hooks
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  useEffect(() => {
    if (categoryID) {
      fetchCatalogPageData();
    }
  }, [categoryID, fetchCatalogPageData]);

  useEffect(() => {
    filterAndSortCourses();
  }, [
    filterAndSortCourses,
    catalogPageData,
    activeFilter,
    sortOption,
    searchQuery,
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Stats for the category
  const categoryStats = [
    {
      icon: <FaGraduationCap className="text-yellow-50 text-2xl" />,
      value: catalogPageData?.selectedCourses?.length || 0,
      label: "Courses",
    },
    {
      icon: <FaChalkboardTeacher className="text-yellow-50 text-2xl" />,
      value: new Set(
        catalogPageData?.selectedCourses?.map(
          (course) => course.instructor?._id
        ) || []
      ).size,
      label: "Instructors",
    },
    {
      icon: <FaBook className="text-yellow-50 text-2xl" />,
      value:
        catalogPageData?.selectedCourses?.reduce(
          (sum, course) => sum + (course.courseContent?.length || 0),
          0
        ) || 0,
      label: "Lessons",
    },
  ];

  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-b from-richblack-800 to-richblack-900 py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto max-w-maxContent">
          {/* Breadcrumb */}
          <p className="text-sm text-richblack-300 mb-4">
            Home / Catalog / <span className="text-yellow-25">{catalog}</span>
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-richblack-5 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {catalog}
              </motion.h1>

              <motion.p
                className="text-richblack-200 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {categoryData?.description ||
                  `Explore our ${catalog} courses and enhance your skills with expert-led instruction.`}
              </motion.p>
            </div>

            {/* Stats Cards */}
            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-end items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categoryStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-richblack-800 p-4 rounded-lg text-center min-w-[120px]"
                  variants={itemVariants}
                >
                  <div className="flex justify-center mb-2">{stat.icon}</div>
                  <h3 className="text-2xl font-bold text-richblack-5">
                    {stat.value}
                  </h3>
                  <p className="text-richblack-300 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto max-w-maxContent px-4 py-12">
        {/* Filter Section */}
        <FilterSection
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalCourses={filteredCourses.length}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Courses Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-richblack-5 mb-6">
            {activeFilter === "all"
              ? "All Courses"
              : activeFilter === "popular"
              ? "Most Popular Courses"
              : activeFilter === "new"
              ? "Newest Courses"
              : activeFilter === "beginner"
              ? "Courses for Beginners"
              : "Advanced Courses"}
          </h2>

          {isLoading ? (
            // Skeleton loading
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <CourseCardSkeleton key={index} index={index} />
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            // Course grid
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredCourses.map((course, index) => (
                <ImprovedCatalogCard
                  key={course._id}
                  course={course}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            // No courses found
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl text-richblack-5 mb-2">
                No courses found
              </h3>
              <p className="text-richblack-300">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>

        {/* Similar Courses Section */}
        {catalogPageData?.differentCourses?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-richblack-5 mb-6">
              Similar to {catalog}
            </h2>
            <CourseSlider Courses={catalogPageData.differentCourses} />
          </div>
        )}

        {/* Frequently Bought Together Section */}
        {catalogPageData?.mostSellingCourses?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-richblack-5 mb-6">
              Frequently Bought Together
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {catalogPageData.mostSellingCourses
                .slice(0, 4)
                .map((course, index) => (
                  <ImprovedCatalogCard
                    key={course._id}
                    course={course}
                    index={index}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
};

export default Catalog;
