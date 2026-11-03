import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'quickchef_favorite_recipes_v1';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  const isFavorite = (idMeal) => {
    return favorites.some((item) => String(item.idMeal) === String(idMeal));
  };

  const toggleFavorite = (meal) => {
    if (!meal || !meal.idMeal) return false;
    const exists = isFavorite(meal.idMeal);
    if (exists) {
      setFavorites((prev) => prev.filter((item) => String(item.idMeal) !== String(meal.idMeal)));
      return false; // removed
    } else {
      const itemToSave = {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strMealThumb: meal.strMealThumb,
        strCategory: meal.strCategory || '',
        strArea: meal.strArea || '',
      };
      setFavorites((prev) => [itemToSave, ...prev]);
      return true; // added
    }
  };

  const removeFavorite = (idMeal) => {
    setFavorites((prev) => prev.filter((item) => String(item.idMeal) !== String(idMeal)));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  };
}

