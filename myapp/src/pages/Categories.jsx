import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard.jsx';
import RecipeDetail from '../components/RecipeDetail.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCategoryList, filterMealByCategory } from '../services/index.js';

function Categories({ activeSearch }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (activeSearch !== 'categories') {
      setSearchTerm('');
    }
  }, [activeSearch]);

  return (
  <div id="categories" className="scroll-mt-24">

    <div className="max-w-7xl mx-auto px-6 py-12">
      
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">

        <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">
          Browse Recipes
        </h1>

        {/* Category Search Bar */}
        {activeSearch === 'categories' && (
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-indigo-100 bg-indigo-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400 text-gray-700 transition duration-200 shadow-sm hover:shadow-md"
            />
          </div>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {filteredCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
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

        {isLoading && (
          <div className="flex justify-center py-10">
            <LoadingSpinner text="Finding delicious recipes..." />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {!isLoading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-xl">
            <p className="text-xl font-semibold mb-2">
              Nothing here yet 👀
            </p>
            <p>Try another category</p>
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

export default Categories;