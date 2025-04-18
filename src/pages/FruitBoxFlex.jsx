import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaTrophy } from 'react-icons/fa';
import FlexGameBoard from '../Components/core/FruitBoxFlex/FlexGameBoard';
import { flexLevels } from '../Components/core/FruitBoxFlex/LevelData';

const FruitBoxFlex = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'completed'
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  
  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('fruitBoxFlexProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedLevels(progress.completedLevels || []);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);
  
  // Save progress to localStorage
  useEffect(() => {
    if (completedLevels.length > 0) {
      localStorage.setItem('fruitBoxFlexProgress', JSON.stringify({
        completedLevels
      }));
    }
  }, [completedLevels]);
  
  // Handle starting the game
  const handleStartGame = (levelIndex = 0) => {
    setCurrentLevelIndex(levelIndex);
    setGameState('playing');
  };
  
  // Handle level completion
  const handleLevelComplete = (levelId) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels([...completedLevels, levelId]);
    }
    
    // Check if all levels are completed
    if (levelId === flexLevels.length && !completedLevels.includes(levelId)) {
      setGameState('completed');
    }
  };
  
  // Handle navigation to next level
  const handleNextLevel = () => {
    if (currentLevelIndex < flexLevels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      setGameState('completed');
    }
  };
  
  // Handle navigation to previous level
  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  };
  
  // Reset progress
  const handleResetProgress = () => {
    setCompletedLevels([]);
    localStorage.removeItem('fruitBoxFlexProgress');
    setGameState('menu');
  };
  
  // Render game menu
  const renderMenu = () => (
    <motion.div 
      className="max-w-4xl mx-auto bg-richblack-800 rounded-lg p-8 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-richblack-5 mb-2 flex items-center">
          <span className="text-green-500">Fruit</span>
          <span className="text-yellow-50">box</span>
          <span className="ml-2 text-blue-400">Flex</span>
        </h1>
        <p className="text-richblack-100 text-center max-w-2xl">
          Learn CSS Flexbox by placing fruits in their matching baskets. Write CSS code to control the layout!
        </p>
      </div>
      
      <div className="bg-richblack-900 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-richblack-5 mb-4">Instructions:</h2>
        <p className="text-richblack-100 mb-4">
          FruitBox Flex is a game where you use CSS code to place fruits in the correct basket. 
          Using the flex properties on the container with the id 'container', place the fruits in their matching colored baskets.
        </p>
        
        <ul className="list-disc pl-6 space-y-2 text-richblack-100">
          <li>Write CSS Flexbox properties in the editor</li>
          <li>Click "Apply CSS" to see how your code affects the layout</li>
          <li>Match fruits with their corresponding colored baskets</li>
          <li>Complete all levels to master CSS Flexbox!</li>
        </ul>
      </div>
      
      <h2 className="text-xl font-semibold text-richblack-5 mb-4">Select Level:</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {flexLevels.map((level, index) => {
          const isCompleted = completedLevels.includes(level.id);
          const isLocked = index > 0 && !completedLevels.includes(index);
          
          return (
            <motion.button
              key={level.id}
              className={`p-4 rounded-lg transition-colors relative ${
                isLocked 
                  ? 'bg-richblack-700 text-richblack-400 cursor-not-allowed' 
                  : isCompleted
                    ? 'bg-green-700 text-white hover:bg-green-600'
                    : 'bg-richblack-700 text-richblack-5 hover:bg-richblack-600'
              }`}
              whileHover={!isLocked ? { scale: 1.05 } : {}}
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              onClick={() => !isLocked && handleStartGame(index)}
              disabled={isLocked}
            >
              <h3 className="text-lg font-semibold">{level.title}</h3>
              <div className="text-sm opacity-80 mt-1">Level {level.id}</div>
              
              {isCompleted && (
                <div className="absolute top-2 right-2 text-yellow-300">
                  <FaTrophy />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link 
          to="/dashboard"
          className="flex items-center text-yellow-50 hover:text-yellow-100 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>
        
        {completedLevels.length > 0 && (
          <button
            onClick={handleResetProgress}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Reset Progress
          </button>
        )}
        
        <button
          onClick={() => handleStartGame(0)}
          className="bg-yellow-50 text-richblack-900 px-6 py-2 rounded font-medium hover:bg-yellow-100 transition-colors"
        >
          Start Learning
        </button>
      </div>
    </motion.div>
  );
  
  // Render game completion screen
  const renderCompletionScreen = () => (
    <motion.div 
      className="max-w-3xl mx-auto bg-richblack-800 rounded-lg p-8 shadow-lg"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-8">
        <FaTrophy className="text-yellow-300 text-4xl mr-4" />
        <h1 className="text-3xl md:text-4xl font-bold text-richblack-5">Congratulations!</h1>
      </div>
      
      <div className="bg-richblack-700 rounded-lg p-6 mb-8 text-center">
        <h2 className="text-2xl font-bold text-yellow-50 mb-4">You've Mastered CSS Flexbox!</h2>
        <p className="text-richblack-100 mb-6">
          You've completed all levels of FruitBox Flex and learned the essential concepts of CSS Flexbox.
          Now you can apply these skills to create flexible layouts in your own projects!
        </p>
        
        <div className="flex justify-center">
          <div className="bg-richblack-800 rounded-lg p-4 inline-block">
            <div className="text-richblack-5">
              <p className="text-lg">Levels Completed:</p>
              <p className="text-3xl font-bold text-yellow-50">{completedLevels.length} / {flexLevels.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setGameState('menu')}
          className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-100 transition-colors"
        >
          Return to Menu
        </button>
        <Link 
          to="/dashboard"
          className="bg-richblack-700 text-richblack-5 px-6 py-3 rounded-md font-semibold hover:bg-richblack-600 transition-colors text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </motion.div>
  );
  
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 py-8 px-4">
      <div className="container mx-auto">
        {gameState === 'menu' && renderMenu()}
        
        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <button
                className="flex items-center text-richblack-300 hover:text-yellow-50 transition-colors"
                onClick={() => setGameState('menu')}
              >
                <FaArrowLeft className="mr-2" />
                Back to Menu
              </button>
              <div className="text-richblack-5 font-semibold">
                Level: <span className="text-yellow-50">{currentLevelIndex + 1}/{flexLevels.length}</span>
              </div>
            </div>
            
            <FlexGameBoard 
              level={flexLevels[currentLevelIndex]}
              onLevelComplete={handleLevelComplete}
              onNextLevel={handleNextLevel}
              onPrevLevel={handlePrevLevel}
            />
          </div>
        )}
        
        {gameState === 'completed' && renderCompletionScreen()}
      </div>
    </div>
  );
};

export default FruitBoxFlex;
