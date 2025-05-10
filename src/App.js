import "./App.css";
import "./styles/dropdown-fix.css";
import "./styles/modern-navbar.css";
import "./styles/layout-fix.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./Components/common/NavBar";
import ModernNavBar from "./Components/common/ModernNavBar";
import AestheticNavBar from "./Components/common/AestheticNavBar";
import Footer from "./Components/common/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import LoadingBar from "react-top-loading-bar";
import { setProgress } from "./slices/loadingBarSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./Components/core/Auth/OpenRoute";
import PrivateRoute from "./Components/core/Auth/PrivateRoute";
import MyProfile from "./Components/core/Dashboard/MyProfile";
import Setting from "./Components/core/Dashboard/Settings";
import EnrollledCourses from "./Components/core/Dashboard/EnrolledCourses";
import Cart from "./Components/core/Dashboard/Cart/index";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./Components/core/Dashboard/AddCourse/index";
import MyCourses from "./Components/core/Dashboard/MyCourses/MyCourses";
import EditCourse from "./Components/core/Dashboard/EditCourse.jsx/EditCourse";
import Catalog from "./pages/Catalog";
import ScrollToTop from "./Components/ScrollToTop";
import CourseDetails from "./pages/CourseDetails";
import SearchCourse from "./pages/SearchCourse";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./Components/core/ViewCourse/VideoDetails";
import PurchaseHistory from "./Components/core/Dashboard/PurchaseHistory";
import InstructorDashboard from "./Components/core/Dashboard/InstructorDashboard/InstructorDashboard";
import BulkCourseCreator from "./Components/core/Dashboard/AddCourse/BulkCourseCreator";
import { RiWifiOffLine } from "react-icons/ri";
import AdminPannel from "./Components/core/Dashboard/AdminPannel";
import ManageStudents from "./Components/core/Dashboard/ManageStudents/ManageStudents";
import LearningPaths from "./pages/LearningPaths";
import LearningPathDetails from "./pages/LearningPathDetails";
import CodePlayground from "./pages/CodePlayground";
import BecomeAnInstructor from "./pages/BecomeAnInstructor";
import AIChat from "./pages/AIChat";
import LeetCodeRedesigned from "./pages/LeetCodeRedesigned";
import LeetCodeProblems from "./pages/LeetCodeProblems";
import LeetCodeProblem from "./pages/LeetCodeProblem";
import LeetCodeConnect from "./pages/LeetCodeConnect";

import FruitBoxFlex from "./pages/FruitBoxFlex";
import useOnlineStatus from "./hooks/useOnlineStatus";

function App() {
  // Only disable console logs in production
  if (process.env.NODE_ENV === "production") {
    // Preserve error and warning logs even in production
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    console.log = function () {};
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
  }

  const user = useSelector((state) => state.profile.user);
  const progress = useSelector((state) => state.loadingBar);
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus(); // Use our custom hook for better offline detection
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <LoadingBar
        color="#FFD60A"
        height={1.4}
        progress={progress}
        onLoaderFinished={() => dispatch(setProgress(0))}
      />
      <AestheticNavBar />
      <div className="main-content-wrapper">
        {!isOnline && (
          <div className="bg-red-500 flex text-white text-center p-2 bg-richblack-300 justify-center gap-2 items-center shadow-md fixed bottom-0 left-0 right-0 z-50 animate-pulse">
            <RiWifiOffLine size={22} aria-hidden="true" />
            <span>Please check your internet connection.</span>
            <button
              className="ml-2 bg-richblack-500 rounded-md p-1 px-2 text-white hover:bg-richblack-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-50"
              onClick={() => window.location.reload()}
              aria-label="Retry connection"
            >
              Retry
            </button>
          </div>
        )}
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalog/:catalog" element={<Catalog />} />

          <Route
            path="/login"
            element={
              <OpenRoute>
                <Login />
              </OpenRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <OpenRoute>
                <Signup />
              </OpenRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/update-password/:id" element={<ResetPassword />} />

          <Route path="/verify-email" element={<VerifyOtp />} />

          <Route path="/about" element={<About />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/courses/:courseId" element={<CourseDetails />} />

          <Route path="/search/:searchQuery" element={<SearchCourse />} />

          <Route path="/learning-paths" element={<LearningPaths />} />

          <Route
            path="/learning-path/:pathId"
            element={<LearningPathDetails />}
          />

          <Route path="/code-playground" element={<CodePlayground />} />

          <Route path="/ai-chat" element={<AIChat />} />

          <Route path="/leetcode" element={<LeetCodeRedesigned />} />
          <Route path="/leetcode/problems" element={<LeetCodeProblems />} />
          <Route path="/leetcode/problem/:id" element={<LeetCodeProblem />} />
          <Route path="/leetcode/connect" element={<LeetCodeConnect />} />

          <Route path="/fruitbox-flex" element={<FruitBoxFlex />} />

          <Route
            path="/become-an-instructor"
            element={<BecomeAnInstructor />}
          />

          <Route
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route path="dashboard/my-profile" element={<MyProfile />} />
            <Route path="dashboard/settings" element={<Setting />} />
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/cart" element={<Cart />} />
                <Route
                  path="dashboard/enrolled-courses"
                  element={<EnrollledCourses />}
                />
                <Route
                  path="dashboard/purchase-history"
                  element={<PurchaseHistory />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route
                  path="dashboard/edit-course/:courseId"
                  element={<EditCourse />}
                />
                <Route
                  path="dashboard/instructor"
                  element={<InstructorDashboard />}
                />
                <Route
                  path="dashboard/manage-students"
                  element={<ManageStudents />}
                />
                <Route
                  path="dashboard/bulk-course-creator"
                  element={<BulkCourseCreator />}
                />
              </>
            )}
            {user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
                <Route path="dashboard/admin-panel" element={<AdminPannel />} />
              </>
            )}
          </Route>

          <Route
            element={
              <PrivateRoute>
                <ViewCourse />
              </PrivateRoute>
            }
          >
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route
                  path="/dashboard/enrolled-courses/view-course/:courseId/section/:sectionId/sub-section/:subsectionId"
                  element={<VideoDetails />}
                />
              </>
            )}
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
