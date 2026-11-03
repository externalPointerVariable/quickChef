import React, { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import {
  X,
  Heart,
  Share2,
  Printer,
  Clock,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Youtube,
  Utensils,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { filterMealById } from '../services/index.js';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function RecipeDetail({
  recipeId,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onShowToast,
}) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'steps' | 'video'
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isInteractiveMode, setIsInteractiveMode] = useState(true);

  // Kitchen Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  // Fetch Recipe Details
  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        const mealDetails = await filterMealById(recipeId);
        if (isMounted) {
          if (mealDetails) {
            setDetails(mealDetails);
          } else {
            setError('Recipe details not found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch details error:', err);
          setError('Failed to load recipe details.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [recipeId]);

  // GSAP Entrance
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    if (backdropRef.current) {
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    }
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      onShowToast?.({ message: '⏰ Kitchen timer finished!', type: 'sparkle' });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, onShowToast]);

  const handleClose = () => {
    if (modalRef.current && backdropRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.92,
        opacity: 0,
        y: 15,
        duration: 0.25,
        ease: 'power2.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const getIngredients = useCallback((meal) => {
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        list.push({
          id: i,
          name: ingredient.trim(),
          measure: measure?.trim() || '',
        });
      }
    }
    return list;
  }, []);

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast?.({ message: 'Recipe link copied to clipboard!', type: 'success' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // YouTube Embed Helper
  const getEmbedYoutubeUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const ingredientsList = details ? getIngredients(details) : [];
  const instructionsList = details
    ? (details.strInstructions || '')
        .split(/(?:\r?\n)+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 5)
    : [];

  const embedUrl = details ? getEmbedYoutubeUrl(details.strYoutube) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md opacity-0 transition-opacity"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#12141f] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 z-10"
      >
        {isLoading && (
          <div className="p-16 flex items-center justify-center">
            <LoadingSpinner text="Plating the recipe..." />
          </div>
        )}

        {error && (
          <div className="p-12 text-center">
            <p className="text-rose-400 font-semibold mb-4">{error}</p>
            <button
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm"
            >
              Close
            </button>
          </div>
        )}

        {!isLoading && !error && details && (
          <>
            {/* Modal Header Banner */}
            <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0">
              <img
                src={details.strMealThumb}
                alt={details.strMeal}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141f] via-[#12141f]/60 to-black/40" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition hover:scale-105"
                aria-label="Close recipe"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Top Floating Action Buttons */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <button
                  onClick={() => onToggleFavorite?.(details)}
                  className={`px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center space-x-1.5 text-xs font-semibold border transition ${
                    isFavorite
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-black/50 text-white hover:bg-black/80 border-white/20'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Favorited' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/80 border border-white/20 flex items-center space-x-1.5 text-xs font-semibold transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="hidden sm:flex px-3.5 py-1.5 rounded-full backdrop-blur-md bg-black/50 text-white hover:bg-black/80 border border-white/20 items-center space-x-1.5 text-xs font-semibold transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

              {/* Title & Metadata in Banner */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {details.strCategory && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      {details.strCategory}
                    </span>
                  )}
                  {details.strArea && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/15 backdrop-blur-md">
                      🌍 {details.strArea} Cuisine
                    </span>
                  )}
                  {details.strTags && (
                    <span className="text-xs text-slate-400 font-medium hidden md:inline">
                      Tags: {details.strTags.split(',').join(', ')}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {details.strMeal}
                </h2>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="px-6 border-b border-white/10 bg-[#151725] flex items-center justify-between shrink-0">
              <div className="flex space-x-1 sm:space-x-4">
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'ingredients'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Ingredients ({ingredientsList.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('steps')}
                  className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
                    activeTab === 'steps'
                      ? 'border-amber-400 text-amber-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Cooking Steps</span>
                </button>

                {embedUrl && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`py-3.5 px-3 text-sm font-semibold border-b-2 transition flex items-center space-x-2 ${
                      activeTab === 'video'
                        ? 'border-rose-400 text-rose-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-rose-500" />
                    <span>Video Tutorial</span>
                  </button>
                )}
              </div>

              {/* Mini Kitchen Timer Display in tab bar */}
              <div className="hidden sm:flex items-center space-x-2 py-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs font-bold text-slate-300">
                  {formatTimer(timerSeconds)}
                </span>
                {timerSeconds > 0 && (
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1 rounded bg-white/10 text-xs hover:bg-white/20"
                    title={isTimerRunning ? 'Pause timer' : 'Start timer'}
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                )}
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: INGREDIENTS CHECKLIST */}
              {activeTab === 'ingredients' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Interactive Ingredient Checklist</h3>
                      <p className="text-xs text-slate-400">
                        Check off each item as you measure and prepare it in your kitchen.
                      </p>
                    </div>

                    <div className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
                      {Object.values(checkedIngredients).filter(Boolean).length} / {ingredientsList.length} prepped
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {ingredientsList.map((ing, idx) => {
                      const isChecked = !!checkedIngredients[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleIngredientCheck(idx)}
                          className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer select-none ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-400 line-through'
                              : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-emerald-400 shrink-0">
                              {isChecked ? (
                                <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500" />
                              )}
                            </div>
                            <span className={`text-sm font-medium ${isChecked ? 'opacity-60' : ''}`}>
                              {ing.name}
                            </span>
                          </div>

                          {ing.measure && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 shrink-0 ml-2">
                              {ing.measure}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: STEP-BY-STEP INSTRUCTIONS */}
              {activeTab === 'steps' && (
                <div className="space-y-6">
                  {/* Mode Toggle & Timer Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#161826] border border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-300">View:</span>
                      <button
                        onClick={() => setIsInteractiveMode(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          isInteractiveMode
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Step-by-Step
                      </button>
                      <button
                        onClick={() => setIsInteractiveMode(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          !isInteractiveMode
                            ? 'bg-amber-500 text-slate-950 shadow'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        Full Recipe
                      </button>
                    </div>

                    {/* Integrated Kitchen Timer Controls */}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Quick Timer:</span>
                      {[3, 5, 10, 15].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setTimerSeconds(mins * 60);
                            setIsTimerRunning(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 text-xs font-medium border border-white/10 transition"
                        >
                          +{mins}m
                        </button>
                      ))}

                      {timerSeconds > 0 && (
                        <button
                          onClick={() => {
                            setTimerSeconds(0);
                            setIsTimerRunning(false);
                          }}
                          className="p-1 text-slate-400 hover:text-rose-400"
                          title="Reset timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Interactive Step-by-Step Viewer */}
                  {isInteractiveMode && instructionsList.length > 0 ? (
                    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
                      {/* Step Progress Indicator */}
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>
                          Step {currentStepIndex + 1} of {instructionsList.length}
                        </span>
                        <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                            style={{
                              width: `${((currentStepIndex + 1) / instructionsList.length) * 100}%`,
                            }}
                          />
                        </div>
                        <span>
                          {Math.round(((currentStepIndex + 1) / instructionsList.length) * 100)}%
                        </span>
                      </div>

                      {/* Current Step Content */}
                      <div className="min-h-[140px] flex items-center">
                        <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium">
                          {instructionsList[currentStepIndex]}
                        </p>
                      </div>

                      {/* Navigation Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <button
                          disabled={currentStepIndex === 0}
                          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Step</span>
                        </button>

                        {currentStepIndex < instructionsList.length - 1 ? (
                          <button
                            onClick={() =>
                              setCurrentStepIndex((prev) =>
                                Math.min(instructionsList.length - 1, prev + 1)
                              )
                            }
                            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition"
                          >
                            <span>Next Step</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <Sparkles className="w-4 h-4" />
                            <span>Bon Appétit! Dish Ready</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Full Instructions List */
                    <div className="space-y-4">
                      {instructionsList.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex space-x-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition"
                        >
                          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-sm flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: VIDEO TUTORIAL */}
              {activeTab === 'video' && embedUrl && (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
                    <iframe
                      src={embedUrl}
                      title={details.strMeal}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    Follow along with the official step-by-step video demonstration.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
