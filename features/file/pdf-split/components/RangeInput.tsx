import { AlertCircle } from 'lucide-react';
import { validateRangeString } from '../hooks/usePdfSplit';

interface RangeInputProps {
  value: string;
  onChange: (v: string) => void;
  pageCount: number;
}

export function RangeInput({ value, onChange, pageCount }: RangeInputProps) {
  const isTyping = /[-,]\s*$/.test(value);
  const error =
    value.trim() && !isTyping ? validateRangeString(value, pageCount) : null;

  const pages =
    value.trim() && !isTyping && !error
      ? value.split(',').reduce((s, p) => {
          const trimmed = p.trim();
          if (!trimmed) return s;
          const parts = trimmed
            .split('-')
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
          if (parts.length === 2) return s + Math.abs(parts[1] - parts[0]) + 1;
          if (parts.length === 1) return s + 1;
          return s;
        }, 0)
      : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Page range
        </label>
        {pages > 0 && !error && (
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tabular-nums">
            ~{pages} pages selected
          </span>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`e.g. 1-3, 5, 7-${Math.min(9, pageCount)}`}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all
          ${
            error
              ? 'border-red-300 dark:border-red-700 focus:ring-red-400/30'
              : 'border-slate-200 dark:border-slate-700 focus:ring-blue-400/30'
          }`}
      />
      {error && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-500 font-semibold">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}
      <p className="text-[10px] text-slate-400 dark:text-slate-500">
        Use commas to separate pages or ranges:{' '}
        <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">
          1-3, 5, 8-10
        </code>
      </p>
    </div>
  );
}
