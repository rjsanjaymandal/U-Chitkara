import React from "react";
import { motion } from "framer-motion";
import { FaAppleAlt, FaCarrot, FaLemon } from "react-icons/fa";
import {
  GiGrapes,
  GiStrawberry,
  GiPineapple,
  GiOrangeSlice,
  GiBanana,
  GiWatermelon,
} from "react-icons/gi";

const FlexItem = ({ fruit, isInBasket, style = {}, className = "" }) => {
  // Function to render the appropriate fruit icon
  const renderFruitIcon = () => {
    switch (fruit.type) {
      case "apple":
        return <FaAppleAlt className="text-red-500" />;
      case "banana":
        return <GiBanana className="text-yellow-400" />;
      case "orange":
        return <GiOrangeSlice className="text-orange-500" />;
      case "strawberry":
        return <GiStrawberry className="text-red-600" />;
      case "grapes":
        return <GiGrapes className="text-purple-600" />;
      case "watermelon":
        return <GiWatermelon className="text-green-500" />;
      case "pineapple":
        return <GiPineapple className="text-yellow-500" />;
      case "mango":
        return <FaLemon className="text-yellow-600" />;
      default:
        return <FaCarrot className="text-orange-500" />;
    }
  };

  return (
    <motion.div
      className={`${className} w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full
                 ${isInBasket ? "opacity-100" : "opacity-90"}`}
      initial={{ scale: 0.8 }}
      animate={{
        scale: isInBasket ? 0.7 : 1,
        y: isInBasket ? 8 : 0,
        zIndex: isInBasket ? 5 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
      style={style}
    >
      <div
        className={`text-2xl md:text-3xl ${isInBasket ? "animate-bounce" : ""}`}
      >
        {renderFruitIcon()}
      </div>
    </motion.div>
  );
};

export default FlexItem;
