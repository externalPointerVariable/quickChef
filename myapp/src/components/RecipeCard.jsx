import React, { useRef } from 'react';
import gsap from 'gsap';
import { Heart, ArrowUpRight, Flame, Sparkles } from 'lucide-react';

const MAX_RECIPE_TITLE_LENGTH = 32;

export default function RecipeCard({
  recipe,
  onSelectRecipe,
  isFavorite = false,
  onToggleFavorite,
}) {
  const cardRef = useRef(null);
  const heartBtnRef = useRef(null);

  const truncatedTitle =
    recipe.strMeal.length > MAX_RECIPE_TITLE_LENGTH
      ? `${recipe.strMeal.substring(0, MAX_RECIPE_TITLE_LENGTH)}...`
      : recipe.strMeal;

  // 3D Card Tilt on Mouse Move
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      scale: 1.02,
      duration: 0.25,
      ease: 'power1.out',
    });

    // Update CSS variable for glare position
    card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (heartBtnRef.current) {
      gsap.fromTo(
        heartBtnRef.current,
        { scale: 0.7, rotate: -20 },
        { scale: 1.3, rotate: 10, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.out(2)' }
      );
    }
    if (onToggleFavorite) {
      onToggleFavorite(recipe);
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectRecipe(recipe.idMeal)}
      className="recipe-tilt-card relative group rounded-3xl bg-[#141624] border border-white/10 hover:border-amber-500/40 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-colors duration-300 overflow-hidden flex flex-col cursor-pointer transform-gpu"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Glare effect element */}
      <div className="glare-effect" />

      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://placehold.co/600x450/161826/f59e0b?text=QuickChef+Dish';
          }}
        />

        {/* Gradient shadow over bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141624] via-transparent to-black/30" />

        {/* Favorite Button */}
        <button
          ref={heartBtnRef}
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/50 text-white hover:bg-black/80 hover:text-rose-400 border border-white/20'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-transform ${
              isFavorite ? 'fill-current scale-110' : 'hover:scale-110'
            }`}
          />
        </button>

        {/* Match Count Badge (for multi-ingredient search) */}
        {recipe.totalIngredients && recipe.totalIngredients > 1 && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full backdrop-blur-md bg-amber-500/80 text-slate-950 font-bold text-xs shadow-md flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>
              {recipe.matchCount === recipe.totalIngredients
                ? 'All Ingredients Matched'
                : `Matches ${recipe.matchCount}/${recipe.totalIngredients} Items`}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category & Cuisine Badges */}
        <div className="flex items-center space-x-2 mb-2.5">
          {recipe.strCategory && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {recipe.strCategory}
            </span>
          )}
          {recipe.strArea && (
            <span className="text-[11px] font-medium text-slate-400">
              {recipe.strArea}
            </span>
          )}
        </div>

        <h3
          className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-4"
          title={recipe.strMeal}
        >
          {truncatedTitle}
        </h3>

        {/* Action Button */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition">
            Explore recipe
          </span>
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
