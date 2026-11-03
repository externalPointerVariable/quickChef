import config from '../config/config.js';

/**
 * Filter meals by one or more ingredients.
 * Handles single or multiple ingredients with parallel lookup & smart intersection.
 */
const filterMealsByIngredients = async (ingredients) => {
  try {
    const list = Array.isArray(ingredients)
      ? ingredients.map((i) => i.trim().toLowerCase()).filter(Boolean)
      : [String(ingredients).trim().toLowerCase()].filter(Boolean);

    if (list.length === 0) return [];

    if (list.length === 1) {
      const url = `${config.mealDbEndpoint}/filter.php?i=${encodeURIComponent(list[0])}`;
      const res = await fetch(url);
      const data = await res.json();
      return (data.meals || []).map((meal) => ({
        ...meal,
        matchCount: 1,
        totalIngredients: 1,
      }));
    }

    // Multiple ingredients: query each ingredient in parallel
    const responses = await Promise.all(
      list.map(async (ing) => {
        try {
          const res = await fetch(
            `${config.mealDbEndpoint}/filter.php?i=${encodeURIComponent(ing)}`
          );
          const data = await res.json();
          return data.meals || [];
        } catch (e) {
          console.error(`Failed to fetch for ingredient ${ing}:`, e);
          return [];
        }
      })
    );

    const mealMap = new Map();
    const countMap = new Map();

    responses.forEach((meals) => {
      meals.forEach((meal) => {
        if (!mealMap.has(meal.idMeal)) {
          mealMap.set(meal.idMeal, meal);
          countMap.set(meal.idMeal, 0);
        }
        countMap.set(meal.idMeal, countMap.get(meal.idMeal) + 1);
      });
    });

    const exactMatches = [];
    const partialMatches = [];

    mealMap.forEach((meal, id) => {
      const matchCount = countMap.get(id);
      const enriched = {
        ...meal,
        matchCount,
        totalIngredients: list.length,
      };

      if (matchCount === list.length) {
        exactMatches.push(enriched);
      } else {
        partialMatches.push(enriched);
      }
    });

    // If exact matches exist for ALL ingredients, return them
    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // Otherwise, return partial matches sorted by highest match count first
    partialMatches.sort((a, b) => b.matchCount - a.matchCount);
    return partialMatches;
  } catch (error) {
    console.error(`Error filtering meals by ingredient: ${error.message}`);
    return [];
  }
};

const filterMealByCategory = async (categoryName) => {
  try {
    const res = await fetch(
      `${config.mealDbEndpoint}/filter.php?c=${encodeURIComponent(categoryName)}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering meals by category: ${error.message}`);
    return [];
  }
};

const filterMealByCuisine = async (countryName) => {
  try {
    const res = await fetch(
      `${config.mealDbEndpoint}/filter.php?a=${encodeURIComponent(countryName)}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error filtering meals by cuisine: ${error.message}`);
    return [];
  }
};

const filterMealById = async (mealID) => {
  try {
    const res = await fetch(
      `${config.mealDbEndpoint}/lookup.php?i=${encodeURIComponent(mealID)}`
    );
    const data = await res.json();
    return data.meals?.[0] || null;
  } catch (error) {
    console.error(`Error fetching meal by ID: ${error.message}`);
    return null;
  }
};

const searchMealByName = async (query) => {
  try {
    if (!query || !query.trim()) return [];
    const res = await fetch(
      `${config.mealDbEndpoint}/search.php?s=${encodeURIComponent(query.trim())}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error(`Error searching meals by name: ${error.message}`);
    return [];
  }
};

export {
  filterMealsByIngredients,
  filterMealByCategory,
  filterMealByCuisine,
  filterMealById,
  searchMealByName,
};
