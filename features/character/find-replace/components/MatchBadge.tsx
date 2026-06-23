interface MatchBadgeProps {
  count: number;
  error: string | null;
  hasFind: boolean;
}

export function MatchBadge({ count, error, hasFind }: MatchBadgeProps) {
  if (error) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
        Invalid regex
      </span>
    );
  }
  if (!hasFind) return null;
  if (count === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
        No matches
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
      {count} {count === 1 ? 'match' : 'matches'}
    </span>
  );
}
