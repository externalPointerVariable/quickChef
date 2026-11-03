import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import RecipeCard from '../components/RecipeCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCategoryList, filterMealByCategory } from '../services/index.js';
import { Layers, ChevronRight, ChevronLeft, Sparkles, AlertCircle } from 'lucide-react';

const CATEGORY_EMOJIS = {
  Beef: '🥩',
  Chicken: '🍗',
  Dessert: '🍰',
  Lamb: '🍖',
  Miscellaneous: '🍲',
  Pasta: '🍝',
  Pork: '🥓',
  Seafood: '🦐',
  Side: '🥗',
  Starter: '🥟',
  Vegan: '🥑',
  Vegetarian: '🥦',
  Breakfast: '🍳',
  Goat: '🐐',
};

export default function Categories({
  onSelectRecipe,
  favorites = [],
  onToggleFavorite,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Chicken');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollTrackRef = useRef(null);
  const gridRef = useRef(null);

  // Load category list with thumbnails and descriptions
  useEffect(() => {
    let isMounted = true;
    const loadCategories = async () => {
      try {
        const data = await getCategoryList();
        if (isMounted && data?.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch meals for selected category
  const loadRecipes = useCallback(async (catName) => {
    if (!catName) return;

    setIsLoading(true);
    setError(null);

    try {
      const meals = await filterMealByCategory(catName);
      setRecipes(meals || []);
      if (!meals || meals.length === 0) {
        setError(`No recipes found for category: ${catName}`);
      }
    } catch (err) {
      console.error('Category fetch error:', err);
      setError('A network error occurred while loading this category.');
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

  // GSAP staggered cards entrance on recipe change
  useEffect(() => {
    if (recipes.length > 0 && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.recipe-tilt-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.04,
            duration: 0.4,
            ease: 'power3.out',
          }
        );
      }
    }
  }, [recipes]);

  const scrollLeft = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollTrackRef.current) {
      scrollTrackRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  const isFavorite = (id) => favorites.some((fav) => String(fav.idMeal) === String(id));
  const activeCategoryObj = categories.find((c) => c.strCategory === selectedCategory);

  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Browse by Culinary Category
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            From succulent seafood to decadent desserts, filter thousands of dishes by course, protein, or dietary preference.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Visual Category Pill Bar / Scroll Track */}
      <div
        ref={scrollTrackRef}
        className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-none mb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {categories.map((cat) => {
          const isSelected = cat.strCategory === selectedCategory;
          const emoji = CATEGORY_EMOJIS[cat.strCategory] || '🍽️';
          return (
            <button
              key={cat.idCategory || cat.strCategory}
              onClick={() => setSelectedCategory(cat.strCategory)}
              className={`shrink-0 flex items-center space-x-3 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/10 scale-105'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-sm font-bold tracking-wide">{cat.strCategory}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Description Card */}
      {activeCategoryObj && (
        <div className="mb-10 p-6 rounded-3xl glass-panel border border-white/10 flex flex-col md:flex-row items-center gap-6">
          {activeCategoryObj.strCategoryThumb && (
            <img
              src={activeCategoryObj.strCategoryThumb}
              alt={activeCategoryObj.strCategory}
              className="w-24 h-24 object-contain rounded-2xl bg-white/[0.03] p-2 border border-white/10 shrink-0"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-1">
              <span className="text-lg">
                {CATEGORY_EMOJIS[activeCategoryObj.strCategory] || '🍽️'}
              </span>
              <h3 className="text-xl font-bold text-white">
                {activeCategoryObj.strCategory} Recipes
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                {recipes.length} available
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {activeCategoryObj.strCategoryDescription?.replace(/\[\d+\]/g, '')}
            </p>
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner text={`Fetching ${selectedCategory} dishes...`} />}

      {error && (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 shadow-lg mb-8">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!isLoading && !error && recipes.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={{ ...recipe, strCategory: selectedCategory }}
              onSelectRecipe={onSelectRecipe}
              isFavorite={isFavorite(recipe.idMeal)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
}
