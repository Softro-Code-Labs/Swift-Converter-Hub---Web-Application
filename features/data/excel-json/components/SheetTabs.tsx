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
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 hover:text-blue-600 bg-white dark:bg-slate-900'
            }`}
        >
          {sheet.name}
          <span
            className={`text-[11px] tabular-nums
            ${activeSheet === i ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'}`}
          >
            {sheet.rowCount}r
          </span>
        </button>
      ))}
    </div>
  );
}
