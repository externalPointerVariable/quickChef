import React from 'react';

function QuickChefLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black"
    >
      <circle
        cx="54"
        cy="53"
        r="48"
        fill="#EEF2FF"
        className="transition-all duration-300"
      />
      <path
        d="m 30 50 C 35 30 70 30 77 50 L 69 70 C 57 64 53 64 40 70 L 30 50 Z"
        fill="currentColor"
      />
      <path
        d="m 40 77 L 55 83 L 70 77"
        //40 55 70     45 75     35 80 
        stroke="#000000"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Header() {
  return (
    <header className="bg-gray-200 shadow-md border-r-3">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <QuickChefLogo />
          <h1 className="text-3xl font-extrabold text-black">Quick Chef</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;