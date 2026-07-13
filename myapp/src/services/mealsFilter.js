import config from '../config/config.js';

const filterMealsByIngredients = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) return [];

  try {
    const results = await Promise.all(
      ingredients.map((ingredient) =>
        fetch(`${config.mealDbEndpoint}/filter.php?i=${encodeURIComponent(ingredient)}`)
          .then((res) => res.json())
          .then((data) => data.meals || [])
      )
    );

    // Find common recipes (intersection)
    const commonMeals = results.reduce((acc, curr) =>
      acc.filter((meal) =>
        curr.some((m) => m.idMeal === meal.idMeal)
      )
    );

    return commonMeals;

  } catch (error) {
    console.error('Error filtering meals:', error);
    return [];
  }
};

const filterMealByCategory = async (categoryName) => {
  try {    
    const res = await fetch(`${config.mealDbEndpoint}/filter.php?c=${encodeURIComponent(categoryName)}`);
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering meals by category: ${error.message}`);
    return null;
  }
};

const filterMealByCuisine = async (countryName) => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/filter.php?a=${encodeURIComponent(countryName)}`);
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering meals by cuisine: ${error.message}`);
    return null;
  }
};

const filterMealById = async (mealID) => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/lookup.php?i=${encodeURIComponent(mealID)}`);
    const data = await res.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error(`Error fetching meal by ID: ${error.message}`);
    return null;
  }
};

export {
  filterMealsByIngredients,
  filterMealByCategory,
  filterMealByCuisine,
  filterMealById,
};