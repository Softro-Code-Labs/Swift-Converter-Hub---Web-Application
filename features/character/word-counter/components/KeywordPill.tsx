export function KeywordPill({
  word,
  count,
  max,
}: {
  word: string;
  count: number;
  max: number;
}) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-2 py-1.5 px-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex-1 truncate">
        {word}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-400 dark:bg-rose-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-slate-400 tabular-nums w-4 text-right">
          {count}
        </span>
      </div>
    </div>
  );
}
