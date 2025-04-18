import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaChalkboardTeacher } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setProgress } from "../../slices/loadingBarSlice";

const InstructorModal = ({ setShowModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProceed = () => {
    dispatch(setProgress(30));
    navigate("/signup?role=instructor");
    setShowModal(false);
  };

  const benefits = [
    "Share your knowledge and expertise with students worldwide",
    "Create engaging courses with our easy-to-use platform",
    "Earn revenue from course sales",
    "Join a community of passionate educators",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative bg-richblack-800 rounded-lg w-11/12 max-w-2xl p-6 shadow-xl animate-fadeIn">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-richblack-300 hover:text-white transition-colors duration-200"
        >
          <FaTimes size={24} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="bg-yellow-50 p-3 rounded-full mb-4">
            <FaChalkboardTeacher size={32} className="text-richblack-900" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Become an Instructor
          </h2>
          <p className="text-richblack-300 text-center">
            Join our community of educators and share your knowledge with students around the world.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-50 mb-3">
            As an instructor, you'll be able to:
          </h3>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-50 mr-2">•</span>
                <span className="text-richblack-100">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-richblack-700 p-4 rounded-md mb-6">
          <p className="text-richblack-100 text-sm">
            <span className="text-yellow-50 font-semibold">Note:</span> You'll need to create an instructor account to start creating courses. This will give you access to our course creation tools and instructor dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={handleCloseModal}
            className="px-6 py-3 rounded-md bg-richblack-700 text-richblack-100 hover:bg-richblack-600 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            className="px-6 py-3 rounded-md bg-yellow-50 text-richblack-900 font-semibold hover:scale-105 transition-all duration-200"
          >
            Proceed to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorModal;
