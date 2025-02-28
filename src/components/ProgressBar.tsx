import React from 'react';

interface ProgressBarProps {
  progress: number;
  isTranslating: boolean;
}

const ProgressBar = ({ progress, isTranslating }: ProgressBarProps) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
      <div 
        className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
      {isTranslating && progress > 0 && (
        <div className="text-xs text-gray-600 mt-1">
          Translating... {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;