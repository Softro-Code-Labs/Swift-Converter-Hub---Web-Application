'use client';

import { ChevronDown, HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  title: string;
  items: FaqItem[];
  accentColor?: string;
}

const ACCENT_TEXT: Record<string, string> = {
  'bg-blue-500': 'text-blue-500 dark:text-blue-400',
  'bg-purple-500': 'text-purple-500 dark:text-purple-400',
  'bg-amber-500': 'text-amber-500 dark:text-amber-400',
  'bg-emerald-500': 'text-emerald-500 dark:text-emerald-400',
};

const ACCENT_BORDER: Record<string, string> = {
  'bg-blue-500':
    'border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/10',
  'bg-purple-500':
    'border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/10',
  'bg-amber-500':
    'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/10',
  'bg-emerald-500':
    'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/10',
};

export const FaqAccordion = ({
  title,
  items,
  accentColor = 'bg-blue-500',
}: FaqAccordionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const iconColor = ACCENT_TEXT[accentColor] ?? ACCENT_TEXT['bg-blue-500'];
  const openBorder = ACCENT_BORDER[accentColor] ?? ACCENT_BORDER['bg-blue-500'];

  return (
    <div className="px-6 pb-10 border-t border-slate-100 dark:border-slate-800 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span
            className={`flex items-center justify-center w-6 h-6 rounded-lg ${accentColor} bg-opacity-10 dark:bg-opacity-20`}
          >
            <HelpCircle className={`w-3.5 h-3.5 text-white/60`} />
          </span>
          {title}
        </h2>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
          {items.length} question{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((faq, idx) => {
          const isOpen = openFaq === idx;

          return (
            <div
              key={idx}
              className={`border rounded-xl overflow-hidden transition-all duration-200
                  ${
                    isOpen
                      ? openBorder
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? `rotate-180 ${iconColor}` : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-0">
                  <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
