import type { JsonStats } from '../types/jsonFormatter';

interface JsonStatsPanelProps {
  stats: JsonStats;
  inputSize: number;
}

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-[10px] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span
        className={`text-[10px] font-bold tabular-nums ${accent ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}
      >
        {value}
      </span>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function JsonStatsPanel({ stats, inputSize }: JsonStatsPanelProps) {
  const savings =
    inputSize > 0 ? Math.round((1 - stats.minifiedSize / inputSize) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-cyan-50/60 dark:bg-cyan-950/20">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            Valid JSON
          </p>
        </div>
      </div>

      <div className="px-4 py-2">
        {/* Structure */}
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 mt-1">
          Structure
        </p>
        <StatRow
          label="Objects"
          value={stats.objects.toLocaleString()}
          accent
        />
        <StatRow label="Arrays" value={stats.arrays.toLocaleString()} accent />
        <StatRow label="Keys" value={stats.keys.toLocaleString()} />
        <StatRow label="Max depth" value={stats.maxDepth} />

        {/* Value types */}
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 mt-3">
          Values
        </p>
        <StatRow label="Strings" value={stats.strings.toLocaleString()} />
        <StatRow label="Numbers" value={stats.numbers.toLocaleString()} />
        <StatRow label="Booleans" value={stats.booleans.toLocaleString()} />
        <StatRow label="Nulls" value={stats.nulls.toLocaleString()} />

        {/* Size */}
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-1 mt-3">
          Size
        </p>
        <StatRow label="Pretty" value={formatBytes(stats.size)} />
        <StatRow label="Minified" value={formatBytes(stats.minifiedSize)} />
        {savings > 0 && (
          <StatRow label="Minify saves" value={`${savings}%`} accent />
        )}
      </div>
    </div>
  );
}
