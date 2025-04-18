import React from "react";
import { FiEdit } from "react-icons/fi";

const IconBtn = ({
  text,
  onclick,
  children,
  disabled,
  outline = false,
  customClasses,
  type,
  icon = <FiEdit />,
  ariaLabel,
}) => {
  // Determine button classes based on outline prop and custom classes
  const btnClasses = `flex items-center ${
    outline
      ? "bg-transparent text-yellow-50 border border-yellow-50"
      : "bg-yellow-50 text-richblack-900"
  }
    cursor-pointer gap-x-2 rounded-md py-2 text-sm md:text-lg px-3 md:px-5
    font-semibold transition-all duration-200 hover:scale-95
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${customClasses || ""}`;

  return (
    <button
      className={btnClasses}
      disabled={disabled}
      onClick={onclick}
      type={type || "button"}
      aria-label={ariaLabel || text}
    >
      {children ? (
        <>
          <span>{text}</span>
          {children}
        </>
      ) : (
        text
      )}
      {icon}
    </button>
  );
};

export default IconBtn;
