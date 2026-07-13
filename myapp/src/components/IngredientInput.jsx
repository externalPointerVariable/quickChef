import React, { useState } from 'react';

function IngredientInput({ selectedIngredients, setSelectedIngredients }) {
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    const value = inputValue.trim().toLowerCase();

    if (value && !selectedIngredients.includes(value)) {
      setSelectedIngredients([...selectedIngredients, value]);
    }

    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setSelectedIngredients(selectedIngredients.filter(item => item !== ingredientToRemove));
  };

return (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-white/50">
    
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
      What's in your kitchen?
    </h2>


    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
        🔍
      </span>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type an ingredient and press Enter"
        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-700 placeholder-gray-400 transition duration-200 shadow-sm hover:shadow-md"
      />


      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
        ⏎
      </span>
    </div>


    <div className="flex flex-wrap gap-2 mt-4">
      {selectedIngredients.map((item, index) => (
        <span
          key={index}
          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
        >
          {item}
          <button
            onClick={() => handleRemoveIngredient(item)}
            className="text-indigo-500 hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  </div>
);
}

export default IngredientInput;