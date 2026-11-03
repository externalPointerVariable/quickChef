import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { getRandomMeal } from '../services/index.js';
import RecipeCard from '../components/RecipeCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Dices, Sparkles, AlertCircle } from 'lucide-react';

export default function Random({
  onSelectRecipe,
  favorites = [],
  onToggleFavorite,
  onShowToast,
}) {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [error, setError] = useState(null);

  const diceIconRef = useRef(null);
  const showcaseRef = useRef(null);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#f43f5e', '#10b981', '#6366f1', '#fbbf24'],
      });
    } catch (e) {
      console.log('Confetti not supported', e);
    }
  };

  const fetchRandomRecipe = useCallback(async (isManualRoll = false) => {
    setIsLoading(true);
    setError(null);
    if (isManualRoll) setIsSpinning(true);

    // Spin the dice with GSAP
    if (diceIconRef.current) {
      gsap.to(diceIconRef.current, {
        rotation: '+=720',
        scale: 1.25,
        duration: 0.8,
        ease: 'back.out(2)',
        onComplete: () => {
          gsap.to(diceIconRef.current, { scale: 1, duration: 0.2 });
        },
      });
    }

    try {
      const data = await getRandomMeal();
      const meal = data?.meals?.[0];
      if (meal) {
        setRecipe(meal);
        if (isManualRoll) {
          fireConfetti();
          onShowToast?.({
            message: `🎉 Chef's pick: ${meal.strMeal}!`,
            type: 'sparkle',
          });
        }
      } else {
        setError('No recipe found. Please try spinning again.');
      }
    } catch (err) {
      console.error('Error fetching random meal:', err);
      setError('A network error occurred while fetching a random recipe.');
    } finally {
      setIsLoading(false);
      setIsSpinning(false);
    }
  }, [onShowToast]);

  useEffect(() => {
    fetchRandomRecipe(false);
  }, [fetchRandomRecipe]);

  // GSAP Entrance animation when recipe updates
  useEffect(() => {
    if (recipe && showcaseRef.current) {
      gsap.fromTo(
        showcaseRef.current,
        { scale: 0.92, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.6)' }
      );
    }
  }, [recipe]);

  const isFavorite = (id) => favorites.some((fav) => String(fav.idMeal) === String(id));

  return (
    <section id="roulette" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative rounded-3xl glass-panel-elevated p-8 sm:p-12 border border-white/15 overflow-hidden">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/15 blur-3xl rounded-full" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Spontaneous Culinary Discovery</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            The Chef's Culinary Roulette
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Can't decide what to eat tonight? Roll the dice and let gastronomic fate pick an extraordinary dish for you.
          </p>

          {/* Roll the Dice Trigger Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => fetchRandomRecipe(true)}
              disabled={isSpinning || isLoading}
              className="group relative flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 font-extrabold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50"
            >
              <div ref={diceIconRef} className="text-slate-950">
                <Dices className="w-6 h-6" />
              </div>
              <span>{isSpinning ? 'Rolling the Kitchen Dice...' : 'Roll Again For A Mystery Dish'}</span>
              <Sparkles className="w-4 h-4 text-slate-900 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && <LoadingSpinner text="Rolling the chef's dice..." />}

        {/* Error */}
        {error && (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start space-x-3 shadow-lg mb-6 max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Winning Dish Showcase */}
        {!isLoading && !error && recipe && (
          <div ref={showcaseRef} className="max-w-xl mx-auto">
            <div className="mb-3 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                ★ Chef's Special Pick of the Moment
              </span>
            </div>
            <RecipeCard
              recipe={recipe}
              onSelectRecipe={onSelectRecipe}
              isFavorite={isFavorite(recipe.idMeal)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}
      </div>
    </section>
  );
}
