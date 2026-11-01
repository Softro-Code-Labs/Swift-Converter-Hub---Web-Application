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
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
    >
      <span className="text-[13px] leading-none">{meta.flag}</span>
      <span className="text-xs font-sans font-semibold opacity-75 hidden sm:inline">
        {meta.label}
      </span>
    </button>
  );
}
