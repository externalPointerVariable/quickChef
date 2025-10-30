import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCategoryList, filterMealByCategory } from '../services/index.js';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategoryList();
      if (data?.categories) {
        setCategories(data.categories.map((c) => c.strCategory));
      }
    };
    loadCategories();
  }, []);

  const loadRecipes = useCallback(async (category) => {
    if (!category) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await filterMealByCategory(category);
      console.log(data);
      const meals = data || [];
      setRecipes(meals);

      if (!Array.isArray(meals) || meals.length === 0) {
        setError(`No recipes found for category: ${category}`);
      }
    } catch (err) {
      console.error('Category fetch error:', err);
      setError('A network error occurred while searching by category.');
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadRecipes(selectedCategory);
    }
  }, [selectedCategory, loadRecipes]);

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Browse by Category</h1>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-6 p-3 border border-gray-300 rounded-lg text-lg"
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
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

      {!isLoading && !error && selectedCategory && recipes.length === 0 && (
        <div className="py-16 text-center text-gray-500 bg-white rounded-xl shadow-lg">
          <p className="text-xl font-semibold mb-2">No recipes found for this category.</p>
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

export default Categories;