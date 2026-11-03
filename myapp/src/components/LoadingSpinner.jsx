import React from 'react';
import { ChefHat, Sparkles } from 'lucide-react';

export default function LoadingSpinner({ text = 'Preparing culinary inspiration...' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center">
      <div className="relative mb-5">
        {/* Pulsing glow background */}
        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse" />
        
        {/* Outer spinning ring */}
        <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin" />
        
        {/* Center chef hat */}
        <div className="absolute inset-0 flex items-center justify-center text-amber-400">
          <ChefHat className="w-7 h-7 animate-bounce" />
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-200 tracking-wide flex items-center space-x-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>{text}</span>
      </p>
      <p className="text-xs text-slate-500 mt-1">Sourcing fresh recipes from TheMealDB</p>
    </div>
  );
}
