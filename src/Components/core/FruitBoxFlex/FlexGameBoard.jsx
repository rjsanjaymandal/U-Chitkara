import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CodeEditor from "./CodeEditor";
import FlexContainer from "./FlexContainer";
import Instructions from "./Instructions";
import { FaChevronLeft, FaChevronRight, FaCheck } from "react-icons/fa";

const FlexGameBoard = ({
  level,
  onLevelComplete,
  onNextLevel,
  onPrevLevel,
}) => {
  const [userCode, setUserCode] = useState(level.initialCode);
  const [appliedCSS, setAppliedCSS] = useState(level.initialCode);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Reset state when level changes
  useEffect(() => {
    setUserCode(level.initialCode);
    setAppliedCSS(level.initialCode);
    setIsSuccess(false);
    setShowSuccessMessage(false);
  }, [level]);

  // Handle code changes from the editor
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
  };

  // Apply the CSS to the container
  const handleApplyCSS = () => {
    setAppliedCSS(userCode);

    // Validate the code after applying
    const validationResult = validateCode(userCode);

    if (validationResult.isValid) {
      setIsSuccess(true);
      // Play success sound
      playSuccessSound();
      // Show success message after a short delay
      setTimeout(() => {
        setShowSuccessMessage(true);
      }, 1000);
    } else {
      setIsSuccess(false);
      setShowSuccessMessage(false);
    }
  };

  // Validate the CSS code against the level's success conditions
  const validateCode = (code) => {
    const { requiredProperties, requiredValues } = level.successConditions;

    // Check if all required properties are present
    let allPropertiesPresent = true;
    let allValuesCorrect = true;

    for (let i = 0; i < requiredProperties.length; i++) {
      const property = requiredProperties[i];
      const value = requiredValues[i];

      // Check if the property exists in the code
      // This regex handles both container and item-specific properties
      const propertyRegex = new RegExp(`${property}\\s*:\\s*([^;]+)`, "i");
      const match = code.match(propertyRegex);

      if (!match) {
        allPropertiesPresent = false;
        break;
      }

      // Check if the value is correct
      const actualValue = match[1].trim();
      if (actualValue !== value) {
        allValuesCorrect = false;
        break;
      }
    }

    return {
      isValid: allPropertiesPresent && allValuesCorrect,
    };
  };

  // Add sound effects for success
  const playSuccessSound = () => {
    try {
      const audio = new Audio("/assets/sounds/success.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Sound not available");
    }
  };

  // Handle proceeding to the next level
  const handleNextLevel = () => {
    onLevelComplete(level.id);
    onNextLevel();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left column: Instructions and Code Editor */}
      <div className="flex-1">
        <Instructions level={level} />

        <div className="mt-6">
          <CodeEditor
            initialCode={level.initialCode}
            onCodeChange={handleCodeChange}
            validateCode={validateCode}
            hints={level.hints}
          />
        </div>

        {/* Navigation buttons for mobile */}
        <div className="flex justify-between mt-6 lg:hidden">
          <button
            onClick={onPrevLevel}
            disabled={level.id === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded ${
              level.id === 1
                ? "bg-richblack-700 text-richblack-400 cursor-not-allowed"
                : "bg-richblack-700 text-richblack-100 hover:bg-richblack-600"
            }`}
          >
            <FaChevronLeft />
            <span>Previous</span>
          </button>

          {isSuccess ? (
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <span>Next Level</span>
              <FaChevronRight />
            </button>
          ) : (
            <button
              onClick={handleApplyCSS}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-50 text-richblack-900 rounded hover:bg-yellow-100"
            >
              <span>Apply CSS</span>
              <FaCheck />
            </button>
          )}
        </div>
      </div>

      {/* Right column: Visual Playground */}
      <div className="flex-1">
        <FlexContainer
          level={level}
          appliedCSS={appliedCSS}
          isSuccess={isSuccess}
        />

        {/* Success message */}
        {showSuccessMessage && (
          <motion.div
            className="mt-6 bg-green-600 text-white p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-2">Great job! 🎉</h3>
            <p className="mb-4">You've successfully completed this level.</p>
            <button
              onClick={handleNextLevel}
              className="bg-white text-green-700 px-4 py-2 rounded font-medium hover:bg-green-50 transition-colors"
            >
              Continue to Next Level
            </button>
          </motion.div>
        )}

        {/* Navigation buttons for desktop */}
        <div className="hidden lg:flex justify-between mt-6">
          <button
            onClick={onPrevLevel}
            disabled={level.id === 1}
            className={`flex items-center gap-1 px-3 py-2 rounded ${
              level.id === 1
                ? "bg-richblack-700 text-richblack-400 cursor-not-allowed"
                : "bg-richblack-700 text-richblack-100 hover:bg-richblack-600"
            }`}
          >
            <FaChevronLeft />
            <span>Previous</span>
          </button>

          {isSuccess ? (
            <button
              onClick={handleNextLevel}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <span>Next Level</span>
              <FaChevronRight />
            </button>
          ) : (
            <button
              onClick={handleApplyCSS}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-50 text-richblack-900 rounded hover:bg-yellow-100"
            >
              <span>Apply CSS</span>
              <FaCheck />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlexGameBoard;
