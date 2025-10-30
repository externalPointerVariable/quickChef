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
    <div className="p-6 bg-white shadow-xl rounded-xl mb-8 border border-gray-100">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
        What do you have in the kitchen?
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Enter ingredients and press Enter to search for intersecting recipes.
      </p>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type an ingredient (e.g., chicken, rice, tomato)"
        className="w-full p-3 border border-gray-800 rounded-lg text-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      />

      <div className="mt-4 flex flex-wrap gap-2 min-h-[40px]">
        {selectedIngredients.map((ingredient) => (
          <span
            key={ingredient}
            className="inline-flex items-center bg-indigo-500 text-white text-sm font-medium px-4 py-1 rounded-full shadow-md"
          >
            {ingredient}
            <button
              onClick={() => handleRemove(ingredient)}
              className="ml-2 text-indigo-100 hover:text-white transition duration-150 p-0.5 rounded-full"
              aria-label={`Remove ${ingredient}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </span>
        ))}
        {selectedIngredients.length === 0 && (
          <p className="text-gray-400 italic">No ingredients added yet.</p>
        )}
      </div>
    </div>
  );
}

export default IngredientInput;