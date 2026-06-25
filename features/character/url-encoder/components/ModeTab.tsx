import type { ToolMode } from '../types/urlEncoder';
import { ArrowLeftRight, Unplug } from 'lucide-react';

interface ModeTabProps {
  value: ToolMode;
  onChange: (v: ToolMode) => void;
}

const TABS: {
  id: ToolMode;
  label: string;
  icon: React.ElementType;
  hint: string;
}[] = [
  {
    id: 'encode-decode',
    label: 'Encode / Decode',
    icon: ArrowLeftRight,
    hint: 'Encode or decode URL strings',
  },
  {
    id: 'parse',
    label: 'Parse URL',
    icon: Unplug,
    hint: 'Break a URL into its components',
  },
];

export function ModeTab({ value, onChange }: ModeTabProps) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
      {TABS.map(({ id, label, icon: Icon, hint }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          title={hint}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              value === id
                ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
