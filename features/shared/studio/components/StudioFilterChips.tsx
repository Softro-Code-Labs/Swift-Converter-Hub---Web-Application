import type { StudioGroup } from '../types/studio';

interface StudioFilterChipsProps {
  groups: StudioGroup[];
  activeGroup: string;
  toolCount: (id: string) => number;
  onChange: (id: string) => void;
}

function Chip({
  label,
  count,
  active,
  dot,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  dot?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-slate-800 dark:border-slate-200 bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-300'
        }`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white dark:bg-slate-900' : dot}`}
        />
      )}
      {label}
      <span
        className={`text-[10px] tabular-nums ${active ? 'opacity-70' : 'text-slate-300 dark:text-slate-600'}`}
      >
        {count}
      </span>
    </button>
  );
}

export function StudioFilterChips({
  groups,
  activeGroup,
  toolCount,
  onChange,
}: StudioFilterChipsProps) {
  const total = groups.reduce((sum, g) => sum + toolCount(g.id), 0);
  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      <Chip
        label="All tools"
        count={total}
        active={activeGroup === 'all'}
        onClick={() => onChange('all')}
      />
      {groups.map(({ id, label, dot }) => (
        <Chip
          key={id}
          label={label}
          count={toolCount(id)}
          active={activeGroup === id}
          dot={dot}
          onClick={() => onChange(activeGroup === id ? 'all' : id)}
        />
      ))}
    </div>
  );
}
