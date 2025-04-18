import React, { useState, useRef, useEffect } from "react";
import { ChitkaraLogoFull } from "../../assets/Logo/ChitkaraLogo";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { TiShoppingCart } from "react-icons/ti";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";
import { useDispatch } from "react-redux";
import { setProgress } from "../../slices/loadingBarSlice";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiSearch } from "react-icons/hi";
import { FaCode, FaRobot, FaGamepad, FaRoute } from "react-icons/fa";

const NavBar = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  // visible state is used in handleScroll function
  const [visible, setVisible] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const show = useRef(null);
  const overlay = useRef(null);

  const location = useLocation();
  const matchRoutes = (routes) => {
    return matchPath({ path: routes }, location.pathname);
  };

  const [sublinks, setsublinks] = useState([]);
  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      if (result?.data?.data?.length > 0) {
        setsublinks(result?.data?.data);
      }
      localStorage.setItem("sublinks", JSON.stringify(result.data.data));
    } catch (error) {
      // setsublinks(JSON.parse(localStorage.getItem("sublinks")));
      // console.log("could not fetch sublinks",localStorage.getItem("sublinks"));
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSublinks();
  }, []);

  const shownav = () => {
    if (show.current && overlay.current) {
      show.current.classList.toggle("navshow");
      overlay.current.classList.toggle("hidden");
      // Prevent body scrolling when menu is open
      document.body.style.overflow = show.current.classList.contains("navshow")
        ? "hidden"
        : "";
    }
  };

  //handeling navbar scroll
  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handelSearch = (e) => {
    e.preventDefault();
    if (searchValue?.length > 0) {
      window.location.href = `/search/${searchValue}`;
      setSearchValue("");
    }
  };

  // Helper function to get the appropriate icon component
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "code":
        return FaCode;
      case "ai":
        return FaRobot;
      case "game":
        return FaGamepad;
      case "path":
        return FaRoute;
      default:
        return FaCode;
    }
  };

  return (
    <div
      className={`flex sm:relative bg-richblack-900 w-screen relative z-50 h-16 md:h-16 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-500 ${
        !visible ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between h-full">
        <Link
          to="/"
          onClick={() => {
            dispatch(setProgress(100));
          }}
        >
          <ChitkaraLogoFull
            className="w-[120px] md:w-[160px] h-auto"
            theme="light"
          />
        </Link>
        {/* mobile Navbar */}
        {user && user?.accountType !== "Instructor" && (
          <div className=" md:hidden">
            <Link
              to="/dashboard/cart"
              className=" relative left-10"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <div className="">
                <TiShoppingCart className=" fill-richblack-25 w-8 h-8" />
              </div>
              {totalItems > 0 && (
                <span className=" font-medium text-[12px] shadow-[3px ] shadow-black bg-yellow-100 text-richblack-900 rounded-full px-[4px] absolute -top-[2px] right-[1px]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        )}

        <div className="flex md:hidden items-center">
          <div className="flex items-center">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 transition-colors duration-200 mr-2"
              aria-label="Search"
            >
              <HiSearch className="h-5 w-5 text-richblack-100" />
            </button>
          </div>
          <GiHamburgerMenu
            className="w-8 h-8 fill-richblack-25"
            onClick={shownav}
          />
          <div
            ref={overlay}
            className=" fixed top-0 bottom-0 left-0 right-0 z-30 bg w-[100vw] hidden h-[100vh] overflow-y-hidden bg-[rgba(0,0,0,0.5)] "
            onClick={shownav}
          ></div>
          <div ref={show} className="mobNav z-50">
            <nav
              className="items-center flex flex-col absolute w-[250px] right-0 top-0 glass2 h-screen overflow-y-auto p-4 scrollbar-hide"
              ref={show}
            >
              <button
                onClick={shownav}
                className="absolute top-4 right-4 text-richblack-300 hover:text-richblack-50 transition-colors duration-200"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {token == null && (
                <Link
                  to="/login"
                  className=""
                  onClick={() => {
                    dispatch(setProgress(100));
                  }}
                >
                  <button
                    onClick={shownav}
                    className=" mt-4 text-center text-[15px] px-6 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Login
                  </button>
                </Link>
              )}
              {token == null && (
                <Link
                  to="/signup"
                  className="text-yellow-50"
                  onClick={() => {
                    dispatch(setProgress(100));
                  }}
                >
                  <button
                    onClick={shownav}
                    className="mt-4 text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200"
                  >
                    Signup
                  </button>
                </Link>
              )}

              {token != null && (
                <div className=" mt-2">
                  <p className=" text-richblack-50 text-center mb-2">Account</p>
                  {/* <Link to='/dashboard' onClick={()=>{dispatch(setProgress(100));shownav()}} className="p-2"> */}
                  <ProfileDropDown />
                  {/* </Link> */}
                  {user?.accountType !== "Instructor" && (
                    <div className="flex flex-col items-center gap-4 mt-4">
                      <Link
                        to="/become-an-instructor"
                        onClick={() => {
                          dispatch(setProgress(100));
                          shownav();
                        }}
                        className="block text-center"
                      >
                        <button className="text-center text-[15px] px-5 py-2 rounded-md font-semibold bg-yellow-50 text-black hover:scale-95 transition-all duration-200">
                          Become an Instructor
                        </button>
                      </Link>
                      <Link
                        to="/dashboard/cart"
                        onClick={() => {
                          dispatch(setProgress(100));
                          shownav();
                        }}
                        className="relative"
                      >
                        <div className="flex items-center justify-center">
                          <TiShoppingCart className="fill-richblack-25 w-7 h-7" />
                          {totalItems > 0 && (
                            <span className="shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] right-[-8px]">
                              {totalItems}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              <p className=" text-xl text-yellow-50 font-semibold">Courses</p>
              <div className=" flex flex-col items-end pr-4">
                {sublinks?.length < 0 ? (
                  <div></div>
                ) : (
                  sublinks?.map((element, index) => (
                    <Link
                      to={`/catalog/${element?.name}`}
                      key={index}
                      onClick={() => {
                        dispatch(setProgress(30));
                        shownav();
                      }}
                      className="p-2 text-sm"
                    >
                      <p className=" text-richblack-5 ">{element?.name}</p>
                    </Link>
                  ))
                )}
              </div>
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>

              {/* Explore Section for Mobile */}
              <p className=" text-xl text-yellow-50 font-semibold">Explore</p>
              <div className=" flex flex-col items-end pr-4">
                {NavbarLinks.find(
                  (item) => item.title === "Explore"
                )?.links?.map((item, idx) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <Link
                      to={item.path}
                      key={idx}
                      onClick={() => {
                        dispatch(setProgress(100));
                        shownav();
                      }}
                      className="p-2 text-sm flex items-start gap-2"
                    >
                      <div className="text-yellow-50 mt-1">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="text-right">
                        <p className="text-richblack-5 font-medium">
                          {item.title}
                        </p>
                        <p className="text-xs text-richblack-300">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className=" mt-4 mb-4 bg-richblack-25 w-[200px] h-[2px]"></div>
              <Link
                to="/about"
                onClick={() => {
                  dispatch(setProgress(100));
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">About</p>
              </Link>
              <Link
                to="/contact"
                onClick={() => {
                  dispatch(setProgress(100));
                  shownav();
                }}
                className="p-2"
              >
                <p className=" text-richblack-5 ">Contact</p>
              </Link>
            </nav>
          </div>
        </div>

        {/* Desktop Navbar */}
        <nav>
          <ul className="flex-row gap-x-3 lg:gap-x-6 text-richblack-25 hidden md:flex items-center h-full">
            {NavbarLinks?.map((element, index) => (
              <li key={index}>
                {element.title === "Catalog" || element.dropdown ? (
                  <div className=" flex items-center group relative cursor-pointer">
                    <p>{element.title}</p>
                    <svg
                      width="25px"
                      height="20px"
                      viewBox="0 0 24.00 24.00"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(0)"
                      stroke="#000000"
                      strokeWidth="0.00024000000000000003"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        stroke="#CCCCCC"
                        strokeWidth="0.384"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
                          fill="#ffffff"
                        ></path>{" "}
                      </g>
                    </svg>

                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[220px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg glass2 p-4 text-richblack-5 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] shadow-lg shadow-richblack-900/20">
                      {/* Diamond pointer removed */}

                      {/* Catalog dropdown */}
                      {element.title === "Catalog" && (
                        <>
                          {sublinks?.length < 0 ? (
                            <div></div>
                          ) : (
                            sublinks?.map((item, idx) => (
                              <Link
                                to={`/catalog/${item?.name}`}
                                key={idx}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-700 text-richblack-5 transition-all duration-200"
                                onClick={() => {
                                  dispatch(setProgress(30));
                                }}
                              >
                                <p className="">{item?.name}</p>
                              </Link>
                            ))
                          )}
                        </>
                      )}

                      {/* Explore dropdown */}
                      {element.dropdown && element.title === "Explore" && (
                        <>
                          {element.links?.map((item, idx) => {
                            const IconComponent = getIconComponent(item.icon);
                            return (
                              <Link
                                to={item.path}
                                key={idx}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-700 flex items-start gap-3 transition-all duration-200"
                                onClick={() => {
                                  dispatch(setProgress(100));
                                }}
                              >
                                <div className="text-yellow-50 mt-1">
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-richblack-5">
                                    {item.title}
                                  </p>
                                  <p className="text-xs text-richblack-300">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={element?.path}
                    onClick={() => {
                      dispatch(setProgress(100));
                    }}
                  >
                    <p
                      className={`${
                        matchRoutes(element?.path)
                          ? " text-yellow-25"
                          : " text-richblack-25 hidden md:block"
                      }`}
                    >
                      {element?.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
            <li className="flex items-center h-full">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center mx-2 h-8 w-8 rounded-full bg-richblack-700 hover:bg-richblack-600 transition-colors duration-200"
                aria-label="Search"
              >
                <HiSearch className="h-5 w-5 text-richblack-100" />
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex-row gap-3 lg:gap-5 hidden md:flex items-center h-full">
          {user && user?.accountType !== "Instructor" && (
            <>
              <Link
                to="/become-an-instructor"
                className="text-richblack-25"
                onClick={() => {
                  dispatch(setProgress(100));
                }}
              >
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[8px] md:px-[12px] py-[7px] text-richblack-100 hover:bg-yellow-50 hover:text-richblack-900 transition-all duration-200 text-sm md:text-base">
                  Become an Instructor
                </button>
              </Link>
              <Link
                to="/dashboard/cart"
                className="relative px-4"
                onClick={() => {
                  dispatch(setProgress(100));
                }}
              >
                <div className="z-50">
                  <TiShoppingCart className="fill-richblack-25 w-7 h-7" />
                </div>
                {totalItems > 0 && (
                  <span className="shadow-sm shadow-black text-[10px] font-bold bg-yellow-100 text-richblack-900 rounded-full px-1 absolute -top-[2px] right-[8px]">
                    {totalItems}
                  </span>
                )}
              </Link>
            </>
          )}
          {token == null && (
            <Link
              to="/login"
              className="text-richblack-25"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[8px] md:px-[12px] py-[7px] text-richblack-100 hover:bg-richblack-700 transition-all duration-200 text-sm md:text-base">
                Login
              </button>
            </Link>
          )}
          {token == null && (
            <Link
              to="/signup"
              className="text-richblack-25"
              onClick={() => {
                dispatch(setProgress(100));
              }}
            >
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[8px] md:px-[12px] py-[7px] text-richblack-100 hover:bg-richblack-700 transition-all duration-200 text-sm md:text-base">
                Signup
              </button>
            </Link>
          )}
          {token !== null && (
            <div>
              <ProfileDropDown />
            </div>
          )}
        </div>
      </div>

      {/* Search Popup */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-richblack-900 bg-opacity-75 transition-opacity"
              onClick={() => setSearchOpen(false)}
            ></div>

            {/* Search Modal */}
            <div className="transform overflow-hidden rounded-lg bg-richblack-800 text-left align-middle shadow-xl transition-all w-full max-w-lg">
              <div className="relative p-6">
                {/* Close button */}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute top-3 right-3 text-richblack-300 hover:text-richblack-50 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Search form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchValue.trim()) {
                      handelSearch(e);
                      setSearchOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center border-b-2 border-richblack-700 pb-4">
                    <HiSearch className="h-6 w-6 text-richblack-300 mr-3" />
                    <input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="w-full bg-transparent text-richblack-5 text-xl focus:outline-none placeholder-richblack-400"
                      placeholder="Search courses, topics..."
                      autoFocus
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 rounded-md border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100 hover:bg-richblack-700 transition-colors duration-200"
                      onClick={() => setSearchOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-yellow-50 px-4 py-2 text-richblack-900 hover:bg-yellow-100 transition-colors duration-200"
                      disabled={!searchValue.trim()}
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
