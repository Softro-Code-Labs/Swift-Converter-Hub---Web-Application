import type { SheetMeta } from '../types/excelJson';

interface SheetTabsProps {
  sheets: SheetMeta[];
  activeSheet: number;
  onChange: (index: number) => void;
}

export function SheetTabs({ sheets, activeSheet, onChange }: SheetTabsProps) {
  if (sheets.length <= 1) return null;

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {sheets.map((sheet, i) => (
        <button
          key={sheet.name}
          onClick={() => onChange(i)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0
            ${
              activeSheet === i
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 bg-white dark:bg-slate-900'
            }`}
        >
          {sheet.name}
          <span
            className={`text-[9px] tabular-nums
            ${activeSheet === i ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}
          >
            {sheet.rowCount}r
          </span>
        </button>
      ))}
    </div>
  );
}
