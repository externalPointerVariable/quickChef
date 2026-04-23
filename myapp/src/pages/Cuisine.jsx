import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCuisineList, filterMealByCuisine } from '../services/index.js';

function Cuisine({ activeSearch }) {
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // 🔍 NEW: search state
  const [searchTerm, setSearchTerm] = useState('');

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

  // 🔍 NEW: filter logic
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (activeSearch !== 'cuisine') {
      setSearchTerm('');
    }
  }, [activeSearch]);

 return (
  <div id="cuisine" className="scroll-mt-24">

    <div className="max-w-7xl mx-auto px-6 py-12">
      
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">
          Browse by Cuisine
        </h1>

        {/* 🔍 Search */}
        {activeSearch === 'cuisine' && (
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search recipes (e.g. pasta, curry...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-xl border border-indigo-100 
              bg-indigo-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-300
              placeholder-gray-400 text-gray-700"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        )}

        {/* 🔥 Cuisine Pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${
                selectedCuisine === cuisine
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-50/80 border border-indigo-100 text-gray-700 hover:bg-indigo-100'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner text="Finding delicious recipes..." />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Recipes */}
        {!isLoading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                onSelectRecipe={setSelectedRecipeId}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && selectedCuisine && filteredRecipes.length === 0 && (
          <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-xl">
            <p className="text-xl font-semibold mb-2">
              Nothing here yet 👀
            </p>
            <p>Try another cuisine or search</p>
          </div>
        )}

      </div>

      {selectedRecipeId && (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}

    </div>

  </div>
);
}

export default Cuisine;