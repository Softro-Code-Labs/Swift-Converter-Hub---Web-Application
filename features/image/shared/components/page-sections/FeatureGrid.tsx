interface FeatureGridItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  title: string;
  items: FeatureGridItem[];
  accentColor?: string;
}

const ACCENT_HOVER: Record<string, string> = {
  'bg-blue-500':
    'hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-950/40',
  'bg-emerald-500':
    'hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/40',
  'bg-purple-500':
    'hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 group-hover:bg-purple-100 dark:group-hover:bg-purple-950/40',
  'bg-amber-500':
    'hover:border-amber-200 dark:hover:border-amber-900/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/10 group-hover:bg-amber-100 dark:group-hover:bg-amber-950/40',
};

export const FeatureGrid = ({
  title,
  items,
  accentColor = 'bg-emerald-500',
}: FeatureGridProps) => {
  const hoverClasses =
    ACCENT_HOVER[accentColor] ?? ACCENT_HOVER['bg-emerald-500'];

  return (
    <section>
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span className={`w-1 h-4 rounded-full ${accentColor} inline-block`} />
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((feature, idx) => (
          <div
            key={idx}
            className={`group flex gap-4 p-4 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl transition-all duration-200 ${hoverClasses}`}
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg transition-colors">
              {feature.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
