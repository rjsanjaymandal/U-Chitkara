import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { matchPath } from "react-router-dom";
import { setProgress } from "../../slices/loadingBarSlice";

// Ant Design Components
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Input,
  Dropdown,
  Space,
  Avatar,
  Badge,
  Divider,
  Typography,
} from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
  RightOutlined,
  CodeOutlined,
  ReadOutlined,
  BookOutlined,
  TeamOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";

// Components
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { ChitkaraLogoFull } from "../../assets/Logo/ChitkaraLogo";

// Data and Services
import { NavbarLinks } from "../../data/navbar-links";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

// Assets
import { TiShoppingCart } from "react-icons/ti";

const { Header, Sider, Content } = Layout;
const { Search } = Input;
const { Text } = Typography;

const AntNavBar = () => {
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  // Match current route
  const matchRoutes = (path) => {
    return matchPath({ path }, location.pathname);
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
  const handleSearch = (value) => {
    if (value?.length > 0) {
      dispatch(setProgress(30));
      navigate(`/search/${value}`);
      setSearchValue("");
      setMobileMenuOpen(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Set active menu item
  useEffect(() => {
    const path = location.pathname;

    if (path === "/") {
      setActiveMenu("Home");
    } else if (path.includes("/catalog")) {
      setActiveMenu("Catalog");
    } else if (path.includes("/learning-paths")) {
      setActiveMenu("Explore");
    } else if (path.includes("/code-playground")) {
      setActiveMenu("Explore");
    } else if (path.includes("/about")) {
      setActiveMenu("About Us");
    } else if (path.includes("/contact")) {
      setActiveMenu("Contact Us");
    } else {
      setActiveMenu("");
    }
  }, [location]);

  // Fetch sublinks on component mount
  useEffect(() => {
    fetchSublinks();
  }, []);

  // Generate menu items for desktop
  const getDesktopMenuItems = () => {
    return NavbarLinks.map((link) => {
      if (link.title === "Catalog") {
        // Catalog dropdown
        const catalogMenu = (
          <Menu
            className="bg-richblack-800 border border-richblack-700 rounded-lg p-2"
            items={sublinks.map((item, index) => ({
              key: `catalog-${index}`,
              label: (
                <Link
                  to={`/catalog/${item.name}`}
                  onClick={() => dispatch(setProgress(30))}
                  className="text-richblack-25 hover:text-yellow-50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ),
            }))}
          />
        );

        return (
          <Dropdown
            key="catalog"
            overlay={catalogMenu}
            placement="bottomLeft"
            overlayClassName="custom-dropdown"
          >
            <a
              className={`px-4 py-2 text-base ${
                activeMenu === "Catalog"
                  ? "text-yellow-50"
                  : "text-richblack-25"
              } hover:text-yellow-50 transition-all duration-200`}
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                {link.title}
                <DownOutlined style={{ fontSize: "12px" }} />
              </Space>
            </a>
          </Dropdown>
        );
      } else if (link.dropdown && link.title === "Explore") {
        // Explore dropdown
        const exploreMenu = (
          <Menu
            className="bg-richblack-800 border border-richblack-700 rounded-lg p-2"
            items={link.links.map((item, index) => ({
              key: `explore-${index}`,
              label: (
                <Link
                  to={item.path}
                  onClick={() => dispatch(setProgress(100))}
                  className="text-richblack-25 hover:text-yellow-50 transition-all duration-200"
                >
                  <div className="py-2">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-richblack-300">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ),
            }))}
          />
        );

        return (
          <Dropdown
            key="explore"
            overlay={exploreMenu}
            placement="bottomLeft"
            overlayClassName="custom-dropdown"
          >
            <a
              className={`px-4 py-2 text-base ${
                activeMenu === "Explore"
                  ? "text-yellow-50"
                  : "text-richblack-25"
              } hover:text-yellow-50 transition-all duration-200`}
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                {link.title}
                <DownOutlined style={{ fontSize: "12px" }} />
              </Space>
            </a>
          </Dropdown>
        );
      } else {
        // Regular menu item
        return (
          <Link
            key={link.title}
            to={link.path}
            onClick={() => dispatch(setProgress(100))}
            className={`px-4 py-2 text-base ${
              activeMenu === link.title ? "text-yellow-50" : "text-richblack-25"
            } hover:text-yellow-50 transition-all duration-200`}
          >
            {link.title}
          </Link>
        );
      }
    });
  };

  // Generate menu items for mobile
  const getMobileMenuItems = () => {
    return (
      <Menu
        mode="vertical"
        className="bg-richblack-900 border-none"
        style={{ color: "white" }}
        items={[
          {
            key: "home",
            icon: <HomeOutlined />,
            label: (
              <Link
                to="/"
                onClick={() => {
                  dispatch(setProgress(100));
                  closeMobileMenu();
                }}
              >
                Home
              </Link>
            ),
          },
          {
            key: "catalog",
            icon: <BookOutlined />,
            label: "Catalog",
            children: sublinks.map((item, index) => ({
              key: `catalog-${index}`,
              label: (
                <Link
                  to={`/catalog/${item.name}`}
                  onClick={() => {
                    dispatch(setProgress(30));
                    closeMobileMenu();
                  }}
                >
                  {item.name}
                </Link>
              ),
            })),
          },
          {
            key: "explore",
            icon: <CodeOutlined />,
            label: "Explore",
            children: NavbarLinks.find(
              (item) => item.title === "Explore"
            )?.links.map((item, index) => ({
              key: `explore-${index}`,
              label: (
                <Link
                  to={item.path}
                  onClick={() => {
                    dispatch(setProgress(100));
                    closeMobileMenu();
                  }}
                >
                  <div>
                    <div>{item.title}</div>
                    <div className="text-xs text-richblack-300">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ),
            })),
          },
          {
            key: "about",
            icon: <TeamOutlined />,
            label: (
              <Link
                to="/about"
                onClick={() => {
                  dispatch(setProgress(100));
                  closeMobileMenu();
                }}
              >
                About Us
              </Link>
            ),
          },
          {
            key: "contact",
            icon: <PhoneOutlined />,
            label: (
              <Link
                to="/contact"
                onClick={() => {
                  dispatch(setProgress(100));
                  closeMobileMenu();
                }}
              >
                Contact Us
              </Link>
            ),
          },
        ]}
      />
    );
  };

  return (
    <Layout className="layout">
      <Header className="fixed top-0 left-0 w-full z-50 bg-richblack-900 px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={() => dispatch(setProgress(100))}>
            <ChitkaraLogoFull className="h-8 md:h-10 w-auto" theme="light" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {getDesktopMenuItems()}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:block">
          <Search
            placeholder="Search courses..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            className="custom-search-input"
            style={{ width: 200 }}
          />
        </div>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Cart Icon */}
          {user && user?.accountType !== "Instructor" && (
            <Badge count={totalItems} showZero={false} color="#FFD60A">
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
                className="text-richblack-25 hover:text-yellow-50 transition-all duration-200"
              >
                <ShoppingCartOutlined style={{ fontSize: "24px" }} />
              </Link>
            </Badge>
          )}

          {/* Become Instructor Button */}
          {user && user?.accountType !== "Instructor" && (
            <Link
              to="/become-an-instructor"
              onClick={() => dispatch(setProgress(100))}
            >
              <Button
                type="default"
                className="bg-richblack-800 text-richblack-100 border-richblack-700 hover:bg-yellow-50 hover:text-richblack-900 hover:border-yellow-50 transition-all duration-200"
              >
                Become an Instructor
              </Button>
            </Link>
          )}

          {/* Auth Buttons or Profile */}
          {token === null ? (
            <Space>
              <Link to="/login" onClick={() => dispatch(setProgress(100))}>
                <Button
                  type="default"
                  className="bg-richblack-800 text-richblack-100 border-richblack-700"
                >
                  Log in
                </Button>
              </Link>
              <Link to="/signup" onClick={() => dispatch(setProgress(100))}>
                <Button
                  type="primary"
                  className="bg-yellow-50 text-richblack-900 border-yellow-50 hover:bg-yellow-25"
                >
                  Sign up
                </Button>
              </Link>
            </Space>
          ) : (
            <div className="flex items-center">
              <ProfileDropDown />
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center space-x-4">
          {/* Cart Icon - Mobile */}
          {user && user?.accountType !== "Instructor" && (
            <Badge count={totalItems} showZero={false} color="#FFD60A">
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
                className="text-richblack-25"
              >
                <ShoppingCartOutlined style={{ fontSize: "24px" }} />
              </Link>
            </Badge>
          )}

          {/* Menu Button - Mobile */}
          <Button
            type="text"
            icon={
              <MenuOutlined style={{ fontSize: "20px", color: "#F1F2FF" }} />
            }
            onClick={toggleMobileMenu}
            className="flex items-center justify-center"
          />
        </div>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <ChitkaraLogoFull className="h-8 w-auto" theme="light" />
            {token === null ? (
              <Space>
                <Link
                  to="/login"
                  onClick={() => {
                    dispatch(setProgress(100));
                    closeMobileMenu();
                  }}
                >
                  <Button
                    size="small"
                    type="default"
                    className="bg-richblack-800 text-richblack-100 border-richblack-700"
                  >
                    Log in
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => {
                    dispatch(setProgress(100));
                    closeMobileMenu();
                  }}
                >
                  <Button
                    size="small"
                    type="primary"
                    className="bg-yellow-50 text-richblack-900 border-yellow-50"
                  >
                    Sign up
                  </Button>
                </Link>
              </Space>
            ) : (
              <div onClick={closeMobileMenu}>
                <ProfileDropDown />
              </div>
            )}
          </div>
        }
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        width={300}
        className="mobile-drawer"
        bodyStyle={{ padding: 0, backgroundColor: "#000814" }}
        headerStyle={{ backgroundColor: "#000814", borderBottom: "1px solid #2C333F" }}
      >
        {/* Search Bar - Mobile */}
        <div className="p-4">
          <Search
            placeholder="Search courses..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            className="custom-search-input-mobile"
          />
        </div>

        {/* Mobile Menu */}
        {getMobileMenuItems()}

        {/* Become Instructor Button - Mobile */}
        {user && user?.accountType !== "Instructor" && (
          <div className="p-4">
            <Link
              to="/become-an-instructor"
              onClick={() => {
                dispatch(setProgress(100));
                closeMobileMenu();
              }}
              className="block"
            >
              <Button
                type="primary"
                block
                className="bg-yellow-50 text-richblack-900 border-yellow-50"
              >
                Become an Instructor
              </Button>
            </Link>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};

export default AntNavBar;
