import type { CaseOption } from '../types/caseConverter';
import type { CaseId } from '../types/caseConverter';

interface CaseButtonProps {
  option: CaseOption;
  active: boolean;
  onClick: (id: CaseId) => void;
}

export function CaseButton({ option, active, onClick }: CaseButtonProps) {
  return (
    <button
      onClick={() => onClick(option.id)}
      className={`group flex flex-col gap-1 p-3 rounded-xl border text-left cursor-pointer transition-all duration-150
        ${
          active
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
        }`}
    >
      <span
        className={`text-[11px] font-black tracking-wide leading-none
          ${active ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}
      >
        {option.label}
      </span>
      <span
        className={`text-[10px] font-mono leading-none truncate
          ${active ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}
      >
        {option.example}
      </span>
    </button>
  );
}
