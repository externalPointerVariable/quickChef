import React, { useState } from 'react';
import {
  Header,
  Hero,
  RecipeDetail,
  FavoritesDrawer,
  Toast,
  Footer,
} from './components/index.js';
import {
  Ingredient,
  Categories,
  Cuisine,
  Random,
} from './pages/index.js';
import { useFavorites } from './hooks/useFavorites.js';

export default function App() {
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  } = useFavorites();

  const handleToggleFavorite = (meal) => {
    const added = toggleFavorite(meal);
    if (added) {
      setToast({
        message: `Saved "${meal.strMeal}" to your favorites ❤️`,
        type: 'heart',
      });
    } else {
      setToast({
        message: `Removed "${meal.strMeal}" from favorites`,
        type: 'info',
      });
    }
  };

  const handleShowToast = (toastObj) => {
    setToast(toastObj);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header */}
      <Header
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Visual Marvel Hero Section */}
        <Hero
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
        />

        {/* 1. Smart Pantry Ingredient Finder */}
        <Ingredient
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* 2. Visual Categories Showcase */}
        <Categories
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* 3. Global Cuisines Odyssey */}
        <Cuisine
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* 4. Chef's Culinary Roulette */}
        <Random
          onSelectRecipe={(id) => setSelectedRecipeId(id)}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onShowToast={handleShowToast}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Recipe Detail Modal */}
      {selectedRecipeId && (
        <RecipeDetail
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
          isFavorite={isFavorite(selectedRecipeId)}
          onToggleFavorite={handleToggleFavorite}
          onShowToast={handleShowToast}
        />
      )}

      {/* Saved Recipes Slide-over Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectRecipe={(id) => setSelectedRecipeId(id)}
        onRemoveFavorite={removeFavorite}
        onClearAll={clearAllFavorites}
      />

      {/* Toast Alert Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
