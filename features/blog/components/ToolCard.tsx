import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { TOOLS, getStudio } from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';

/**
 * "Try it" card that links an article to a real tool. Reads the tool's name,
 * description, icon and studio colour from config/tools.ts, so it stays in
 * sync with the rest of the site.
 */
export function ToolCard({ toolId, cta = 'Open the tool' }: { toolId: string; cta?: string }) {
  const tool = TOOLS.find((t) => t.id === toolId);
  if (!tool) {
    throw new Error(`ToolCard: unknown tool id "${toolId}"`);
  }
  const studio = getStudio(tool.studio);
  const accent = STUDIO_ACCENT[tool.studio];
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className={`group my-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900 ${accent.hoverBorder}`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accent.tile}`}
      >
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] text-slate-500 dark:text-slate-400">
          {studio.name}
        </span>
        <span className="block font-display text-lg font-bold text-slate-900 dark:text-white">
          {tool.title}
        </span>
        <span className="mt-0.5 block text-[15px] leading-snug text-slate-600 dark:text-slate-400">
          {tool.desc}
        </span>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
          Runs on your device - nothing is uploaded
        </span>
      </span>
      <span
        className={`hidden shrink-0 items-center gap-1 text-[15px] font-semibold sm:inline-flex ${accent.text}`}
      >
        {cta}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
