import config from '../config/config.js';

const filterMealsByIngredients = async (ingredientName) => {
  try {
    const url = `${config.mealDbEndpoint}/filter.php?i=${encodeURIComponent(ingredientName)}`;
    const res = await fetch(url);
    console.log(`${config.mealDbEndpoint}/filter.php?i=${encodeURIComponent(ingredientName)}`);
    console.log(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Received non-JSON response:', text);
      throw new Error('Invalid response format: expected JSON');
    }

    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering meals by ingredient: ${error.message}`);
    return null;
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