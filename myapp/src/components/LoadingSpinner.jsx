import React from 'react';

const LoadingSpinner = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-600">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500 mb-4"></div>
      <p className="text-lg font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;