import type { MatchRange } from '../types/findReplace';

interface HighlightedTextProps {
  text: string;
  matches: MatchRange[];
  activeMatch: number; // index of focused match (-1 = none)
}

export function HighlightedText({
  text,
  matches,
  activeMatch,
}: HighlightedTextProps) {
  if (!text) {
    return (
      <p className="text-sm text-slate-300 dark:text-slate-600 italic">
        Your text with highlights appears here…
      </p>
    );
  }

  if (matches.length === 0) {
    return (
      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed break-words">
        {text}
      </p>
    );
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  matches.forEach(({ start, end }, i) => {
    // Text before this match
    if (start > cursor) {
      parts.push(
        <span key={`t-${i}`} className="text-slate-700 dark:text-slate-300">
          {text.slice(cursor, start)}
        </span>,
      );
    }
    // The match itself
    const isActive = i === activeMatch;
    parts.push(
      <mark
        key={`m-${i}`}
        className={`rounded-sm px-0.5 transition-colors
          ${
            isActive
              ? 'bg-amber-400 dark:bg-amber-500 text-slate-900'
              : 'bg-amber-200 dark:bg-amber-900/60 text-slate-800 dark:text-amber-200'
          }`}
      >
        {text.slice(start, end)}
      </mark>,
    );
    cursor = end;
  });

  // Remaining text
  if (cursor < text.length) {
    parts.push(
      <span key="t-end" className="text-slate-700 dark:text-slate-300">
        {text.slice(cursor)}
      </span>,
    );
  }

  return (
    <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">
      {parts}
    </p>
  );
}
