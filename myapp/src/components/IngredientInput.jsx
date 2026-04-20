import React, { useState } from 'react';

function IngredientInput({ selectedIngredients, setSelectedIngredients }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newIngredient = inputValue.trim().toLowerCase();

      if (!selectedIngredients.includes(newIngredient)) {
        setSelectedIngredients([...selectedIngredients, newIngredient]);
      }

      setInputValue('');
    }
  };

  const handleRemove = (ingredientToRemove) => {
    setSelectedIngredients(
      selectedIngredients.filter((ing) => ing !== ingredientToRemove)
    );
  };

return (
  <div className="p-6 bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg rounded-2xl mb-8">
    
    <h2 className="text-2xl font-bold text-gray-800 mb-1">
      What's in your kitchen?
    </h2>
    <p className="text-sm text-gray-500 mb-5">
      Add ingredients and press Enter
    </p>

    {/* Input */}
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. chicken, rice, tomato..."
        className="w-full p-4 pr-12 rounded-xl bg-white/40 backdrop-blur-md border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
      />

      {/* Floating hint icon */}
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
        ⏎
      </span>
    </div>

    {/* Chips */}
    <div className="mt-5 flex flex-wrap gap-2 min-h-[40px]">
      {selectedIngredients.map((ingredient) => (
        <span
          key={ingredient}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/90 text-white text-sm font-medium shadow-md hover:scale-105 transition-all duration-200"
        >
          {ingredient}

          <button
            onClick={() => handleRemove(ingredient)}
            className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition"
          >
            ✕
          </button>
        </span>
      ))}

      {selectedIngredients.length === 0 && (
        <p className="text-gray-400 italic text-sm">
          No ingredients yet...
        </p>
      )}
    </div>
  </div>
);
}

export default IngredientInput;