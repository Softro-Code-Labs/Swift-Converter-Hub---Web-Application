'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { STUDIOS } from './Navbar';

const ROTATE_MS = 3400;
const FADE_MS = 220;
const emptySubscribe = () => () => {};

export default function StudioSpotlight() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // SSR-safe read of prefers-reduced-motion, matching the mounted-flag
  // pattern already used in ThemeToggle.tsx (avoids setState-in-effect).
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const reduceMotion =
    mounted && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % STUDIOS.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const studio = STUDIOS[index];
  const Icon = studio.icon;

  return (
    <Link
      href={studio.href}
      aria-label={`${studio.hook} - open ${studio.name}`}
      className="group flex w-full lg:w-auto items-center justify-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm hover:-translate-y-px transition-all duration-200"
    >
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors duration-700 group-hover:scale-105 ${studio.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </span>

      <span
        aria-live="polite"
        className={`text-[13px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 whitespace-nowrap transition-all ease-out ${
          visible
            ? 'opacity-100 translate-y-0 duration-300'
            : 'opacity-0 -translate-y-1 duration-150'
        }`}
      >
        {studio.hook}
      </span>

      <span className="flex items-center gap-1 pl-0.5" aria-hidden>
        {STUDIOS.map((s, i) => (
          <span
            key={s.name}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index
                ? `w-3 ${studio.dot}`
                : 'w-1 bg-slate-300 dark:bg-slate-700'
            }`}
          />
        ))}
      </span>
    </Link>
  );
}
