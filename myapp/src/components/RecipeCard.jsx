import React from 'react';

const MAX_RECIPE_TITLE_LENGTH = 35;

function RecipeCard({ recipe, onSelectRecipe }) {
  const truncatedTitle =
    recipe.strMeal.length > MAX_RECIPE_TITLE_LENGTH
      ? `${recipe.strMeal.substring(0, MAX_RECIPE_TITLE_LENGTH)}...`
      : recipe.strMeal;

  return (
    <div
      onClick={() => onSelectRecipe(recipe.idMeal)}
      className="group cursor-pointer rounded-2xl overflow-hidden 
      bg-white shadow-md hover:shadow-2xl 
      transition duration-300 hover:-translate-y-2 active:scale-[0.98]"
    >
      

      <div className="relative overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400';
          }}
        />


        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>


        <div className="absolute inset-0 bg-black/50 opacity-0 
        group-hover:opacity-100 transition duration-300 flex items-center justify-center">

          <span className="text-white text-sm font-semibold tracking-wide flex items-center gap-1">
            View Recipe
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>

        </div>
      </div>


      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
          {truncatedTitle}
        </h3>
      </div>

    </div>
  );
}

export default RecipeCard;