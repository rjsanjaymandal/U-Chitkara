import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const FilterSection = ({ 
  activeFilter, 
  setActiveFilter, 
  sortOption, 
  setSortOption,
  searchQuery,
  setSearchQuery,
  totalCourses,
  showFilters,
  setShowFilters
}) => {
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Courses' },
    { id: 'popular', label: 'Most Popular' },
    { id: 'new', label: 'Newest' },
    { id: 'beginner', label: 'For Beginners' },
    { id: 'advanced', label: 'Advanced' }
  ];

  // Sort options
  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="bg-richblack-800 rounded-xl p-4 mb-8 shadow-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="flex items-center mb-4 md:mb-0">
          <h3 className="text-richblack-5 font-medium mr-2">Browse {totalCourses} courses</h3>
          <button 
            className="md:hidden bg-richblack-700 p-2 rounded-md text-richblack-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <MdClose /> : <FaFilter />}
          </button>
        </div>
        
        {/* Search input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-richblack-700 text-richblack-5 px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-50"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-richblack-400" />
        </div>
      </div>
      
      {/* Filter and sort options */}
      <div className={`${showFilters ? 'block' : 'hidden md:flex'} flex-col md:flex-row justify-between`}>
        {/* Filter tabs */}
        <motion.div className="flex flex-wrap gap-2 mb-4 md:mb-0">
          {filterOptions.map((option) => (
            <motion.button
              key={option.id}
              variants={itemVariants}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeFilter === option.id
                  ? 'bg-yellow-50 text-richblack-900 font-medium'
                  : 'bg-richblack-700 text-richblack-100 hover:bg-richblack-600'
              }`}
              onClick={() => setActiveFilter(option.id)}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Sort dropdown */}
        <motion.div 
          className="relative"
          variants={itemVariants}
        >
          <div className="flex items-center bg-richblack-700 px-4 py-2 rounded-md cursor-pointer">
            <FaSort className="mr-2 text-richblack-300" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-transparent text-richblack-5 focus:outline-none cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FilterSection;
