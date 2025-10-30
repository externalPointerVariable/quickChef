import React, { useState, useEffect, useCallback } from 'react';
import { filterMealById } from '../services/index.js';
import LoadingSpinner from './LoadingSpinner.jsx'; // Ensure this import exists

const ModalLayout = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-70 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 md:p-8 transform transition-all duration-300"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  </div>
);

function RecipeDetail({ recipeId, onClose }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const mealDetails = await filterMealById(recipeId);
        if (mealDetails) {
          setDetails(mealDetails);
        } else {
          setError('Recipe details not found.');
        }
      } catch (err) {
        console.error('Fetch details error:', err);
        setError('Failed to load recipe details. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [recipeId]);

  const getIngredients = useCallback((meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${measure?.trim() || ''} ${ingredient.trim()}`);
      }
    }
    return ingredients;
  }, []);

  if (isLoading) {
    return (
      <ModalLayout onClose={onClose}>
        <LoadingSpinner text="Loading Recipe Details..." />
      </ModalLayout>
    );
  }

  if (error) {
    return (
      <ModalLayout onClose={onClose}>
        <div className="text-red-600 p-8 text-center">{error}</div>
      </ModalLayout>
    );
  }

  if (!details) return null;

  const ingredientsList = getIngredients(details);
  const instructions = details.strInstructions
    ?.split('\r\n')
    .filter((line) => line.trim() !== '');

  return (
    <ModalLayout onClose={onClose}>
      <div className="flex justify-between items-start border-b pb-3 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-800">{details.strMeal}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={details.strMealThumb}
            alt={details.strMeal}
            className="w-full h-auto rounded-lg shadow-xl mb-4 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://placehold.co/400x300/D1D5DB/1F2937?text=No+Image';
            }}
          />
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-medium rounded-full">
              Category: {details.strCategory}
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-medium rounded-full">
              Area: {details.strArea}
            </span>
            {details.strYoutube && (
              <a
                href={details.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-red-100 text-red-800 font-medium rounded-full hover:bg-red-200 transition"
              >
                Watch Tutorial
              </a>
            )}
          </div>
        </div>

        <div className="md:w-2/3 overflow-y-auto max-h-[70vh] pb-8 pr-4">
          <h3 className="text-2xl font-bold text-gray-700 mb-3 border-b pb-1">Ingredients</h3>
          <ul className="list-disc ml-5 space-y-1 text-gray-600">
            {ingredientsList.map((ing, index) => (
              <li key={index} className="text-base">
                {ing}
              </li>
            ))}
          </ul>

          <h3 className="text-2xl font-bold text-gray-700 mt-6 mb-3 border-b pb-1">Instructions</h3>
          <ol className="list-decimal ml-5 space-y-3 text-gray-700">
            {instructions.map((step, index) => (
              <li key={index} className="text-base">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ModalLayout>
  );
}

export default RecipeDetail;