interface OutputFormatSelectorProps {
  formats: string[];
  selected: string;
  onChange: (format: string) => void;
}

export const OutputFormatSelector = ({
  formats,
  selected,
  onChange,
}: OutputFormatSelectorProps) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
      Output format
    </p>
    <div className="flex gap-2">
      {formats.map((fmt) => (
        <button
          key={fmt}
          onClick={() => onChange(fmt)}
          className={`flex-1 py-2 rounded-xl border text-xs font-black uppercase cursor-pointer transition-all
            ${
              selected === fmt
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'
            }`}
        >
          {fmt}
        </button>
      ))}
    </div>
  </div>
);
