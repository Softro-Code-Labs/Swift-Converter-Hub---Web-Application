import { Plus, Minus, Equal } from 'lucide-react';

interface DiffStatsBarProps {
  added: number;
  removed: number;
  unchanged: number;
}

export function DiffStatsBar({ added, removed, unchanged }: DiffStatsBarProps) {
  const total = added + removed + unchanged;
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-1.5">
        <Plus className="w-3 h-3 text-emerald-500" />
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {added} added
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Minus className="w-3 h-3 text-red-500" />
        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 tabular-nums">
          {removed} removed
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <Equal className="w-3 h-3 text-slate-400" />
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
          {unchanged} unchanged
        </span>
      </div>
      {/* Visual bar */}
      {total > 0 && (
        <div className="flex-1 min-w-24 h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex">
          <div
            className="bg-emerald-400 h-full transition-all duration-500"
            style={{ width: `${(added / total) * 100}%` }}
          />
          <div
            className="bg-red-400 h-full transition-all duration-500"
            style={{ width: `${(removed / total) * 100}%` }}
          />
          <div
            className="bg-slate-200 dark:bg-slate-700 h-full transition-all duration-500"
            style={{ width: `${(unchanged / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
