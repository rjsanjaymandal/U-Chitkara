import React, { useState, useEffect } from 'react';
import { FaCode, FaLightbulb } from 'react-icons/fa';

const CodeEditor = ({ initialCode, onCodeChange, validateCode, hints }) => {
  const [code, setCode] = useState(initialCode);
  const [isValid, setIsValid] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  useEffect(() => {
    setCode(initialCode);
    setIsValid(null);
    setShowHints(false);
    setCurrentHint(0);
  }, [initialCode]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Pass the code to parent component
    onCodeChange(newCode);
    
    // Reset validation state when code changes
    setIsValid(null);
  };

  const handleValidate = () => {
    const result = validateCode(code);
    setIsValid(result.isValid);
    
    // If code is valid, we don't need to show hints
    if (result.isValid) {
      setShowHints(false);
    }
  };

  const handleShowNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1);
    } else {
      // Cycle back to the first hint
      setCurrentHint(0);
    }
  };

  return (
    <div className="bg-richblack-800 rounded-lg overflow-hidden border border-richblack-700 shadow-lg">
      {/* Editor header */}
      <div className="bg-richblack-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaCode className="text-yellow-50" />
          <span className="text-richblack-5 font-medium">CSS Editor</span>
        </div>
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-yellow-50 hover:text-yellow-100 transition-colors flex items-center gap-1"
        >
          <FaLightbulb />
          <span className="text-sm">Hints</span>
        </button>
      </div>

      {/* Hints section */}
      {showHints && hints.length > 0 && (
        <div className="bg-richblack-700 p-3 border-b border-richblack-600">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-yellow-50">Hint {currentHint + 1}/{hints.length}</span>
            <button 
              onClick={handleShowNextHint}
              className="text-xs text-richblack-300 hover:text-richblack-100"
            >
              Next hint
            </button>
          </div>
          <p className="text-sm text-richblack-100">{hints[currentHint]}</p>
        </div>
      )}

      {/* Code editor */}
      <div className="p-1">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-40 bg-richblack-900 text-richblack-5 p-3 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-50 rounded"
          spellCheck="false"
        />
      </div>

      {/* Editor footer with validation button */}
      <div className="bg-richblack-900 px-4 py-2 flex justify-between items-center">
        <div>
          {isValid !== null && (
            <span className={`text-sm ${isValid ? 'text-green-500' : 'text-red-500'}`}>
              {isValid ? 'CSS is valid! ✓' : 'Not quite right. Try again.'}
            </span>
          )}
        </div>
        <button
          onClick={handleValidate}
          className="bg-yellow-50 text-richblack-900 px-4 py-1 rounded text-sm font-medium hover:bg-yellow-100 transition-colors"
        >
          Apply CSS
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
