interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  large?: boolean;
}

export function StatCard({
  label,
  value,
  sub,
  accent = 'text-slate-900 dark:text-white',
  large,
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {label}
      </span>
      <span
        className={`font-black tabular-nums leading-none block max-w-full break-words ${accent} ${
          large
            ? 'text-4xl'
            : String(value).length > 12
              ? 'text-sm'
              : String(value).length > 8
                ? 'text-lg'
                : 'text-2xl'
        }`}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
          {sub}
        </span>
      )}
    </div>
  );
}
