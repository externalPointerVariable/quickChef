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
      className="group relative cursor-pointer rounded-2xl overflow-hidden 
      bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg 
      hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 active:scale-[0.98]"
    >

      {/* Image */}
      <div className="aspect-video overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x400';
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
        <span className="text-white text-sm font-semibold tracking-wide flex items-center gap-1">
         View Recipe 
         <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
        </div>
      </div>

      {/* Title */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
          {truncatedTitle}
        </h3>
      </div>

    </div>
  );
}

export default RecipeCard;