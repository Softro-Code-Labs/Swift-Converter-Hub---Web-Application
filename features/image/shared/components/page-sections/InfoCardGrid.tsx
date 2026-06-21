'use client';

import { useState } from 'react';
import { TrendingDown } from 'lucide-react';

interface InfoCard {
  title: string;
  desc: string;
  meta?: string;
  highlight?: string;
}

interface InfoCardGridProps {
  title: string;
  cards: InfoCard[];
  accentColor?: string;
  columns?: string;
  variant?: 'plain' | 'card';
}

// Maps a bg-{color}-500 accent class to matching hover border + text colors
const ACCENT_HOVER: Record<string, string> = {
  'bg-blue-500':
    'hover:border-blue-200 dark:hover:border-blue-900/60 hover:bg-blue-50/40 dark:hover:bg-blue-950/10',
  'bg-purple-500':
    'hover:border-purple-200 dark:hover:border-purple-900/60 hover:bg-purple-50/40 dark:hover:bg-purple-950/10',
  'bg-amber-500':
    'hover:border-amber-200 dark:hover:border-amber-900/60 hover:bg-amber-50/40 dark:hover:bg-amber-950/10',
  'bg-emerald-500':
    'hover:border-emerald-200 dark:hover:border-emerald-900/60 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10',
  'bg-cyan-500':
    'hover:border-cyan-200 dark:hover:border-cyan-900/60 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/10',
  'bg-rose-500':
    'hover:border-rose-200 dark:hover:border-rose-900/60 hover:bg-rose-50/40 dark:hover:bg-rose-950/10',
};

export const InfoCardGrid = ({
  title,
  cards,
  accentColor = 'bg-blue-500',
  columns = 'grid-cols-1 sm:grid-cols-3',
  variant = 'card',
}: InfoCardGridProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoverClasses = ACCENT_HOVER[accentColor] ?? ACCENT_HOVER['bg-blue-500'];

  return (
    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span className={`w-1 h-4 rounded-full ${accentColor} inline-block`} />
        {title}
      </h2>

      <div className={`grid ${columns} gap-3`}>
        {cards.map((card, idx) => (
          <div
            key={card.title}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={
              variant === 'card'
                ? `relative p-3.5 rounded-xl border transition-all duration-200 cursor-default
                   ${
                     hoveredIdx === idx
                       ? `${hoverClasses} shadow-sm`
                       : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30'
                   }`
                : 'space-y-1 py-1'
            }
          >
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
              {card.title}
            </p>

            {card.meta && (
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                {card.meta}
              </p>
            )}

            {card.desc && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {card.desc}
              </p>
            )}

            {card.highlight && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="w-3 h-3 text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {card.highlight}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
