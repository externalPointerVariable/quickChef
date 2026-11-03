import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Heart, X, Trash2, ArrowUpRight, ChefHat, Sparkles } from 'lucide-react';

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  onSelectRecipe,
  onRemoveFavorite,
  onClearAll,
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // GSAP entrance
      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.4, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (panelRef.current && overlayRef.current) {
      gsap.to(panelRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={panelRef}
          className="w-screen max-w-md bg-[#12141d] border-l border-white/10 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#161824]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">Saved Recipes</h2>
                <p className="text-xs text-slate-400">
                  {favorites.length} {favorites.length === 1 ? 'dish' : 'dishes'} saved to your cookbook
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Close saved recipes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ChefHat className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">No Saved Dishes Yet</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
                  Click the heart icon on any recipe card to save your favorite culinary inspirations for easy access.
                </p>
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-lg shadow-amber-500/20"
                >
                  Explore Recipes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites.map((recipe) => (
                  <div
                    key={recipe.idMeal}
                    className="group relative flex items-center space-x-4 p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 transition-all duration-200"
                  >
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://placehold.co/200x200/181b28/f59e0b?text=Dish';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-amber-400 transition">
                        {recipe.strMeal}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {recipe.strCategory && (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate">
                            {recipe.strCategory}
                          </span>
                        )}
                        {recipe.strArea && (
                          <span className="text-[11px] font-medium text-slate-400 truncate">
                            {recipe.strArea}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => {
                          onSelectRecipe(recipe.idMeal);
                          handleClose();
                        }}
                        className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                        title="View details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFavorite(recipe.idMeal)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="p-4 border-t border-white/10 bg-[#161824] flex items-center justify-between">
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear All
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

