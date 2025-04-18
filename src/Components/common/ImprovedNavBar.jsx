import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { matchPath } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import {
  FiShoppingCart,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { IoCodeSlashOutline } from "react-icons/io5";
import { RiRoadMapLine } from "react-icons/ri";

// Components
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { ChitkaraLogoFull } from "../../assets/Logo/ChitkaraLogo";

// Data and Services
import { NavbarLinks } from "../../data/navbar-links";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const ImprovedNavBar = ({ setProgress }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Redux state
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  // Local state
  const [sublinks, setSublinks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Refs
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Match current route
  const matchRoutes = (routes) => {
    return matchPath({ path: routes }, location.pathname);
  };

  // Fetch category sublinks
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data?.length > 0) {
        setSublinks(result?.data?.data);
        localStorage.setItem("sublinks", JSON.stringify(result.data.data));
      }
    } catch (error) {
      const cachedSublinks = localStorage.getItem("sublinks");
      if (cachedSublinks) {
        setSublinks(JSON.parse(cachedSublinks));
      }
      console.log("Error fetching sublinks:", error);
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue?.length > 0) {
      navigate(`/search/${searchValue}`);
      setSearchValue("");
      setIsSearchExpanded(false);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle catalog dropdown
  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  // Toggle search expansion
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch sublinks on component mount
  useEffect(() => {
    fetchSublinks();
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const navbarVariants = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    hidden: {
      y: -100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-richblack-900 shadow-lg backdrop-blur-sm bg-opacity-90"
          : "bg-richblack-900"
      }`}
      variants={navbarVariants}
      initial="visible"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              onClick={() => dispatch(setProgress(100))}
              className="flex items-center py-4"
            >
              <ChitkaraLogoFull
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
                theme="light"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {/* Main Navigation Links */}
            <div className="flex items-center space-x-8">
              {NavbarLinks.map((link, index) => (
                <div key={index} className="relative group">
                  {link.title === "Catalog" ? (
                    <div className="flex items-center cursor-pointer">
                      <button
                        onClick={toggleCatalog}
                        className={`flex items-center text-base font-medium ${
                          isCatalogOpen ? "text-yellow-50" : "text-richblack-25"
                        } hover:text-yellow-50 transition-colors duration-300`}
                      >
                        <span>{link.title}</span>
                        <FiChevronDown
                          className={`ml-1 transition-transform duration-300 ${
                            isCatalogOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isCatalogOpen && (
                          <motion.div
                            className="absolute left-0 mt-3 w-60 rounded-md shadow-lg bg-richblack-800 ring-1 ring-black ring-opacity-5 z-50"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={dropdownVariants}
                          >
                            <div className="py-2 rounded-md bg-richblack-800 shadow-xs">
                              {sublinks.map((category, idx) => (
                                <Link
                                  key={idx}
                                  to={`/catalog/${category.name}`}
                                  onClick={() => {
                                    dispatch(setProgress(30));
                                    setIsCatalogOpen(false);
                                  }}
                                  className="block px-5 py-3 text-sm text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 transition-colors duration-200"
                                >
                                  {category.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => dispatch(setProgress(100))}
                      className={`text-base font-medium ${
                        matchRoutes(link.path)
                          ? "text-yellow-50"
                          : "text-richblack-25"
                      } hover:text-yellow-50 transition-colors duration-300`}
                    >
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative mx-2">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <motion.input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search courses..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className={`bg-richblack-800 text-richblack-25 rounded-full py-2.5 pl-11 pr-5 focus:outline-none focus:ring-2 focus:ring-yellow-50 transition-all duration-300 ${
                      isSearchExpanded ? "w-72" : "w-0 opacity-0"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: isSearchExpanded ? 280 : 0 }}
                  />
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-richblack-300 hover:text-yellow-50 transition-colors duration-300"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Cart Icon (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
                className="relative p-2 mx-1 rounded-full hover:bg-richblack-800 transition-colors duration-300"
              >
                <FiShoppingCart className="h-6 w-6 text-richblack-25 hover:text-yellow-50 transition-colors duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-50 text-richblack-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Buttons or Profile */}
            {token === null ? (
              <div className="flex items-center space-x-5 ml-2">
                <Link
                  to="/login"
                  onClick={() => dispatch(setProgress(100))}
                  className="text-richblack-25 hover:text-yellow-50 px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => dispatch(setProgress(100))}
                  className="bg-yellow-50 text-richblack-900 hover:bg-yellow-25 px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-300 shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center ml-2">
                <ProfileDropDown />
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden space-x-1">
            {/* Cart Icon (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
                className="relative p-2 mr-2 rounded-full hover:bg-richblack-800 transition-colors duration-300"
              >
                <FiShoppingCart className="h-6 w-6 text-richblack-25" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-50 text-richblack-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-md text-richblack-25 hover:text-yellow-50 hover:bg-richblack-800 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            className="md:hidden bg-richblack-800 shadow-xl"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="px-4 pt-4 pb-5 space-y-2 sm:px-5">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="px-2 py-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full bg-richblack-700 text-richblack-25 rounded-md py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-yellow-50 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-richblack-300"
                  >
                    <FiSearch className="h-5 w-5" />
                  </button>
                </div>
              </form>

              {/* Navigation Links */}
              {NavbarLinks.map((link, index) => (
                <div key={index} className="py-1.5 my-1">
                  {link.title === "Catalog" ? (
                    <div>
                      <button
                        onClick={toggleCatalog}
                        className="w-full flex items-center justify-between px-5 py-3 text-base font-medium text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 rounded-md transition-colors duration-300"
                      >
                        <span className="flex items-center">
                          <HiOutlineAcademicCap className="mr-3 h-5 w-5" />
                          {link.title}
                        </span>
                        <FiChevronDown
                          className={`transition-transform duration-300 ${
                            isCatalogOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isCatalogOpen && (
                          <motion.div
                            className="mt-1 pl-8 space-y-1"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {sublinks.map((category, idx) => (
                              <Link
                                key={idx}
                                to={`/catalog/${category.name}`}
                                onClick={() => {
                                  dispatch(setProgress(30));
                                  setIsMenuOpen(false);
                                }}
                                className="block px-5 py-2.5 text-sm text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 rounded-md transition-colors duration-300"
                              >
                                {category.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => {
                        dispatch(setProgress(100));
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center px-5 py-3 text-base font-medium text-richblack-25 hover:bg-richblack-700 hover:text-yellow-50 rounded-md transition-colors duration-300"
                    >
                      {link.title === "Learning Paths" ? (
                        <RiRoadMapLine className="mr-3 h-5 w-5" />
                      ) : link.title === "Code Playground" ? (
                        <IoCodeSlashOutline className="mr-3 h-5 w-5" />
                      ) : (
                        <span className="mr-3 h-5 w-5"></span>
                      )}
                      {link.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* Auth Buttons */}
              {token === null ? (
                <div className="pt-3 pb-1 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => {
                      dispatch(setProgress(100));
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-5 py-3 text-center text-base font-medium text-richblack-25 bg-richblack-700 hover:bg-richblack-600 rounded-md transition-colors duration-300"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => {
                      dispatch(setProgress(100));
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-5 py-3 text-center text-base font-medium text-richblack-900 bg-yellow-50 hover:bg-yellow-25 rounded-md transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="pt-3 pb-1 flex justify-center">
                  <ProfileDropDown />
                </div>
              )}

              {/* Become Instructor Button */}
              {user && user?.accountType !== "Instructor" && (
                <div className="pt-3 pb-1">
                  <Link
                    to="/become-an-instructor"
                    onClick={() => {
                      dispatch(setProgress(100));
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-5 py-3 text-center text-base font-medium text-richblack-900 bg-yellow-50 hover:bg-yellow-25 rounded-md transition-colors duration-300"
                  >
                    Become an Instructor
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default ImprovedNavBar;
