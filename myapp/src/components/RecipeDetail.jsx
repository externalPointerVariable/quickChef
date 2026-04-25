import React, { useState, useEffect, useCallback } from 'react';
import { filterMealById } from '../services/index.js';
import LoadingSpinner from './LoadingSpinner.jsx';

const ModalLayout = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={onClose}
  >
    <div
      className="bg-white/80 backdrop-blur-xl border border-white/30 
      rounded-2xl shadow-2xl max-w-4xl w-full p-6 md:p-8 
      transform transition-all duration-300 scale-95 animate-[fadeIn_0.3s_ease-out_forwards]"
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
        <div className="text-red-500 p-8 text-center">{error}</div>
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
      

      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-gray-800 leading-tight">
          {details.strMeal}
        </h2>

        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>


      <div className="flex flex-col md:flex-row gap-8">


        <div className="md:w-1/3 flex-shrink-0">
          <img
            src={details.strMealThumb}
            alt={details.strMeal}
            className="w-full h-auto rounded-xl shadow-lg object-cover transition duration-500 hover:scale-[1.02]"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300';
            }}
          />


          <div className="flex flex-wrap gap-2 text-sm mt-4">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 
            rounded-full border border-indigo-200 backdrop-blur-sm">
              {details.strCategory}
            </span>

            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 
            rounded-full border border-indigo-200 backdrop-blur-sm">
              {details.strArea}
            </span>

            {details.strYoutube && (
              <a
                href={details.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-red-500/10 text-red-600 
                rounded-full border border-red-200 hover:bg-red-500/20 transition"
              >
                Watch →
              </a>
            )}
          </div>
        </div>


        <div className="md:w-2/3 overflow-y-auto max-h-[70vh] pr-2">


          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Ingredients
          </h3>

          <ul className="ml-5 space-y-2 text-gray-700">
            {ingredientsList.map((ing, index) => (
              <li key={index}>{ing}</li>
            ))}
          </ul>


          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
            Instructions
          </h3>

          <ol className="ml-5 space-y-4 text-gray-700 leading-relaxed">
            {instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

      </div>
    </ModalLayout>
  );
}

export default RecipeDetail;