import React from 'react';

function QuickChefLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-indigo-500"
    >
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="#EEF2FF"
        className="transition-all duration-300"
      />
      <path
        d="M30 50 C 40 30, 70 30, 80 50 C 75 65, 55 60, 40 70 L 30 50 Z"
        fill="currentColor"
      />
      <path
        d="M55 50 L 70 65 L 85 50"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-md border-r-3">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <QuickChefLogo />
          <h1 className="text-3xl font-extrabold text-indigo-600">Quick Chef</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;