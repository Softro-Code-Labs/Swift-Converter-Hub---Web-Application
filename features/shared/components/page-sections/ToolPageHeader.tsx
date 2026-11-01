import Link from 'next/link';
import { ChevronRight, ShieldCheck, type LucideIcon } from 'lucide-react';
import { getStudio, toolForPath } from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';

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
  /** Kept for compatibility; the tool's icon now identifies the tool instead. */
  badges?: Badge[];
  title: string;
  description: string;
  features?: FeaturePill[];
  /** Optional element shown under the description (e.g. format chips). */
  children?: React.ReactNode;
}

/**
 * The one header used by every tool page: breadcrumb trail, tool identity
 * (icon in the studio's colour), what the tool does, and what you can count
 * on. Studio and icon are looked up from the tool registry by URL.
 */
export function ToolPageHeader({
  breadcrumbs,
  title,
  description,
  features = [],
  children,
}: ToolPageHeaderProps) {
  const linked = breadcrumbs.slice(0, -1);
  const current = breadcrumbs[breadcrumbs.length - 1];
  const tool = toolForPath(current.path);
  const accent = tool ? STUDIO_ACCENT[tool.studio] : STUDIO_ACCENT.image;
  const Icon = tool?.icon;
  const studio = tool ? getStudio(tool.studio) : undefined;

  // Drop "100% private"-style pills: privacy is stated once, consistently.
  const shown = features.filter(
    (f) => !/private|privacy|never leave|no upload|stay/i.test(f.label),
  );

  return (
    <header className="border-b border-slate-200 px-5 pb-6 pt-5 sm:px-8 sm:pt-6 dark:border-slate-800">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1 text-[13px] text-slate-500 dark:text-slate-400">
          {linked.map((crumb) => (
            <li key={crumb.path} className="flex items-center gap-1">
              <Link
                href={crumb.path}
                className="rounded hover:text-slate-900 hover:underline underline-offset-4 dark:hover:text-white"
              >
                {crumb.name === 'Character Studio' && studio
                  ? studio.name
                  : crumb.name}
              </Link>
              <ChevronRight
                className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600"
                aria-hidden
              />
            </li>
          ))}
          <li
            aria-current="page"
            className="font-medium text-slate-700 dark:text-slate-200"
          >
            {current.name}
          </li>
        </ol>
      </nav>

      <div className="flex items-start gap-4">
        {Icon && (
          <span
            className={cn(
              'hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:flex',
              accent.tile,
            )}
          >
            <Icon className="h-6 w-6" aria-hidden />
          </span>
        )}
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-[1.75rem] font-bold leading-tight text-slate-900 sm:text-[2rem] dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            {description}
          </p>
          {children}
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Runs on your device - nothing is uploaded
            </li>
            {shown.map(({ icon: FIcon, label }) => (
              <li key={label} className="flex items-center gap-1.5">
                <FIcon
                  className="h-4 w-4 text-slate-400 dark:text-slate-500"
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
