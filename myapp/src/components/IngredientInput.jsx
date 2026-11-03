import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { Plus, X, Sparkles, ChefHat, Trash2 } from 'lucide-react';

const POPULAR_PANTRY_ITEMS = [
  { name: 'chicken', label: '🍗 Chicken' },
  { name: 'beef', label: '🥩 Beef' },
  { name: 'salmon', label: '🐟 Salmon' },
  { name: 'eggs', label: '🥚 Eggs' },
  { name: 'tomato', label: '🍅 Tomato' },
  { name: 'garlic', label: '🧄 Garlic' },
  { name: 'onion', label: '🧅 Onion' },
  { name: 'potato', label: '🥔 Potato' },
  { name: 'rice', label: '🍚 Rice' },
  { name: 'pasta', label: '🍝 Pasta' },
  { name: 'cheese', label: '🧀 Cheese' },
  { name: 'mushrooms', label: '🍄 Mushrooms' },
  { name: 'spinach', label: '🥬 Spinach' },
  { name: 'lemon', label: '🍋 Lemon' },
  { name: 'avocado', label: '🥑 Avocado' },
];

export default function IngredientInput({ selectedIngredients, setSelectedIngredients }) {
  const [inputValue, setInputValue] = useState('');
  const tagsContainerRef = useRef(null);

  const addIngredient = (name) => {
    const clean = name.trim().toLowerCase();
    if (!clean) return;

    if (!selectedIngredients.includes(clean)) {
      setSelectedIngredients([...selectedIngredients, clean]);
      if (tagsContainerRef.current) {
        gsap.fromTo(
          tagsContainerRef.current,
          { scale: 0.99 },
          { scale: 1, duration: 0.25, ease: 'back.out(2)' }
        );
      }
    }
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && selectedIngredients.length > 0) {
      // Remove last tag on backspace if input is empty
      setSelectedIngredients(selectedIngredients.slice(0, -1));
    }
  };

  const handleRemove = (ingredientToRemove) => {
    setSelectedIngredients(
      selectedIngredients.filter((ing) => ing !== ingredientToRemove)
    );
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel-elevated border border-white/10 mb-10 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 bg-rose-500/10 blur-3xl rounded-full" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" />
            <span>Smart Ingredient Intersect</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            What's In Your Pantry Today?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add one or more ingredients — we'll calculate matching dishes and smart intersections!
          </p>
        </div>

        {selectedIngredients.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-auto flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All ({selectedIngredients.length})</span>
          </button>
        )}
      </div>

      {/* Input Field */}
      <div className="relative flex items-center mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient and press Enter (e.g., chicken, garlic, rice)..."
          className="w-full py-4 pl-5 pr-28 rounded-2xl bg-[#0e1019] border border-white/15 focus:border-amber-400 text-white placeholder-slate-400 text-base font-medium shadow-inner focus:outline-none transition-colors"
        />
        <button
          onClick={() => addIngredient(inputValue)}
          disabled={!inputValue.trim()}
          className="absolute right-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md disabled:opacity-40 disabled:pointer-events-none hover:scale-105 active:scale-95 transition"
        >
          <span className="flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </span>
        </button>
      </div>

      {/* Selected Tags Tray */}
      <div
        ref={tagsContainerRef}
        className="flex flex-wrap items-center gap-2 min-h-[44px] p-3 rounded-2xl bg-white/[0.02] border border-white/5 mb-6"
      >
        {selectedIngredients.length === 0 ? (
          <p className="text-xs text-slate-400 italic px-2">
            No ingredients in your tray. Tap popular items below or type your own!
          </p>
        ) : (
          selectedIngredients.map((ingredient) => (
            <span
              key={ingredient}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm animate-in fade-in zoom-in-95 duration-200"
            >
              <span className="capitalize">{ingredient}</span>
              <button
                onClick={() => handleRemove(ingredient)}
                className="w-4 h-4 rounded-full bg-white/10 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center transition"
                aria-label={`Remove ${ingredient}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Popular Quick-Add Pantry Items */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Add Popular Pantry Staples</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {POPULAR_PANTRY_ITEMS.map((item) => {
            const isSelected = selectedIngredients.includes(item.name);
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isSelected) {
                    handleRemove(item.name);
                  } else {
                    addIngredient(item.name);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200 flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                    : 'bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 border-white/10 hover:border-amber-400/40 hover:scale-102'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <X className="w-3 h-3 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
