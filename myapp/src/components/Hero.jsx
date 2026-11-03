import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Search,
  Sparkles,
  ArrowRight,
  Utensils,
  Globe2,
  Clock,
  Flame,
  CheckCircle2,
  Dices,
} from 'lucide-react';
import { searchMealByName } from '../services/index.js';

export default function Hero({ onSelectRecipe, onTriggerRoulette }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const heroContainerRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchBarRef = useRef(null);
  const floatingBadge1 = useRef(null);
  const floatingBadge2 = useRef(null);
  const floatingBadge3 = useRef(null);
  const statsRef = useRef(null);
  const dropdownRef = useRef(null);

  // GSAP Entrance Timeline & Floating animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(
          searchBarRef.current,
          { y: 25, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(
          statsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        );

      // Continuous gentle floating animations for badges
      if (floatingBadge1.current) {
        gsap.to(floatingBadge1.current, {
          y: -12,
          rotation: 1.5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
      if (floatingBadge2.current) {
        gsap.to(floatingBadge2.current, {
          y: -15,
          rotation: -2,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }
      if (floatingBadge3.current) {
        gsap.to(floatingBadge3.current, {
          y: -10,
          rotation: 1,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1,
        });
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // Debounced search for live dish search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchMealByName(searchQuery);
        setSearchResults(results.slice(0, 6));
        setShowDropdown(true);
      } catch (e) {
        console.error('Search error:', e);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mouse parallax tilt on background glow
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const xPos = (clientX / window.innerWidth - 0.5) * 40;
    const yPos = (clientY / window.innerHeight - 0.5) * 40;

    gsap.to('.hero-ambient-glow', {
      x: xPos,
      y: yPos,
      duration: 1.2,
      ease: 'power1.out',
    });
  };

  return (
    <section
      ref={heroContainerRef}
      onMouseMove={handleMouseMove}
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Dynamic ambient gradient glow orbs */}
      <div className="hero-ambient-glow pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/15 blur-[120px] rounded-full" />
      <div className="hero-ambient-glow pointer-events-none absolute top-40 right-10 w-[350px] h-[350px] bg-amber-500/10 blur-[100px] rounded-full" />
      <div className="hero-ambient-glow pointer-events-none absolute top-40 left-10 w-[350px] h-[350px] bg-rose-500/10 blur-[100px] rounded-full" />

      {/* Subtle background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Culinary Badges */}
        <div
          ref={floatingBadge1}
          className="hidden lg:flex absolute top-12 left-6 items-center space-x-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-amber-300 shadow-xl border border-amber-500/20"
        >
          <span className="text-base">🥑</span>
          <span>Zero Food Waste</span>
        </div>

        <div
          ref={floatingBadge2}
          className="hidden lg:flex absolute top-16 right-8 items-center space-x-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-rose-300 shadow-xl border border-rose-500/20"
        >
          <span className="text-base">⏱️</span>
          <span>Fast & Easy Recipes</span>
        </div>

        <div
          ref={floatingBadge3}
          className="hidden xl:flex absolute bottom-8 left-16 items-center space-x-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-semibold text-emerald-300 shadow-xl border border-emerald-500/20"
        >
          <span className="text-base">🌍</span>
          <span>30+ Global Cuisines</span>
        </div>

        {/* Eyebrow Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Recipe Assistant</span>
        </div>

        {/* Main Headline */}
        <h1
          ref={headlineRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]"
        >
          Turn Whatever is in Your Kitchen Into a{' '}
          <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
            Michelin-Grade Feast
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Combine ingredients you already have, travel across world cuisines, or spin the culinary roulette to discover your next unforgettable meal.
        </p>

        {/* Live Search Bar & Autocomplete */}
        <div ref={searchBarRef} className="mt-10 max-w-2xl mx-auto relative z-30">
          <div className="relative group" ref={dropdownRef}>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-30 blur-md group-hover:opacity-60 transition duration-300" />
            
            <div className="relative flex items-center bg-[#131520] border border-white/15 rounded-2xl shadow-2xl overflow-hidden focus-within:border-amber-400 transition-colors">
              <div className="pl-4 text-slate-400 group-focus-within:text-amber-400 transition-colors">
                <Search className="w-5 h-5" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                placeholder="Search any dish name (e.g. Lasagna, Curry, Tacos, Brownies)..."
                className="w-full py-4 pl-3 pr-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-base font-medium"
              />

              {isSearching ? (
                <div className="pr-4">
                  <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="pr-4 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              ) : null}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#141624] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto text-left divide-y divide-white/5">
                <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-white/[0.02]">
                  Matching Recipes ({searchResults.length})
                </div>
                {searchResults.map((dish) => (
                  <button
                    key={dish.idMeal}
                    onClick={() => {
                      onSelectRecipe(dish.idMeal);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center space-x-3.5 px-4 py-3 hover:bg-white/[0.06] transition text-left group"
                  >
                    <img
                      src={dish.strMealThumb}
                      alt={dish.strMeal}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://placehold.co/100x100/181b28/f59e0b?text=Dish';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white group-hover:text-amber-400 transition truncate">
                        {dish.strMeal}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-400">
                        {dish.strCategory && <span>{dish.strCategory}</span>}
                        {dish.strArea && <span>• {dish.strArea}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transform group-hover:translate-x-1 transition shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick CTA Anchors */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-slate-400">Or jump straight to:</span>
            <a
              href="#pantry"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg glass-pill text-amber-300 font-medium hover:text-white transition"
            >
              <span>🍳 Pantry Search</span>
            </a>
            <a
              href="#categories"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg glass-pill text-orange-300 font-medium hover:text-white transition"
            >
              <span>🍱 Curated Categories</span>
            </a>
            <a
              href="#roulette"
              onClick={onTriggerRoulette}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg glass-pill text-rose-300 font-medium hover:text-white transition"
            >
              <span>🎲 Chef's Roulette</span>
            </a>
          </div>
        </div>

        {/* Metrics Counter Bar */}
        <div
          ref={statsRef}
          className="mt-16 max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-3xl glass-panel"
        >
          <div className="p-3">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">10,000+</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Tested Recipes</p>
          </div>
          <div className="p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">100+</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Pantry Staples</p>
          </div>
          <div className="p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-rose-400">30+</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Global Cuisines</p>
          </div>
          <div className="p-3 border-l border-white/5">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</p>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Free to Cook</p>
          </div>
        </div>
      </div>
    </section>
  );
}

