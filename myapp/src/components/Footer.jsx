import React from 'react';
import { ChefHat, Heart, Sparkles, Utensils, Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0c0d14] relative overflow-hidden text-slate-400">
      {/* Subtle top glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5">
                <div className="w-full h-full bg-[#0c0d14] rounded-[10px] flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">QuickChef</span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Elevating daily home cooking into an interactive culinary art. Explore international cuisines, reduce food waste with smart pantry filtering, and discover world-class recipes.
            </p>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>TheMealDB API Online</span>
              </span>
              <span>•</span>
              <span>Powered by GSAP & React</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <a href="#pantry" className="hover:text-amber-400 transition">
                  🍳 Pantry Recipe Finder
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-amber-400 transition">
                  🍱 Category Collections
                </a>
              </li>
              <li>
                <a href="#cuisines" className="hover:text-amber-400 transition">
                  🌍 Global Cuisines
                </a>
              </li>
              <li>
                <a href="#roulette" className="hover:text-amber-400 transition">
                  🎲 Chef's Culinary Roulette
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Tips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Mindful Cooking
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Cooking with existing kitchen staples helps prevent millions of pounds of annual food waste while saving money.
            </p>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-amber-300/80">
              Tip: Save your favorite dishes to access them offline during meal prep!
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} QuickChef. Handcrafted with passion for home chefs everywhere.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
            <span>and culinary joy.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

