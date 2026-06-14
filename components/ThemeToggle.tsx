'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export default function ThemeToggle({
  variant = 'default',
  className = '',
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const variantStyles = {
    default: 'px-4 py-2.5 min-w-[110px]',
    compact: 'p-2.5',
  };

  return (
    <button
      type="button"
      aria-label="Toggle Color Theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={clsx(
        'group relative flex items-center justify-center gap-2 rounded-xl border',
        'active:scale-90 cursor-pointer overflow-hidden select-none outline-none',
        'bg-slate-100/60 border-slate-200/80 text-slate-800 hover:bg-slate-200/40 hover:border-slate-300',
        'dark:bg-slate-900/40 dark:border-blue-950/40 dark:text-slate-200 dark:hover:bg-slate-900/80 dark:hover:border-blue-900/60',
        'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        variantStyles[variant],
        className,
      )}
    >
      {/* 1. VISUAL WAVE AURA RIPPLE BACKGROUND */}
      <div
        className={clsx(
          'absolute inset-0 z-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] scale-0 rounded-full',
          'bg-gradient-to-tr from-amber-500/10 via-orange-500/5 to-transparent dark:from-blue-600/10 dark:via-cyan-500/5',
          isDark ? 'scale-[2.5]' : 'scale-0',
        )}
      />

      {/* 2. DYNAMIC CELESTIAL ICON STACK */}
      <div className="relative z-10 h-5 w-5 flex items-center justify-center pointer-events-none">
        {!mounted ? (
          <div className="h-5 w-5 rounded-full border border-dashed border-slate-300 dark:border-slate-700 animate-spin" />
        ) : (
          <div className="relative w-full h-full">
            {/* SUN LAYOVER */}
            <div
              className={clsx(
                'absolute inset-0 flex items-center justify-center transition-all duration-500',
                'ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu',
                isDark
                  ? 'opacity-0 scale-50 -rotate-90 -translate-y-4'
                  : 'opacity-100 scale-100 rotate-0 translate-y-0',
              )}
            >
              <Sun
                size={19}
                className="text-amber-500 fill-amber-500/20 stroke-[2.2] drop-shadow-[0_0_4px_rgba(245,158,11,0.4)] group-hover:rotate-45 transition-transform duration-700 ease-out"
              />

              {/* Dynamic Sun Rays Particles */}
              <span className="absolute h-1 w-1 rounded-full bg-amber-400 -top-1 left-2.5 opacity-0 group-hover:opacity-100 group-hover:-top-2 transition-all duration-300 delay-75" />
              <span className="absolute h-1 w-1 rounded-full bg-orange-400 -bottom-1 left-2.5 opacity-0 group-hover:opacity-100 group-hover:-bottom-2 transition-all duration-300 delay-100" />
            </div>

            {/* MOON LAYOVER */}
            <div
              className={clsx(
                'absolute inset-0 flex items-center justify-center transition-all duration-500',
                'ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu',
                isDark
                  ? 'opacity-100 scale-100 rotate-0 translate-y-0'
                  : 'opacity-0 scale-50 rotate-90 translate-y-4',
              )}
            >
              <Moon
                size={18}
                className="text-blue-400 fill-blue-500/10 stroke-[2.2] drop-shadow-[0_0_6px_rgba(96,165,250,0.3)] group-hover:-rotate-12 transition-transform duration-700 ease-out"
              />

              {/* Stars/Sparkle Micro-particles for Dark Mode */}
              <span className="absolute top-0 right-0 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-60" />
              <span className="absolute bottom-1 left-0 w-1 h-1 bg-cyan-300 rounded-full scale-50 opacity-40 animate-ping" />
            </div>
          </div>
        )}
      </div>

      {/* 3. SLIDING TEXT STACK */}
      {variant === 'default' && (
        <div className="relative z-10 h-4 overflow-hidden pointer-events-none min-w-[42px] text-left">
          <div
            className={clsx(
              'flex flex-col font-bold text-[11px] uppercase tracking-wider transition-transform duration-500',
              'ease-[cubic-bezier(0.34,1.56,0.64,1)]',
              isDark ? '-translate-y-4' : 'translate-y-0',
            )}
          >
            <span className="h-4 flex items-center text-slate-600 dark:text-slate-400 font-extrabold">
              {!mounted ? '•••' : 'Dark'}
            </span>
            <span className="h-4 flex items-center text-amber-600 dark:text-blue-400 font-extrabold">
              {!mounted ? '•••' : 'Light'}
            </span>
          </div>
        </div>
      )}

      {/* 4. HOVER INNER GLOW ANCHOR */}
      <div className="absolute inset-0 border border-transparent group-hover:border-blue-500/10 rounded-xl transition-colors pointer-events-none z-20" />
    </button>
  );
}
