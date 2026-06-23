import type { RegexMatch } from '../types/regexTester';

// Distinct purple shades cycling per match so overlapping matches are distinct
const MATCH_COLORS = [
  'bg-purple-200 dark:bg-purple-900/70 text-purple-900 dark:text-purple-100',
  'bg-violet-200 dark:bg-violet-900/70 text-violet-900 dark:text-violet-100',
  'bg-fuchsia-200 dark:bg-fuchsia-900/70 text-fuchsia-900 dark:text-fuchsia-100',
];

const ACTIVE_COLOR = 'bg-purple-400 dark:bg-purple-500 text-white';

interface RegexHighlightedTextProps {
  text: string;
  matches: RegexMatch[];
  activeMatch: number;
  onMatchClick: (index: number) => void;
}

export function RegexHighlightedText({
  text,
  matches,
  activeMatch,
  onMatchClick,
}: RegexHighlightedTextProps) {
  if (!text) {
    return (
      <p className="text-sm text-slate-300 dark:text-slate-600 italic">
        Test string appears here with matches highlighted…
      </p>
    );
  }

  if (matches.length === 0) {
    return (
      <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed break-words font-mono">
        {text}
      </p>
    );
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  matches.forEach((match, i) => {
    if (match.start > cursor) {
      parts.push(
        <span key={`t-${i}`} className="text-slate-700 dark:text-slate-300">
          {text.slice(cursor, match.start)}
        </span>,
      );
    }

    const isActive = i === activeMatch;
    const colorClass = isActive
      ? ACTIVE_COLOR
      : MATCH_COLORS[i % MATCH_COLORS.length];

    parts.push(
      <mark
        key={`m-${i}`}
        onClick={() => onMatchClick(i)}
        title={`Match ${i + 1}: "${match.fullMatch}"`}
        className={`rounded px-0.5 cursor-pointer transition-colors ${colorClass}`}
      >
        {text.slice(match.start, match.end)}
      </mark>,
    );

    cursor = match.end;
  });

  if (cursor < text.length) {
    parts.push(
      <span key="t-end" className="text-slate-700 dark:text-slate-300">
        {text.slice(cursor)}
      </span>,
    );
  }

  return (
    <p className="text-sm whitespace-pre-wrap leading-relaxed break-words font-mono">
      {parts}
    </p>
  );
}
