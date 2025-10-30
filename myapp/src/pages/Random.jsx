import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getRandomMeal } from '../services/index.js';

function Random() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const fetchRandomRecipe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getRandomMeal();
      const meal = data?.meals?.[0];
      if (meal) {
        setRecipe(meal);
      } else {
        setError('No recipe found. Try again.');
      }
    } catch (err) {
      console.error('Error fetching random meal:', err);
      setError('A network error occurred while fetching a random recipe.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomRecipe();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Surprise Me!</h1>

      {isLoading && <LoadingSpinner text="Fetching a delicious surprise..." />}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}

      {!isLoading && recipe && (
        <div className="mb-6">
          <RecipeCard recipe={recipe} onSelectRecipe={setSelectedRecipeId} />
        </div>
      )}

      <button
        onClick={fetchRandomRecipe}
        className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Get Another Recipe
      </button>

      {selectedRecipeId && (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </main>
  );
}

export default Random;