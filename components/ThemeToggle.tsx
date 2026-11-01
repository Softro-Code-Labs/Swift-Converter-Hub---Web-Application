'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // resolvedTheme is unknown during SSR; render a same-size placeholder.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) return <div className="h-9 w-9" aria-hidden />;

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      data-tour="theme-toggle"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark
            ? 'rotate-90 scale-50 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
        aria-hidden
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-50 opacity-0'
        }`}
        aria-hidden
      />
    </button>
  );
}
