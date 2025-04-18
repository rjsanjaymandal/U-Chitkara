import React from "react";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaUsers,
  FaLaptopCode,
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../slices/loadingBarSlice";
import HighlightText from "../Components/core/HomePage/HighlightText";
import InstructorModal from "../Components/core/InstructorModal";
import { useState } from "react";

const BecomeAnInstructor = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [showModal, setShowModal] = useState(false);

  const benefits = [
    {
      icon: <FaMoneyBillWave size={36} className="text-yellow-50" />,
      title: "Earn Revenue",
      description:
        "Earn money every time a student purchases your course. Our platform handles payments and provides you with a comprehensive dashboard to track your earnings.",
    },
    {
      icon: <FaUsers size={36} className="text-yellow-50" />,
      title: "Reach Millions",
      description:
        "Share your knowledge with our global community of learners. Our platform helps you connect with students who are eager to learn what you have to teach.",
    },
    {
      icon: <FaLaptopCode size={36} className="text-yellow-50" />,
      title: "Teach Your Way",
      description:
        "Create courses using our intuitive course builder. Upload videos, add quizzes, and organize your content to provide the best learning experience for your students.",
    },
    {
      icon: <FaGraduationCap size={36} className="text-yellow-50" />,
      title: "Make an Impact",
      description:
        "Help others achieve their goals through your expertise. Your courses can change lives and provide valuable skills to students around the world.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Apply to become an instructor",
      description:
        "Fill out a simple application to tell us about your experience and expertise.",
    },
    {
      number: "02",
      title: "Create your first course",
      description:
        "Use our comprehensive tools and resources to plan and create engaging content.",
    },
    {
      number: "03",
      title: "Launch and promote",
      description:
        "Publish your course and use our platform to reach students worldwide.",
    },
    {
      number: "04",
      title: "Earn and grow",
      description:
        "Get paid for your work and continue to expand your course offerings.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Web Development Instructor",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote:
        "Teaching on Chitkara has allowed me to share my passion for web development with thousands of students. The platform is intuitive, and the support team is always there when I need help.",
    },
    {
      name: "Michael Chen",
      role: "Data Science Instructor",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
      quote:
        "I've been able to reach students from over 50 countries with my data science courses. The analytics dashboard helps me understand what's working and how to improve my content.",
    },
    {
      name: "Priya Sharma",
      role: "UX Design Instructor",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote:
        "The course creation tools make it easy to build engaging content. I've seen my students apply what they've learned to launch successful careers in UX design.",
    },
  ];

  const handleInstructorClick = () => {
    if (token && user?.accountType !== "Instructor") {
      setShowModal(true);
    } else {
      dispatch(setProgress(100));
    }
  };

  return (
    <div className="bg-richblack-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-richblack-800 to-richblack-900"></div>
        <div className="relative z-10 w-11/12 max-w-maxContent mx-auto flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Share Your Knowledge, <HighlightText text="Inspire the World" />
              </h1>
              <p className="text-richblack-300 text-lg mb-8 md:pr-10">
                Join our community of expert instructors and help shape the
                future of education. Create engaging courses, reach students
                worldwide, and earn revenue while making a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {token && user?.accountType !== "Instructor" ? (
                  <button
                    onClick={handleInstructorClick}
                    className="bg-yellow-50 text-richblack-900 font-semibold py-3 px-6 rounded-md hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaChalkboardTeacher />
                    Become an Instructor
                  </button>
                ) : (
                  <Link
                    to="/signup?role=instructor"
                    onClick={() => dispatch(setProgress(100))}
                    className="bg-yellow-50 text-richblack-900 font-semibold py-3 px-6 rounded-md hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaChalkboardTeacher />
                    Become an Instructor
                  </Link>
                )}
                <Link
                  to="/about"
                  onClick={() => dispatch(setProgress(100))}
                  className="bg-richblack-800 text-richblack-100 font-semibold py-3 px-6 rounded-md hover:bg-richblack-700 transition-all duration-200"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                alt="Instructor teaching"
                className="rounded-lg shadow-xl w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-richblack-800">
        <div className="w-11/12 max-w-maxContent mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Become an <HighlightText text="Instructor" />
            </h2>
            <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
              Join thousands of instructors who are sharing their knowledge and
              earning income on our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-richblack-700 p-6 rounded-lg hover:bg-richblack-600 transition-all duration-200 hover:scale-105"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-richblack-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="w-11/12 max-w-maxContent mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <HighlightText text="Works" />
            </h2>
            <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
              Our simple process to help you get started as an instructor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 hover:border-yellow-50 transition-all duration-200"
              >
                <div className="text-4xl font-bold text-yellow-50 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-richblack-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-richblack-800">
        <div className="w-11/12 max-w-maxContent mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Instructor <HighlightText text="Success Stories" />
            </h2>
            <p className="text-richblack-300 text-lg max-w-2xl mx-auto">
              Hear from instructors who have transformed their passion into
              successful online courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-richblack-700 p-6 rounded-lg hover:bg-richblack-600 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-yellow-50">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-richblack-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="w-11/12 max-w-maxContent mx-auto bg-richblack-700 rounded-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to <HighlightText text="Start Teaching?" />
              </h2>
              <p className="text-richblack-300 text-lg mb-6 md:pr-10">
                Join our community of instructors today and start sharing your
                knowledge with the world.
              </p>
            </div>
            <div>
              {token && user?.accountType !== "Instructor" ? (
                <button
                  onClick={handleInstructorClick}
                  className="bg-yellow-50 text-richblack-900 font-semibold py-4 px-8 rounded-md hover:scale-105 transition-all duration-200 flex items-center gap-2 text-lg"
                >
                  Get Started <FaArrowRight />
                </button>
              ) : (
                <Link
                  to="/signup?role=instructor"
                  onClick={() => dispatch(setProgress(100))}
                  className="bg-yellow-50 text-richblack-900 font-semibold py-4 px-8 rounded-md hover:scale-105 transition-all duration-200 flex items-center gap-2 text-lg"
                >
                  Get Started <FaArrowRight />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && <InstructorModal setShowModal={setShowModal} />}
    </div>
  );
};

export default BecomeAnInstructor;
