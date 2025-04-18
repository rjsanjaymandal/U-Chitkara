import React from "react";

export const ChitkaraLogoFull = ({ className, theme = "light" }) => {
  return (
    <div className={`flex items-center ${className || "h-10"}`}>
      <span
        className={`text-2xl font-bold ${
          theme === "light" ? "text-richblack-5" : "text-richblack-900"
        }`}
      >
        U CHIT
      </span>
      <span className="text-2xl font-bold text-yellow-50">KARA</span>
    </div>
  );
};

export const ChitkaraLogoSmall = ({ className, theme = "light" }) => {
  return (
    <div className={`flex items-center ${className || "h-8"}`}>
      <span
        className={`text-xl font-bold ${
          theme === "light" ? "text-richblack-5" : "text-richblack-900"
        }`}
      >
        UC
      </span>
      <span className="text-xl font-bold text-yellow-50">K</span>
    </div>
  );
};

export default ChitkaraLogoFull;
