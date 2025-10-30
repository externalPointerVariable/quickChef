import React, { useState, useEffect, useCallback } from 'react';
import IngredientInput from '../components/IngredientInput.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { filterMealsByIngredients } from '../services/index.js';

const Ingredient = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const loadRecipes = useCallback(async (ingredients) => {
    if (ingredients.length === 0) {
      setFilteredRecipes([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log(`Searching for recipes containing: ${ingredients.join(', ')}`);

    try {
      const recipes = await filterMealsByIngredients(ingredients);
      setFilteredRecipes(recipes);

      if (recipes.length === 0) {
        setError(
          `No recipes found that contain ALL of these ingredients: ${ingredients.join(', ')}. Try fewer ingredients.`
        );
      }
    } catch (err) {
      console.error('General API fetch error:', err);
      setError('A network error occurred while searching for recipes.');
      setFilteredRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedIngredients.length > 0) {
        loadRecipes(selectedIngredients);
      } else {
        setFilteredRecipes([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [selectedIngredients, loadRecipes]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <IngredientInput
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />

      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {selectedIngredients.length > 0 ? 'Filtered Recipes' : 'Start Searching'}
      </h2>

      {isLoading && <LoadingSpinner text="Finding the perfect meal..." />}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative shadow-md"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      {!isLoading && !error && selectedIngredients.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                onSelectRecipe={setSelectedRecipeId}
              />
            ))
          ) : (
            <div className="lg:col-span-3 py-16 text-center text-gray-500 bg-white rounded-xl shadow-inner">
              <p className="text-xl font-semibold mb-2">No Quick Meals Found!</p>
              <p>Try simplifying your search or checking the spelling of your ingredients.</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !error && selectedIngredients.length === 0 && (
        <div className="py-16 text-center text-gray-500 bg-white rounded-xl shadow-lg">
          <p className="text-xl font-semibold mb-2">Enter your ingredients above to see ideas!</p>
          <p>Quick Chef will find the perfect meal using only what you have.</p>
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
};

export default Ingredient;