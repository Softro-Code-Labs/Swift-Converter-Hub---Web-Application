import { icons, type LucideIcon } from 'lucide-react';

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

export const FeatureGrid = ({ title, items }: FeatureGridProps) => (
  <section>
    <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
      {title}
    </h2>
    <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
      {items.map((feature, idx) => {
        const Icon = (icons[feature.icon as keyof typeof icons] ||
          icons.CircleQuestionMark) as LucideIcon;
        return (
          <li key={idx} className="flex gap-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Icon className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);
