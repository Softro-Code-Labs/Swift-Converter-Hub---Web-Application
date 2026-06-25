import type { CharCategory } from '../types/unicodeInspector';

const STYLES: Record<CharCategory, string> = {
  letter:
    'bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300',
  digit: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
  punctuation:
    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  symbol:
    'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
  space: 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300',
  invisible: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300',
  emoji: 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300',
  control:
    'bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300',
  other: 'bg-slate-100 dark:bg-slate-800 text-slate-500',
};

const LABELS: Record<CharCategory, string> = {
  letter: 'Letter',
  digit: 'Digit',
  punctuation: 'Punct',
  symbol: 'Symbol',
  space: 'Space',
  invisible: 'Invisible',
  emoji: 'Emoji',
  control: 'Control',
  other: 'Other',
};

interface CategoryBadgeProps {
  category: CharCategory;
  small?: boolean;
}

export function CategoryBadge({ category, small }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-bold rounded-md
      ${STYLES[category]}
      ${small ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'}
    `}
    >
      {LABELS[category]}
    </span>
  );
}
