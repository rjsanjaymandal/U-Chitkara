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
  Badge,
  Avatar,
  Affix,
  Tooltip,
  Divider,
} from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DownOutlined,
  CloseOutlined,
  CodeOutlined,
  ReadOutlined,
  RobotOutlined,
  LayoutOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  BookOutlined,
  AppstoreOutlined,
  CodeSandboxOutlined,
} from "@ant-design/icons";

// Components
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { ChitkaraLogoFull } from "../../assets/Logo/ChitkaraLogo";

// Data and Services
import { NavbarLinks } from "../../data/navbar-links";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

const { Header } = Layout;
const { Search } = Input;

const ModernNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);

  // Local state
  const [sublinks, setSublinks] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");

  // Fetch category sublinks
  const fetchSublinks = async () => {
    try {
      const res = await apiConnector("GET", categories.CATEGORIES_API);
      setSublinks(res.data.data);
    } catch (error) {
      console.log("Could not fetch categories.", error);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search/${searchValue}`);
      setSearchValue("");
      setSearchVisible(false);
    }
  };

  // Check if route matches
  const matchRoutes = (route) => {
    if (route === undefined) return false;
    return matchPath({ path: route }, location.pathname);
  };

  // Set active menu based on current route
  useEffect(() => {
    NavbarLinks.forEach((link) => {
      if (matchRoutes(link.path)) {
        setActiveMenu(link.title);
      } else if (link.dropdown && link.links) {
        link.links.forEach((subLink) => {
          if (matchRoutes(subLink.path)) {
            setActiveMenu(link.title);
          }
        });
      }
    });
  }, [location.pathname]);

  // Fetch sublinks on component mount
  useEffect(() => {
    fetchSublinks();
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "code":
        return CodeOutlined;
      case "path":
        return ReadOutlined;
      case "ai":
        return RobotOutlined;
      case "leetcode":
        return CodeSandboxOutlined;
      case "game":
        return LayoutOutlined;
      default:
        return AppstoreOutlined;
    }
  };

  // Generate menu items for desktop
  const getDesktopMenuItems = () => {
    return (
      <Menu
        mode="horizontal"
        selectedKeys={[activeMenu]}
        className="border-none bg-transparent text-richblack-25"
        style={{ color: "#F1F2FF" }}
        theme="dark"
      >
        {NavbarLinks.map((link) => {
          if (link.title === "Catalog") {
            // Catalog dropdown items
            const catalogMenuItems = sublinks.map((item, index) => ({
              key: `catalog-${index}`,
              label: (
                <Link
                  to={`/catalog/${item.name}`}
                  onClick={() => dispatch(setProgress(30))}
                  className="text-richblack-25 hover:text-yellow-50"
                >
                  {item.name}
                </Link>
              ),
            }));

            return (
              <Menu.Item key={link.title}>
                <Dropdown
                  menu={{
                    items: catalogMenuItems,
                    className: "bg-richblack-800 border border-richblack-700",
                    style: { minWidth: "200px" },
                  }}
                  placement="bottom"
                  overlayClassName="custom-dropdown"
                >
                  <span className="flex items-center cursor-pointer text-richblack-25">
                    {link.title}{" "}
                    <DownOutlined
                      style={{ fontSize: "12px", marginLeft: "5px" }}
                    />
                  </span>
                </Dropdown>
              </Menu.Item>
            );
          } else if (link.dropdown && link.title === "Explore") {
            // Explore dropdown items
            const exploreMenuItems = link.links.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              return {
                key: `explore-${index}`,
                className: "py-2",
                label: (
                  <Link
                    to={item.path}
                    onClick={() => dispatch(setProgress(100))}
                    className="flex items-start gap-3"
                  >
                    <div className="text-yellow-50 mt-1">
                      <IconComponent style={{ fontSize: "16px" }} />
                    </div>
                    <div>
                      <div className="font-medium text-richblack-5">
                        {item.title}
                      </div>
                      <div className="text-xs text-richblack-300">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ),
              };
            });

            return (
              <Menu.Item key={link.title}>
                <Dropdown
                  menu={{
                    items: exploreMenuItems,
                    className: "bg-richblack-800 border border-richblack-700",
                    style: { minWidth: "250px" },
                  }}
                  placement="bottom"
                  overlayClassName="custom-dropdown"
                >
                  <span className="flex items-center cursor-pointer text-richblack-25">
                    {link.title}{" "}
                    <DownOutlined
                      style={{ fontSize: "12px", marginLeft: "5px" }}
                    />
                  </span>
                </Dropdown>
              </Menu.Item>
            );
          } else {
            // Regular menu item
            return (
              <Menu.Item key={link.title}>
                <Link
                  to={link.path}
                  onClick={() => dispatch(setProgress(100))}
                  className="text-richblack-25 hover:text-yellow-50"
                >
                  {link.title}
                </Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  // Generate menu items for mobile
  const getMobileMenuItems = () => {
    return (
      <Menu
        mode="vertical"
        selectedKeys={[activeMenu]}
        className="border-none bg-transparent"
        style={{ color: "#F1F2FF" }}
      >
        {NavbarLinks.map((link, index) => {
          if (link.title === "Catalog") {
            return (
              <Menu.SubMenu
                key={link.title}
                title={link.title}
                icon={<BookOutlined />}
                className="bg-richblack-800"
              >
                {sublinks.map((item, idx) => (
                  <Menu.Item key={`catalog-${idx}`}>
                    <Link
                      to={`/catalog/${item.name}`}
                      onClick={() => {
                        dispatch(setProgress(30));
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.name}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            );
          } else if (link.dropdown && link.title === "Explore") {
            return (
              <Menu.SubMenu
                key={link.title}
                title={link.title}
                icon={<AppstoreOutlined />}
                className="bg-richblack-800"
              >
                {link.links.map((item, idx) => {
                  const IconComponent = getIconComponent(item.icon);
                  return (
                    <Menu.Item key={`explore-${idx}`} icon={<IconComponent />}>
                      <Link
                        to={item.path}
                        onClick={() => {
                          dispatch(setProgress(100));
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.title}
                      </Link>
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            const getIcon = () => {
              switch (link.title) {
                case "Home":
                  return <HomeOutlined />;
                case "About Us":
                  return <InfoCircleOutlined />;
                case "Contact Us":
                  return <PhoneOutlined />;
                default:
                  return null;
              }
            };

            return (
              <Menu.Item key={link.title} icon={getIcon()}>
                <Link
                  to={link.path}
                  onClick={() => {
                    dispatch(setProgress(100));
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.title}
                </Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
  };

  return (
    <Affix offsetTop={0}>
      <Header
        className={`px-4 md:px-8 h-16 transition-all duration-300 ${
          isScrolled
            ? "bg-richblack-900 bg-opacity-90 backdrop-blur-sm shadow-md"
            : "bg-richblack-900"
        }`}
        style={{ padding: 0 }}
      >
        <div className="max-w-maxContent mx-auto h-full flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" onClick={() => dispatch(setProgress(100))}>
              <ChitkaraLogoFull className="h-8 md:h-10 w-auto" theme="light" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            {getDesktopMenuItems()}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Button */}
            <Tooltip title="Search">
              <Button
                type="text"
                icon={<SearchOutlined style={{ color: "#F1F2FF" }} />}
                onClick={() => setSearchVisible(!searchVisible)}
                className="flex items-center justify-center"
              />
            </Tooltip>

            {/* Search Input (Conditional) */}
            {searchVisible && (
              <div className="absolute top-16 right-0 p-4 bg-richblack-800 border border-richblack-700 rounded-md shadow-lg z-50 w-80">
                <Search
                  placeholder="Search courses..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={handleSearch}
                  enterButton
                  className="custom-search-input"
                />
              </div>
            )}

            {/* Cart Icon (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
              >
                <Badge count={totalItems} showZero={false} color="#FFD60A">
                  <Button
                    type="text"
                    icon={
                      <ShoppingCartOutlined
                        style={{ color: "#F1F2FF", fontSize: "20px" }}
                      />
                    }
                    className="flex items-center justify-center"
                  />
                </Badge>
              </Link>
            )}

            {/* Become Instructor Button (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/become-an-instructor"
                onClick={() => dispatch(setProgress(100))}
              >
                <Button
                  type="default"
                  className="bg-richblack-800 text-richblack-100 border-richblack-700"
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
          <div className="flex lg:hidden items-center space-x-3">
            {/* Search Button - Mobile */}
            <Button
              type="text"
              icon={
                <SearchOutlined
                  style={{ color: "#F1F2FF", fontSize: "18px" }}
                />
              }
              onClick={() => setSearchVisible(!searchVisible)}
              className="flex items-center justify-center"
            />

            {/* Cart Icon - Mobile */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
              >
                <Badge count={totalItems} showZero={false} color="#FFD60A">
                  <Button
                    type="text"
                    icon={
                      <ShoppingCartOutlined
                        style={{ color: "#F1F2FF", fontSize: "18px" }}
                      />
                    }
                    className="flex items-center justify-center"
                  />
                </Badge>
              </Link>
            )}

            {/* Menu Button - Mobile */}
            <Button
              type="text"
              icon={
                <MenuOutlined style={{ color: "#F1F2FF", fontSize: "18px" }} />
              }
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center"
            />
          </div>

          {/* Mobile Search (Conditional) */}
          {searchVisible && (
            <div className="lg:hidden absolute top-16 left-0 right-0 p-4 bg-richblack-800 border-t border-richblack-700 z-50">
              <Search
                placeholder="Search courses..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onSearch={handleSearch}
                enterButton
                className="custom-search-input"
              />
            </div>
          )}
        </div>
      </Header>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <ChitkaraLogoFull className="h-8 w-auto" theme="light" />
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setMobileMenuOpen(false)}
              className="border-none"
            />
          </div>
        }
        placement="right"
        closable={false}
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        className="custom-drawer"
        styles={{
          body: { padding: 0, backgroundColor: "#000814" },
          header: {
            backgroundColor: "#000814",
            borderBottom: "1px solid #2C333F",
          },
        }}
      >
        {/* User Profile Section - Mobile */}
        {token !== null && (
          <div className="p-4 flex items-center space-x-3 border-b border-richblack-700">
            <Avatar src={user?.image} icon={<UserOutlined />} size={40} />
            <div>
              <div className="text-richblack-5 font-medium">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-richblack-300">{user?.email}</div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className="py-2">{getMobileMenuItems()}</div>

        {/* Auth Buttons - Mobile */}
        {token === null && (
          <div className="p-4 border-t border-richblack-700 space-y-3">
            <Link
              to="/login"
              onClick={() => {
                dispatch(setProgress(100));
                setMobileMenuOpen(false);
              }}
            >
              <Button
                type="default"
                block
                className="bg-richblack-800 text-richblack-100 border-richblack-700"
              >
                Log in
              </Button>
            </Link>
            <Link
              to="/signup"
              onClick={() => {
                dispatch(setProgress(100));
                setMobileMenuOpen(false);
              }}
            >
              <Button
                type="primary"
                block
                className="bg-yellow-50 text-richblack-900 border-yellow-50"
              >
                Sign up
              </Button>
            </Link>
          </div>
        )}

        {/* Become Instructor Button - Mobile */}
        {user && user?.accountType !== "Instructor" && (
          <div className="p-4 border-t border-richblack-700">
            <Link
              to="/become-an-instructor"
              onClick={() => {
                dispatch(setProgress(100));
                setMobileMenuOpen(false);
              }}
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

        {/* Logout Button - Mobile */}
        {token !== null && (
          <div className="p-4 border-t border-richblack-700">
            <Link
              to="/dashboard/my-profile"
              onClick={() => {
                dispatch(setProgress(100));
                setMobileMenuOpen(false);
              }}
            >
              <Button
                type="default"
                block
                className="bg-richblack-800 text-richblack-100 border-richblack-700 mb-3"
                icon={<UserOutlined />}
              >
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </Drawer>
    </Affix>
  );
};

export default ModernNavBar;
