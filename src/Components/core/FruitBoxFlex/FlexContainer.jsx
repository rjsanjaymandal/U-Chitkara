import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FlexItem from "./FlexItem";
import Basket from "./Basket";
import { FaInfoCircle } from "react-icons/fa";

const FlexContainer = ({ level, appliedCSS, isSuccess }) => {
  const [containerStyle, setContainerStyle] = useState({});
  const [itemStyles, setItemStyles] = useState({});
  const [fruitsInBaskets, setFruitsInBaskets] = useState({});
  const [showCSSInfo, setShowCSSInfo] = useState(false);

  // Parse the CSS and apply it to the container and items
  useEffect(() => {
    try {
      // Initialize styles objects
      const cssProperties = {};
      const newItemStyles = {};

      // Process the CSS code
      const containerRegex = /#container\s*{([^}]*)}/g;
      const itemRegex = /\.flex-item\.(\w+)\s*{([^}]*)}/g;

      // Extract container styles
      const containerMatch = containerRegex.exec(appliedCSS);
      if (containerMatch && containerMatch[1]) {
        const containerCssText = containerMatch[1].trim();

        // Split by semicolons and process each declaration
        containerCssText.split(";").forEach((declaration) => {
          const [property, value] = declaration
            .split(":")
            .map((part) => part?.trim());
          if (property && value) {
            // Convert kebab-case to camelCase for React
            const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
              letter.toUpperCase()
            );
            cssProperties[camelProperty] = value;
          }
        });
      }

      // Extract item-specific styles
      let itemMatch;
      while ((itemMatch = itemRegex.exec(appliedCSS)) !== null) {
        const itemType = itemMatch[1]; // e.g., 'banana', 'apple'
        const itemCssText = itemMatch[2].trim();

        if (!newItemStyles[itemType]) {
          newItemStyles[itemType] = {};
        }

        // Split by semicolons and process each declaration
        itemCssText.split(";").forEach((declaration) => {
          const [property, value] = declaration
            .split(":")
            .map((part) => part?.trim());
          if (property && value) {
            // Convert kebab-case to camelCase for React
            const camelProperty = property.replace(/-([a-z])/g, (_, letter) =>
              letter.toUpperCase()
            );
            newItemStyles[itemType][camelProperty] = value;
          }
        });
      }

      // Set the container style
      setContainerStyle({
        display: "flex", // Always ensure display: flex is set
        ...cssProperties,
        // Add default styles for the container
        minHeight: "400px",
        backgroundColor: "#2D3748", // richblack-700
        borderRadius: "0.5rem",
        padding: "1rem",
        position: "relative",
        transition: "all 0.3s ease",
      });

      // Set item styles
      setItemStyles(newItemStyles);

      // If success, mark all fruits as in their baskets
      if (isSuccess) {
        const newFruitsInBaskets = {};
        level.fruits.forEach((fruit) => {
          newFruitsInBaskets[fruit.id] = true;
        });
        setFruitsInBaskets(newFruitsInBaskets);
      } else {
        setFruitsInBaskets({});
      }
    } catch (error) {
      console.error("Error parsing CSS:", error);
      // Set default style if there's an error
      setContainerStyle({
        display: "flex",
        minHeight: "300px",
        backgroundColor: "#2D3748",
        borderRadius: "0.5rem",
        padding: "1rem",
        position: "relative",
        transition: "all 0.3s ease",
      });
    }
  }, [appliedCSS, isSuccess, level.fruits]);

  // Find matching basket for a fruit
  const getMatchingBasket = (fruit) => {
    return level.baskets.find((basket) => basket.type === fruit.color);
  };

  return (
    <div className="flex-container-wrapper relative bg-richblack-900 p-4 pb-10 rounded-lg shadow-inner mb-6">
      {/* Green background similar to the reference image */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-20 rounded-lg"></div>

      {/* Decorative elements (leaves, rocks) */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        {/* Top left leaves */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-green-700 opacity-30 rounded-full -translate-x-8 -translate-y-8"></div>
        <div className="absolute top-2 left-2 w-8 h-8 bg-green-600 opacity-30 rounded-full"></div>

        {/* Bottom right leaves */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-green-700 opacity-30 rounded-full translate-x-8 translate-y-8"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-600 opacity-30 rounded-full"></div>

        {/* Rocks */}
        <div className="absolute top-1/4 right-2 w-6 h-4 bg-gray-600 opacity-30 rounded-full"></div>
        <div className="absolute bottom-1/4 left-2 w-6 h-4 bg-gray-600 opacity-30 rounded-full"></div>
      </div>

      {/* The actual flex container */}
      <div
        id="container"
        style={containerStyle}
        className="relative z-10 border-2 border-richblack-600"
      >
        {/* Position baskets inside the container */}
        {level.baskets.map((basket) => {
          // Find if there's a matching fruit for this basket
          const matchingFruit = level.fruits.find(
            (fruit) => fruit.color === basket.type
          );
          const hasMatchingFruit =
            matchingFruit && fruitsInBaskets[matchingFruit.id];

          // Create a new basket object with a name property if it doesn't exist
          const basketWithName = {
            ...basket,
            name:
              basket.name ||
              `${
                basket.type.charAt(0).toUpperCase() + basket.type.slice(1)
              } Basket`,
          };

          // Determine basket position class
          let positionClass = "";
          switch (basket.position) {
            case "left":
              positionClass = "absolute left-6 bottom-4";
              break;
            case "center":
              positionClass = "absolute left-1/2 -translate-x-1/2 bottom-4";
              break;
            case "right":
              positionClass = "absolute right-6 bottom-4";
              break;
            case "top":
              positionClass = "absolute top-4 left-1/2 -translate-x-1/2";
              break;
            case "middle":
              positionClass =
                "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2";
              break;
            case "bottom":
              positionClass = "absolute bottom-4 left-1/2 -translate-x-1/2";
              break;
            case "top-left":
              positionClass = "absolute top-4 left-6";
              break;
            case "top-right":
              positionClass = "absolute top-4 right-6";
              break;
            case "bottom-left":
              positionClass = "absolute bottom-4 left-6";
              break;
            case "bottom-right":
              positionClass = "absolute bottom-4 right-6";
              break;
            case "center-middle":
              positionClass =
                "absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2";
              break;
            default:
              positionClass = "absolute bottom-4 left-1/2 -translate-x-1/2";
          }

          return (
            <div key={basket.id} className={`${positionClass} z-0`}>
              <Basket
                basket={basketWithName}
                hasMatchingFruit={hasMatchingFruit}
              />
            </div>
          );
        })}

        {/* Render fruits */}
        {level.fruits.map((fruit) => (
          <FlexItem
            key={fruit.id}
            fruit={fruit}
            isInBasket={fruitsInBaskets[fruit.id]}
            style={itemStyles[fruit.type] || {}}
            className={`flex-item ${fruit.type}`}
          />
        ))}
      </div>

      {/* CSS Info Button */}
      <button
        className="absolute top-2 right-2 text-yellow-50 hover:text-yellow-100 transition-colors z-30"
        onClick={() => setShowCSSInfo(!showCSSInfo)}
        title="Show applied CSS"
      >
        <FaInfoCircle size={20} />
      </button>

      {/* CSS Info Overlay */}
      {showCSSInfo && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-lg z-30 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={() => setShowCSSInfo(false)}
        >
          <motion.div
            className="bg-richblack-800 text-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-auto"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2 text-yellow-50">
              Applied CSS
            </h3>
            <div className="bg-richblack-900 p-3 rounded font-mono text-sm text-richblack-5 whitespace-pre">
              {`#container {
  display: flex;${Object.entries(containerStyle)
    .filter(
      ([key]) =>
        key !== "display" &&
        key !== "minHeight" &&
        key !== "backgroundColor" &&
        key !== "borderRadius" &&
        key !== "padding" &&
        key !== "position" &&
        key !== "transition"
    )
    .map(
      ([key, value]) => `
  ${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`
    )
    .join("")}
}`}

              {Object.entries(itemStyles).map(
                ([itemType, styles]) =>
                  `

.flex-item.${itemType} {${Object.entries(styles)
                    .map(
                      ([key, value]) => `
  ${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value};`
                    )
                    .join("")}
}`
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success overlay */}
      {isSuccess && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-green-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg"
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            Perfect! 🎉
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default FlexContainer;
