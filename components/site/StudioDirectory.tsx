import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { STUDIOS, getStudioTools } from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';

/** Compact list of all studios - used on About and the 404 page. */
export function StudioDirectory() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {STUDIOS.map((s) => {
        const Icon = s.icon;
        const accent = STUDIO_ACCENT[s.id];
        return (
          <li key={s.id}>
            <Link
              href={s.href}
              className={cn(
                'group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors dark:border-slate-800 dark:bg-slate-900',
                accent.hoverBorder,
              )}
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  accent.tile,
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-slate-900 dark:text-white">
                  {s.name}
                </span>
                <span className="block truncate text-[13px] text-slate-500 dark:text-slate-400">
                  {getStudioTools(s.id).length} tools - {s.handles}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
