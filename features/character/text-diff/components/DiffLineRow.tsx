import type { DiffLine } from '../types/textDiff';

interface DiffLineRowProps {
  line: DiffLine;
  showLineNumbers: boolean;
}

const TYPE_STYLES: Record<DiffLine['type'], string> = {
  added: 'bg-emerald-50 dark:bg-emerald-950/30 border-l-2 border-emerald-400',
  removed: 'bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400',
  unchanged: 'bg-white dark:bg-slate-900 border-l-2 border-transparent',
  modified: 'bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400',
};

const LINE_NUM_STYLES: Record<DiffLine['type'], string> = {
  added: 'text-emerald-400 dark:text-emerald-600',
  removed: 'text-red-400 dark:text-red-600',
  unchanged: 'text-slate-300 dark:text-slate-600',
  modified: 'text-amber-400 dark:text-amber-600',
};

const PREFIX: Record<DiffLine['type'], string> = {
  added: '+',
  removed: '-',
  unchanged: ' ',
  modified: '~',
};

export function DiffLineRow({ line, showLineNumbers }: DiffLineRowProps) {
  const isPlaceholder = line.lineNumber === null && line.content === '';

  return (
    <div
      className={`flex min-h-[1.75rem] ${TYPE_STYLES[line.type]} ${isPlaceholder ? 'opacity-40' : ''}`}
    >
      {/* Prefix symbol */}
      <span
        className={`select-none px-2 text-[11px] font-bold font-mono leading-7 shrink-0 w-5 text-center
        ${LINE_NUM_STYLES[line.type]}`}
      >
        {isPlaceholder ? '' : PREFIX[line.type]}
      </span>

      {/* Line number */}
      {showLineNumbers && (
        <span
          className={`select-none px-2 text-[11px] font-mono leading-7 shrink-0 w-10 text-right border-r border-slate-100 dark:border-slate-800
          ${LINE_NUM_STYLES[line.type]}`}
        >
          {line.lineNumber ?? ''}
        </span>
      )}

      {/* Content */}
      <span className="px-3 text-xs font-mono leading-7 whitespace-pre-wrap break-all text-slate-700 dark:text-slate-300 flex-1">
        {isPlaceholder ? '\u00A0' : line.content || '\u00A0'}
      </span>
    </div>
  );
}
