import React from 'react';
import { motion } from 'framer-motion';

const Instructions = ({ level }) => {
  return (
    <motion.div 
      className="bg-richblack-800 rounded-lg p-4 shadow-lg border border-richblack-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-yellow-50 mb-2">
        Level {level.id}: {level.title}
      </h2>
      
      <p className="text-richblack-100 mb-4">
        {level.description}
      </p>
      
      <div className="bg-richblack-700 p-3 rounded-md">
        <h3 className="text-sm font-medium text-richblack-5 mb-2">CSS Flexbox Properties to Try:</h3>
        <ul className="text-xs text-richblack-300 space-y-1 pl-4 list-disc">
          <li><code className="bg-richblack-900 px-1 py-0.5 rounded">justify-content</code>: Controls alignment along the main axis</li>
          <li><code className="bg-richblack-900 px-1 py-0.5 rounded">align-items</code>: Controls alignment along the cross axis</li>
          <li><code className="bg-richblack-900 px-1 py-0.5 rounded">flex-direction</code>: Sets the direction of the flex container</li>
          <li><code className="bg-richblack-900 px-1 py-0.5 rounded">flex-wrap</code>: Controls whether items wrap to new lines</li>
          <li><code className="bg-richblack-900 px-1 py-0.5 rounded">align-content</code>: Aligns a flex container's lines when there's extra space</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Instructions;
