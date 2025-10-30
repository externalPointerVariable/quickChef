import React from 'react';

const MAX_RECIPE_TITLE_LENGTH = 35;

function RecipeCard({ recipe, onSelectRecipe }) {
  const truncatedTitle =
    recipe.strMeal.length > MAX_RECIPE_TITLE_LENGTH
      ? `${recipe.strMeal.substring(0, MAX_RECIPE_TITLE_LENGTH)}...`
      : recipe.strMeal;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden flex flex-col transform hover:scale-[1.01]">
      <div className="aspect-video overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover transition duration-500 ease-in-out hover:opacity-90"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/600x400/D1D5DB/1F2937?text=No+Image';
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{truncatedTitle}</h3>
        <button
          onClick={() => onSelectRecipe(recipe.idMeal)}
          className="mt-auto py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;