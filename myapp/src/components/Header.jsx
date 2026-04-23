import React from 'react';

function QuickChefLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#6B8E23]"
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

function Header({ setActiveSearch }) {
  const handleNavClick = (searchType) => {
    setActiveSearch(searchType);
  };

  return (
    <header className="bg-white/30 backdrop-blur-md shadow-md sticky top-0 z-50">
      
      <div className="w-full px-8 py-4 flex items-center justify-between">

        {/* LEFT: Logo */}
      <div className="flex items-center space-x-3">
  <QuickChefLogo />
  <h1 className="text-3xl font-extrabold text-[#6B8E23]">
    Quick Chef
  </h1>
        </div>

        {/* RIGHT: Navigation */}
        <div className="space-x-6 font-medium hidden md:flex">
          <a
            href="#home"
            onClick={() => handleNavClick(null)}
            className="hover:text-indigo-500 transition cursor-pointer"
          >
            Home
          </a>
          <a
            href="#ingredients"
            className="hover:text-indigo-500 transition cursor-pointer"
          >
            Ingredients
          </a>
          <a
            href="#categories"
            onClick={() => handleNavClick('categories')}
            className="hover:text-indigo-500 transition cursor-pointer"
          >
            Categories
          </a>
          <a
            href="#cuisine"
            onClick={() => handleNavClick('cuisine')}
            className="hover:text-indigo-500 transition cursor-pointer"
          >
            Cuisine
          </a>
          <a
            href="#random"
            onClick={() => handleNavClick(null)}
            className="hover:text-indigo-500 transition cursor-pointer"
          >
            Random
          </a>
        </div>

      </div>

    </header>
  );
}

export default Header;