import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ChefHat, Heart, Dices, Menu, X, Sparkles } from 'lucide-react';

export default function Header({ favoritesCount, onOpenFavorites, onTriggerRoulette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoRef = useRef(null);
  const heartBadgeRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate heart badge when favorites count increases
  useEffect(() => {
    if (favoritesCount > 0 && heartBadgeRef.current) {
      gsap.fromTo(
        heartBadgeRef.current,
        { scale: 1.5, rotate: -15 },
        { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }, [favoritesCount]);

  const handleLogoHover = () => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotate: 12,
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const navLinks = [
    { name: 'Pantry Finder', href: '#pantry', icon: '🍳' },
    { name: 'Categories', href: '#categories', icon: '🍱' },
    { name: 'World Cuisines', href: '#cuisines', icon: '🌍' },
    { name: "Chef's Roulette", href: '#roulette', icon: '🎲' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0d13]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          onMouseEnter={handleLogoHover}
          className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
        >
          <div
            ref={logoRef}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-amber-500/25 transition-transform duration-300 group-hover:scale-105"
          >
            <div className="w-full h-full bg-[#0c0d14] rounded-[14px] flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                QuickChef
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Culinary Discovery Engine
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-1.5"
            >
              <span className="text-sm">{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold transition group shadow-sm"
            aria-label="View saved recipes"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20 group-hover:fill-rose-400 transition" />
            <span>Saved</span>
            {favoritesCount > 0 && (
              <span
                ref={heartBadgeRef}
                className="ml-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[11px] font-bold text-white leading-none shadow-sm"
              >
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Quick Roulette Button */}
          <a
            href="#roulette"
            onClick={onTriggerRoulette}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Dices className="w-4 h-4" />
            <span>Surprise Me</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center space-x-2">
          <button
            onClick={onOpenFavorites}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-white"
            aria-label="View saved recipes"
          >
            <Heart className="w-5 h-5 text-rose-400" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold flex items-center justify-center text-white">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-3 pb-6 bg-[#12141e] border-b border-white/10 mt-2 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/[0.03] text-sm font-semibold text-slate-200 hover:bg-white/10"
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#roulette"
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerRoulette?.();
              }}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-md"
            >
              <Dices className="w-5 h-5" />
              <span>Surprise Dish Generator</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
