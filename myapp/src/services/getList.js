import config from '../config/config.js';

const getIngredientsList = async () => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/list.php?i=list`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ingredients list: ${error}`);
    return null;
  }
};

const getCategoryList = async () => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/categories.php`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching category list: ${error}`);
    return null;
  }
};

const getCuisineList = async () => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/list.php?a=list`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching cuisine list: ${error}`);
    return null;
  }
};

const getRandomMeal = async () => {
  try {
    const res = await fetch(`${config.mealDbEndpoint}/random.php`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching random meal: ${error}`);
    return null;
  }
};

export {
  getCategoryList,
  getIngredientsList,
  getCuisineList,
  getRandomMeal,
};