import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import RecipeCard from '../components/RecipeCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { getCuisineList, filterMealByCuisine } from '../services/index.js';
import { Globe2, ChevronLeft, ChevronRight, AlertCircle, Compass } from 'lucide-react';

const CUISINE_FLAGS = {
  American: '🇺🇸',
  British: '🇬🇧',
  Canadian: '🇨🇦',
  Chinese: '🇨🇳',
  Croatian: '🇭🇷',
  Dutch: '🇳🇱',
  Egyptian: '🇪🇬',
  Filipino: '🇵🇭',
  French: '🇫🇷',
  Greek: '🇬🇷',
  Indian: '🇮🇳',
  Irish: '🇮🇪',
  Italian: '🇮🇹',
  Jamaican: '🇯🇲',
  Japanese: '🇯🇵',
  Kenyan: '🇰🇪',
  Malaysian: '🇲🇾',
  Mexican: '🇲🇽',
  Moroccan: '🇲🇦',
  Polish: '🇵🇱',
  Portuguese: '🇵🇹',
  Russian: '🇷🇺',
  Spanish: '🇪🇸',
  Thai: '🇹🇭',
  Tunisian: '🇹🇳',
  Turkish: '🇹🇷',
  Ukrainian: '🇺🇦',
  Uruguayan: '🇺🇾',
  Vietnamese: '🇻🇳',
};

export default function Cuisine({
  onSelectRecipe,
  favorites = [],
  onToggleFavorite,
}) {
  const [cuisines, setCuisines] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('Italian');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollTrackRef = useRef(null);
  const gridRef = useRef(null);

  // Load cuisine list
  useEffect(() => {
    let isMounted = true;
    const loadCuisines = async () => {
      try {
        const data = await getCuisineList();
        if (isMounted && data?.meals) {
          const list = data.meals.map((c) => c.strArea).filter(Boolean);
          setCuisines(list);
        }
      } catch (err) {
        console.error('Failed to load cuisines', err);
      }
    };
    loadCuisines();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch meals for selected cuisine
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

  // GSAP staggered cards entrance
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
  const currentFlag = CUISINE_FLAGS[selectedCuisine] || '🌐';

  return (
    <section id="cuisines" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>International Gastronomy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Global Cuisines
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Travel the culinary capitals of the world without leaving your kitchen. Authentic recipes with time-honored techniques.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={scrollLeft}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
            aria-label="Scroll cuisines left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollRight}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition"
            aria-label="Scroll cuisines right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Flag Pill Track */}
      <div
        ref={scrollTrackRef}
        className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-none mb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {cuisines.map((cuisine) => {
          const isSelected = cuisine === selectedCuisine;
          const flag = CUISINE_FLAGS[cuisine] || '🌐';
          return (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`shrink-0 flex items-center space-x-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 border-rose-400 text-white shadow-lg shadow-rose-500/10 scale-105'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white hover:border-white/20'
              }`}
            >
              <span className="text-xl">{flag}</span>
              <span className="text-sm font-bold tracking-wide">{cuisine}</span>
            </button>
          );
        })}
      </div>

      {/* Cuisine Spotlight Banner */}
      <div className="mb-10 p-6 rounded-3xl glass-panel border border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl">
            {currentFlag}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>Authentic {selectedCuisine} Recipes</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Featuring {recipes.length} signature dishes from {selectedCuisine} tradition
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
          World Heritage Cuisine
        </span>
      </div>

      {isLoading && <LoadingSpinner text={`Traveling to ${selectedCuisine}...`} />}

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
              recipe={{ ...recipe, strArea: selectedCuisine }}
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
