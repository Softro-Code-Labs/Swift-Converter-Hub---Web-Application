import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface Breadcrumb {
  name: string;
  path: string;
}

interface Badge {
  label: string;
  color?: 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'teal';
}

interface FeaturePill {
  icon: LucideIcon;
  label: string;
}

interface ToolPageHeaderProps {
  /** Full breadcrumb chain including the current page - the last item renders as plain text. */
  breadcrumbs: Breadcrumb[];
  badges: Badge[];
  title: string;
  description: string;
  features: FeaturePill[];
}

const BADGE_CLASSES: Record<string, string> = {
  blue: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300',
  purple:
    'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
  emerald:
    'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  rose: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
  amber:
    'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
  cyan: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300',
  teal: 'bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
};

export function ToolPageHeader({
  breadcrumbs,
  badges,
  title,
  description,
  features,
}: ToolPageHeaderProps) {
  const linked = breadcrumbs.slice(0, -1);
  const current = breadcrumbs[breadcrumbs.length - 1];

  return (
    <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
      <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
        {linked.map((crumb) => (
          <span key={crumb.path} className="flex items-center gap-1.5">
            <Link
              href={crumb.path}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {crumb.name}
            </Link>
            <span>›</span>
          </span>
        ))}
        <span className="text-slate-600 dark:text-slate-300 font-medium">
          {current.name}
        </span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            {badges.map((badge, i) => (
              <span
                key={badge.label}
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-black ${BADGE_CLASSES[badge.color ?? 'blue']}`}
              >
                {i > 0 && (
                  <span className="mr-2 text-slate-300 dark:text-slate-600 font-normal">
                    +
                  </span>
                )}
                {badge.label}
              </span>
            ))}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
            >
              <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto pb-1">
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-400"
          >
            <Icon className="w-3 h-3 text-blue-500" />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
