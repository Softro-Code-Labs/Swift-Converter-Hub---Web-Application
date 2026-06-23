import type { RegexFlag, RegexFlagMeta } from '../types/regexTester';

interface FlagToggleProps {
  meta: RegexFlagMeta;
  active: boolean;
  onToggle: (flag: RegexFlag) => void;
}

export function FlagToggle({ meta, active, onToggle }: FlagToggleProps) {
  return (
    <button
      onClick={() => onToggle(meta.flag)}
      title={meta.title}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400'
        }`}
    >
      <span className="text-[13px] leading-none">{meta.flag}</span>
      <span className="text-[10px] font-sans font-semibold opacity-75 hidden sm:inline">
        {meta.label}
      </span>
    </button>
  );
}
