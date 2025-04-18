import React from "react";
import { motion } from "framer-motion";
import { GiBasket, GiWoodenCrate } from "react-icons/gi";
import { FaShoppingBasket } from "react-icons/fa";

const Basket = ({ basket, hasMatchingFruit }) => {
  // Get the appropriate color class based on the basket type
  const getBasketColorClass = () => {
    switch (basket.type) {
      case "red":
        return "text-red-500";
      case "yellow":
        return "text-yellow-400";
      case "orange":
        return "text-orange-400";
      case "purple":
        return "text-purple-500";
      case "green":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Get the appropriate basket icon based on the basket type
  const getBasketIcon = () => {
    switch (basket.type) {
      case "red":
      case "orange":
        return (
          <GiBasket
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
          />
        );
      case "yellow":
      case "green":
        return (
          <FaShoppingBasket
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
          />
        );
      case "purple":
      default:
        return (
          <GiWoodenCrate
            className="w-full h-full"
            style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))" }}
          />
        );
    }
  };

  return (
    <motion.div
      className={`basket-container relative ${
        hasMatchingFruit ? "z-20" : "z-0"
      } hover:scale-105 transition-transform duration-200`}
      initial={{ scale: 0.9 }}
      animate={{
        scale: hasMatchingFruit ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
    >
      {/* Basket shape - using SVG icons */}
      <div
        className={`
        w-20 h-16 md:w-28 md:h-20
        ${getBasketColorClass()}
        flex items-center justify-center
        relative
        shadow-lg
        transition-all duration-300
        ${hasMatchingFruit ? "scale-105" : "scale-100"}
      `}
      >
        {/* Basket icon */}
        {getBasketIcon()}

        {/* Shadow effect for depth */}
        <div className="absolute -bottom-2 w-3/4 h-1 bg-black opacity-20 rounded-full"></div>

        {/* Platform for fruits to sit on */}
        <div className="absolute top-1/3 left-0 right-0 h-2 bg-current opacity-30 rounded"></div>
      </div>

      {/* Basket label */}
      <div className="text-xs md:text-sm text-center mt-2 text-richblack-100 font-medium bg-richblack-800 bg-opacity-70 px-2 py-1 rounded-md">
        {basket.name ||
          `${
            basket.type.charAt(0).toUpperCase() + basket.type.slice(1)
          } Basket`}
      </div>
    </motion.div>
  );
};

export default Basket;
