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
    <main className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen 
    bg-gradient-to-br from-indigo-100 via-indigo-50 to-purple-100">

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">
        Browse Recipes
      </h1>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
            ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-indigo-50/80 border border-indigo-100 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner text="Finding delicious recipes..." />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Recipes Grid */}
      {!isLoading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              onSelectRecipe={setSelectedRecipeId}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && selectedCategory && recipes.length === 0 && (
        <div className="py-16 text-center text-gray-500 
        bg-indigo-50/60 border border-indigo-100 rounded-2xl shadow-sm">
          <p className="text-xl font-semibold mb-2">
            Nothing here yet 👀
          </p>
          <p>Try another category</p>
        </div>
      )}

      {/* Modal */}
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