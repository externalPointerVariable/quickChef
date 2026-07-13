import React from 'react';

const LoadingSpinner = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-600">
      

      <div className="flex space-x-2 mb-4">
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
      </div>


      <p className="text-lg font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;