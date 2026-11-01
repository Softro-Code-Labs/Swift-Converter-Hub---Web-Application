interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  icon: React.ElementType;
  label?: string;
}

export function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  icon: Icon,
  label,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'
        }
        disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label && <span>{label}</span>}
    </button>
  );
}
