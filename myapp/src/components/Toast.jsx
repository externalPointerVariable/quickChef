import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, Heart, Check, Info } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  const toastRef = useRef(null);

  useEffect(() => {
    if (!toast) return;

    const el = toastRef.current;
    if (!el) return;

    // GSAP entrance
    gsap.fromTo(
      el,
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }
    );

    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      gsap.to(el, {
        y: 20,
        opacity: 0,
        scale: 0.95,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: onDismiss,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const getIcon = () => {
    if (toast.type === 'heart') {
      return <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />;
    }
    if (toast.type === 'sparkle') {
      return <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />;
    }
    if (toast.type === 'success') {
      return <Check className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
    return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        ref={toastRef}
        className="pointer-events-auto flex items-center space-x-3 px-5 py-3.5 rounded-2xl glass-panel-elevated border border-white/15 text-white shadow-2xl backdrop-blur-xl"
        role="status"
        aria-live="polite"
      >
        {getIcon()}
        <span className="text-sm font-medium tracking-wide">{toast.message}</span>
      </div>
    </div>
  );
}

