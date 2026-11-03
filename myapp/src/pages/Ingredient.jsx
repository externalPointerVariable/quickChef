import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import IngredientInput from '../components/IngredientInput.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { filterMealsByIngredients } from '../services/index.js';
import { Sparkles, Utensils, AlertCircle } from 'lucide-react';

export default function Ingredient({
  onSelectRecipe,
  favorites = [],
  onToggleFavorite,
}) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const gridRef = useRef(null);

  const loadRecipes = useCallback(async (ingredients) => {
    if (ingredients.length === 0) {
      setFilteredRecipes([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recipes = await filterMealsByIngredients(ingredients);
      setFilteredRecipes(recipes);

      if (recipes.length === 0) {
        setError(
          `No matching recipes found with these ingredients (${ingredients.join(', ')}). Try removing an item or using simpler staples.`
        );
      }
    } catch (err) {
      console.error('Pantry fetch error:', err);
      setError('A network error occurred while finding matching recipes.');
      setFilteredRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced ingredient search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (selectedIngredients.length > 0) {
        loadRecipes(selectedIngredients);
      } else {
        setFilteredRecipes([]);
        setError(null);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [selectedIngredients, loadRecipes]);

  // GSAP Stagger animation for recipe cards
  useEffect(() => {
    if (filteredRecipes.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.recipe-tilt-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power3.out',
          }
        );
      }
    }
  }, [filteredRecipes]);

  const isFavorite = (id) => favorites.some((fav) => String(fav.idMeal) === String(id));

  return (
    <section id="pantry" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <IngredientInput
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center space-x-2">
            <span>
              {selectedIngredients.length > 0
                ? `Matching Recipes (${filteredRecipes.length})`
                : 'Pantry Recipe Discovery'}
            </span>
          </h3>
          {selectedIngredients.length > 0 && (
            <p className="text-xs text-slate-400 mt-1">
              Showing recipes filtered for: {selectedIngredients.join(' + ')}
            </p>
          )}
        </div>

        {filteredRecipes.length > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ✓ Ready to cook
          </span>
        )}
      </div>

      {isLoading && <LoadingSpinner text="Analyzing pantry combinations..." />}

      {error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 shadow-lg">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!isLoading && !error && selectedIngredients.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              onSelectRecipe={onSelectRecipe}
              isFavorite={isFavorite(recipe.idMeal)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Empty State when no ingredients selected */}
      {!isLoading && !error && selectedIngredients.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl glass-panel border border-white/5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Utensils className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">
            Ready to Cook Something Wonderful?
          </h4>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Add ingredients you have in your fridge or kitchen to unlock tailor-made recipes with complete step-by-step instructions.
          </p>
          <div className="inline-flex items-center space-x-2 text-xs font-medium text-amber-300/80">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Pro-tip: Try clicking '🍗 Chicken' and '🧄 Garlic' above!</span>
          </div>
        </div>
      )}
    </section>
  );
}
