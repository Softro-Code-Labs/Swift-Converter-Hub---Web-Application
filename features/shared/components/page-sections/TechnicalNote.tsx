'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';

interface TechnicalNoteProps {
  title: string;
  paragraphs: string[];
  accentColor?: string;
  collapsible?: boolean;
}

const ACCENT_ICON: Record<string, string> = {
  'bg-blue-500': 'text-blue-500 dark:text-blue-400',
  'bg-purple-500': 'text-purple-500 dark:text-purple-400',
  'bg-amber-500': 'text-amber-500 dark:text-amber-400',
  'bg-emerald-500': 'text-emerald-500 dark:text-emerald-400',
};

export const TechnicalNote = ({
  title,
  paragraphs,
  accentColor = 'bg-emerald-500',
  collapsible = false,
}: TechnicalNoteProps) => {
  const [isOpen, setIsOpen] = useState(!collapsible);
  const iconColor = ACCENT_ICON[accentColor] ?? ACCENT_ICON['bg-emerald-500'];

  return (
    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
      <div className="relative bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 overflow-hidden border border-slate-100 dark:border-slate-800/60">
        {/* Subtle decorative accent */}
        <div
          className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${accentColor} opacity-[0.06] blur-2xl`}
        />

        <button
          onClick={() => collapsible && setIsOpen((p) => !p)}
          className={`relative w-full flex items-center justify-between gap-3 ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!collapsible}
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span
              className={`flex items-center justify-center w-6 h-6 rounded-lg ${accentColor} bg-opacity-10 dark:bg-opacity-20`}
            >
              <Sparkles className={`w-3.5 h-3.5 text-white/60`} />
            </span>
            {title}
          </h2>
          {collapsible && (
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? `rotate-180 ${iconColor}` : ''}`}
            />
          )}
        </button>

        {isOpen && (
          <div className="relative space-y-2.5 mt-3">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
