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
  Divider,
  Typography,
  Tooltip,
  ConfigProvider,
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
  LoginOutlined,
  UserAddOutlined,
  DashboardOutlined,
} from "@ant-design/icons";

// Components
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { ChitkaraLogoFull } from "../../assets/Logo/ChitkaraLogo";

// Data and Services
import { NavbarLinks } from "../../data/navbar-links";
import { categories } from "../../services/apis";
import { apiConnector } from "../../services/apiConnector";

// Styles
import "./AestheticNavBar.css";

const { Header } = Layout;
const { Search } = Input;
const { Text } = Typography;

const AestheticNavBar = () => {
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
  const [hoveredMenu, setHoveredMenu] = useState(null);

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
        return <CodeOutlined className="menu-icon code-icon" />;
      case "path":
        return <ReadOutlined className="menu-icon path-icon" />;
      case "ai":
        return <RobotOutlined className="menu-icon ai-icon" />;
      case "game":
        return <LayoutOutlined className="menu-icon game-icon" />;
      default:
        return <AppstoreOutlined className="menu-icon" />;
    }
  };

  // Generate catalog dropdown menu
  const getCatalogMenu = () => (
    <Menu
      className="aesthetic-dropdown-menu"
      onClick={(e) => e.stopPropagation()}
    >
      {sublinks.map((item, index) => (
        <Menu.Item
          key={`catalog-${index}`}
          className="dropdown-item"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            to={`/catalog/${item.name}`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setProgress(100));
              // Keep the menu open for a moment to ensure the click registers
              setTimeout(() => {
                setHoveredMenu(null);
              }, 500); // Increased from 300ms to 500ms
            }}
            className="dropdown-link"
          >
            <div className="dropdown-icon-container">
              <BookOutlined className="menu-icon" />
            </div>
            <span className="dropdown-text">{item.name}</span>
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  // Generate explore dropdown menu
  const getExploreMenu = (links) => (
    <Menu
      className="aesthetic-dropdown-menu explore-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      {links.map((item, index) => {
        const IconComponent = getIconComponent(item.icon);
        return (
          <Menu.Item
            key={`explore-${index}`}
            className="dropdown-item explore-item"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to={item.path}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(setProgress(100));
                // Keep the menu open for a moment to ensure the click registers
                setTimeout(() => {
                  setHoveredMenu(null);
                }, 500); // Increased from 300ms to 500ms
              }}
              className="dropdown-link"
            >
              <div className="explore-content">
                <div className="dropdown-icon-container explore-icon">
                  {IconComponent}
                </div>
                <div className="explore-text">
                  <div className="dropdown-title">{item.title}</div>
                  <div className="dropdown-description">{item.description}</div>
                </div>
              </div>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  // Generate mobile menu items
  const getMobileMenuItems = () => (
    <Menu
      mode="vertical"
      selectedKeys={[activeMenu]}
      className="aesthetic-mobile-menu"
    >
      {NavbarLinks.map((link, index) => {
        if (link.title === "Home") {
          return (
            <Menu.Item key={link.title} icon={<HomeOutlined />}>
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
        } else if (link.title === "Catalog") {
          return (
            <Menu.SubMenu
              key={link.title}
              title={link.title}
              icon={<BookOutlined />}
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
            >
              {link.links.map((item, idx) => {
                const IconComponent = getIconComponent(item.icon);
                return (
                  <Menu.Item
                    key={`explore-${idx}`}
                    icon={React.cloneElement(IconComponent, { className: "" })}
                  >
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
        } else if (link.title === "About Us") {
          return (
            <Menu.Item key={link.title} icon={<InfoCircleOutlined />}>
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
        } else if (link.title === "Contact Us") {
          return (
            <Menu.Item key={link.title} icon={<PhoneOutlined />}>
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
        } else {
          return (
            <Menu.Item key={link.title}>
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

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#FFD60A",
          borderRadius: 8,
        },
        components: {
          Menu: {
            darkItemColor: "#F1F2FF",
            darkItemHoverColor: "#FFD60A",
            darkItemSelectedColor: "#FFD60A",
          },
        },
      }}
    >
      <div className={`aesthetic-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <Link to="/" onClick={() => dispatch(setProgress(100))}>
              <ChitkaraLogoFull className="logo-image" theme="light" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="desktop-nav">
            <ul className="nav-links">
              {NavbarLinks.map((link, index) => {
                if (link.title === "Catalog") {
                  return (
                    <li
                      key={index}
                      className={`nav-item ${
                        activeMenu === link.title ? "active" : ""
                      }`}
                      onMouseEnter={() => setHoveredMenu(link.title)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <Dropdown
                        overlay={getCatalogMenu()}
                        placement="bottomCenter"
                        trigger={["click"]}
                        overlayClassName="aesthetic-dropdown"
                        open={hoveredMenu === link.title}
                        onVisibleChange={(visible) => {
                          if (visible) {
                            setHoveredMenu(link.title);
                          } else {
                            // Increased delay to give users more time to click dropdown items
                            setTimeout(() => {
                              if (hoveredMenu === link.title) {
                                setHoveredMenu(null);
                              }
                            }, 800); // Increased from 200ms to 800ms
                          }
                        }}
                        arrow={{ pointAtCenter: true }}
                      >
                        <span className="nav-link dropdown-trigger">
                          {link.title}
                          <DownOutlined className="dropdown-icon" />
                        </span>
                      </Dropdown>
                    </li>
                  );
                } else if (link.dropdown && link.title === "Explore") {
                  return (
                    <li
                      key={index}
                      className={`nav-item ${
                        activeMenu === link.title ? "active" : ""
                      }`}
                      onMouseEnter={() => setHoveredMenu(link.title)}
                      onMouseLeave={() => setHoveredMenu(null)}
                    >
                      <Dropdown
                        overlay={getExploreMenu(link.links)}
                        placement="bottomCenter"
                        trigger={["click"]}
                        overlayClassName="aesthetic-dropdown"
                        open={hoveredMenu === link.title}
                        onVisibleChange={(visible) => {
                          if (visible) {
                            setHoveredMenu(link.title);
                          } else {
                            // Increased delay to give users more time to click dropdown items
                            setTimeout(() => {
                              if (hoveredMenu === link.title) {
                                setHoveredMenu(null);
                              }
                            }, 800); // Increased from 200ms to 800ms
                          }
                        }}
                        arrow={{ pointAtCenter: true }}
                      >
                        <span className="nav-link dropdown-trigger">
                          {link.title}
                          <DownOutlined className="dropdown-icon" />
                        </span>
                      </Dropdown>
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={index}
                      className={`nav-item ${
                        activeMenu === link.title ? "active" : ""
                      }`}
                    >
                      <Link
                        to={link.path}
                        className="nav-link"
                        onClick={() => dispatch(setProgress(100))}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                }
              })}
            </ul>
          </div>

          {/* Desktop Right Section */}
          <div className="navbar-right">
            {/* Search Button */}
            <Tooltip title="Search">
              <Button
                type="text"
                icon={<SearchOutlined className="action-icon" />}
                onClick={() => setSearchVisible(!searchVisible)}
                className="action-button"
              />
            </Tooltip>

            {/* Cart Icon (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                onClick={() => dispatch(setProgress(100))}
                className="cart-link"
              >
                <Badge count={totalItems} showZero={false} color="#FFD60A">
                  <Button
                    type="text"
                    icon={<ShoppingCartOutlined className="action-icon" />}
                    className="action-button"
                  />
                </Badge>
              </Link>
            )}

            {/* Become Instructor Button (for Students) */}
            {user && user?.accountType !== "Instructor" && (
              <Link
                to="/become-an-instructor"
                onClick={() => dispatch(setProgress(100))}
                className="instructor-link desktop-only"
              >
                <Button type="default" className="instructor-button">
                  Become an Instructor
                </Button>
              </Link>
            )}

            {/* Auth Buttons or Profile */}
            {token === null ? (
              <Space className="auth-buttons">
                <Link to="/login" onClick={() => dispatch(setProgress(100))}>
                  <Button
                    type="text"
                    icon={<LoginOutlined />}
                    className="login-button desktop-only"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => dispatch(setProgress(100))}>
                  <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    className="signup-button"
                  >
                    Sign up
                  </Button>
                </Link>
              </Space>
            ) : (
              <div className="profile-container">
                <ProfileDropDown />
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              type="text"
              icon={<MenuOutlined className="menu-trigger-icon" />}
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-menu-button"
            />
          </div>

          {/* Search Overlay (Conditional) */}
          {searchVisible && (
            <div className="search-overlay">
              <div className="search-container">
                <Search
                  placeholder="Search courses..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={handleSearch}
                  enterButton
                  className="search-input"
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  onClick={() => setSearchVisible(false)}
                  className="close-search"
                />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="drawer-header">
              <ChitkaraLogoFull className="drawer-logo" theme="light" />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setMobileMenuOpen(false)}
                className="drawer-close"
              />
            </div>
          }
          placement="right"
          closable={false}
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          width={300}
          className="mobile-drawer"
          bodyStyle={{ padding: 0 }}
        >
          {/* User Profile Section - Mobile */}
          {token !== null && (
            <div className="drawer-profile">
              <Avatar
                src={user?.image}
                icon={<UserOutlined />}
                size={48}
                className="profile-avatar"
              />
              <div className="profile-info">
                <div className="profile-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="profile-email">{user?.email}</div>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="drawer-menu">{getMobileMenuItems()}</div>

          {/* Mobile Search */}
          <div className="drawer-search">
            <Search
              placeholder="Search courses..."
              onSearch={handleSearch}
              enterButton
              className="mobile-search-input"
            />
          </div>

          {/* Auth Buttons - Mobile */}
          {token === null && (
            <div className="drawer-auth">
              <Link
                to="/login"
                onClick={() => {
                  dispatch(setProgress(100));
                  setMobileMenuOpen(false);
                }}
                className="drawer-auth-link"
              >
                <Button
                  type="default"
                  block
                  icon={<LoginOutlined />}
                  className="drawer-login"
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
                className="drawer-auth-link"
              >
                <Button
                  type="primary"
                  block
                  icon={<UserAddOutlined />}
                  className="drawer-signup"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Become Instructor Button - Mobile */}
          {user && user?.accountType !== "Instructor" && (
            <div className="drawer-instructor">
              <Link
                to="/become-an-instructor"
                onClick={() => {
                  dispatch(setProgress(100));
                  setMobileMenuOpen(false);
                }}
                className="drawer-instructor-link"
              >
                <Button
                  type="primary"
                  block
                  className="drawer-instructor-button"
                >
                  Become an Instructor
                </Button>
              </Link>
            </div>
          )}

          {/* Dashboard Button - Mobile */}
          {token !== null && (
            <div className="drawer-dashboard">
              <Link
                to="/dashboard/my-profile"
                onClick={() => {
                  dispatch(setProgress(100));
                  setMobileMenuOpen(false);
                }}
                className="drawer-dashboard-link"
              >
                <Button
                  type="default"
                  block
                  icon={<DashboardOutlined />}
                  className="drawer-dashboard-button"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default AestheticNavBar;
