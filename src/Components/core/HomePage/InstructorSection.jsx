import React from "react";
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from "./HighlightText";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProgress } from "../../../slices/loadingBarSlice";

const InstructorSection = () => {
  const dispatch = useDispatch();

  return (
    <div className="mt-16">
      <div className="flex flex-col md:flex-row gap-20 items-center">
        <div className="w-full md:w-[50%]">
          <img
            src={Instructor}
            alt="Instructor teaching students"
            className="shadow-white shadow-[-1.3rem_-1rem_0_0] w-full"
          />
        </div>

        <div className="w-full md:w-[50%] flex flex-col gap-10">
          <div className="text-4xl font-semibold">
            Become an
            <HighlightText text={"Instructor"} />
          </div>

          <p className="font-medium text-[16px] w-full md:w-[80%] text-richblack-300">
            Instructors from around the world teach millions of students on
            Chitkara. We provide the tools and skills to teach what you love.
          </p>

          <p className="font-medium text-[16px] w-full md:w-[80%] text-richblack-300">
            Join our community of expert instructors and help students around
            the world achieve their goals.
          </p>

          <div className="w-fit">
            <Link
              onClick={() => {
                dispatch(setProgress(100));
              }}
              to={"/become-an-instructor"}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-3 bg-yellow-50 transition-all duration-[0.4s] ease-out group-hover:w-full"></div>
              <div className="relative group p-2 rounded-lg bg-yellow-50 font-bold transition-all duration-200 hover:scale-105 w-fit shadow-lg shadow-richblack-500/20">
                <div className="flex flex-row items-center gap-3 rounded-lg px-10 py-3 transition-all duration-200 bg-richblack-900 group-hover:bg-transparent">
                  <p className="text-yellow-50 group-hover:text-richblack-900 transition-colors duration-200 text-lg">
                    Become an Instructor
                  </p>
                  <FaArrowRight className="text-yellow-50 group-hover:text-richblack-900 transition-colors duration-200" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorSection;
