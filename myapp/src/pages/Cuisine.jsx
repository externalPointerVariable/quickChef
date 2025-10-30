import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCuisineList, filterMealByCuisine } from '../services/index.js';

function Cuisine() {
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    const loadCuisines = async () => {
      const data = await getCuisineList();
      if (data?.meals) {
        setCuisines(data.meals.map((c) => c.strArea));
      }
    };
    loadCuisines();
  }, []);

  const loadRecipes = useCallback(async (cuisine) => {
    if (!cuisine) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await filterMealByCuisine(cuisine);
      setRecipes(data || []);
      if (!data || data.length === 0) {
        setError(`No recipes found for cuisine: ${cuisine}`);
      }
    } catch (err) {
      console.error('Cuisine fetch error:', err);
      setError('A network error occurred while searching by cuisine.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCuisine) {
      loadRecipes(selectedCuisine);
    }
  }, [selectedCuisine, loadRecipes]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Browse by Cuisine</h1>

      <select
        value={selectedCuisine}
        onChange={(e) => setSelectedCuisine(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded-lg text-lg"
      >
        <option value="">Select a cuisine</option>
        {cuisines.map((cuisine) => (
          <option key={cuisine} value={cuisine}>
            {cuisine}
          </option>
        ))}
      </select>

      {isLoading && <LoadingSpinner text="Fetching recipes..." />}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="ml-2">{error}</span>
        </div>
      )}

      {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              onSelectRecipe={setSelectedRecipeId}
            />
          ))}
        </div>
      )}

      {!isLoading && !error && selectedCuisine && recipes.length === 0 && (
        <div className="py-16 text-center text-gray-500 bg-white rounded-xl shadow-lg">
          <p className="text-xl font-semibold mb-2">No recipes found for this cuisine.</p>
          <p>Try selecting a different option.</p>
        </div>
      )}

      {selectedRecipeId && (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </main>
  );
}

export default Cuisine;