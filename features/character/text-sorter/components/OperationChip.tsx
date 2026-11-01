import type { Operation, OperationId } from '../types/textSorter';
import { X } from 'lucide-react';

interface OperationChipProps {
  op: Operation;
  active: boolean;
  onToggle: (id: OperationId) => void;
}

const GROUP_COLORS = {
  sort: 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
  filter:
    'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
  transform:
    'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
};

const GROUP_INACTIVE = {
  sort: 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
  filter:
    'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
  transform:
    'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400',
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
