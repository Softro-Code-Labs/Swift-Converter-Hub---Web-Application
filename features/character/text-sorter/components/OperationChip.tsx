import type { Operation, OperationId } from '../types/textSorter';
import { X } from 'lucide-react';

interface OperationChipProps {
  op: Operation;
  active: boolean;
  onToggle: (id: OperationId) => void;
}

const GROUP_COLORS = {
  sort: 'border-teal-400 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300',
  filter:
    'border-sky-400 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',
  transform:
    'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
};

const GROUP_INACTIVE = {
  sort: 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-teal-300 dark:hover:border-teal-700 hover:text-teal-600 dark:hover:text-teal-400',
  filter:
    'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-sky-300 dark:hover:border-sky-700 hover:text-sky-600 dark:hover:text-sky-400',
  transform:
    'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400',
};

export function OperationChip({ op, active, onToggle }: OperationChipProps) {
  return (
    <button
      onClick={() => onToggle(op.id)}
      title={op.desc}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all
        ${
          active
            ? GROUP_COLORS[op.group]
            : `bg-white dark:bg-slate-900 ${GROUP_INACTIVE[op.group]}`
        }`}
    >
      <span>{op.icon}</span>
      <span>{op.label}</span>
      {active && <X className="w-3 h-3 opacity-60 ml-0.5" />}
    </button>
  );
}
