'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800" />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 transition-all duration-200 active:scale-90 cursor-pointer overflow-hidden"
    >
      {/* Sun icon */}
      <Sun
        className={`absolute w-4 h-4 text-amber-500 transition-all duration-300
          ${
            isDark
              ? 'opacity-0 scale-50 rotate-90'
              : 'opacity-100 scale-100 rotate-0'
          }`}
      />

      {/* Moon icon */}
      <Moon
        className={`absolute w-4 h-4 text-blue-400 transition-all duration-300
          ${
            isDark
              ? 'opacity-100 scale-100 rotate-0'
              : 'opacity-0 scale-50 -rotate-90'
          }`}
      />
    </button>
  );
}
