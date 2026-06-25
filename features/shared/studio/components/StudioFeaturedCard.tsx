import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Highlight } from './Highlight';
import type { StudioTool } from '../types/studio';

export function StudioFeaturedCard({
  tool,
  query,
}: {
  tool: StudioTool;
  query: string;
}) {
  const { icon: Icon, title, desc, color, accentBorder, href, status } = tool;
  const isLive = status === 'live';

  const inner = (
    <div
      className={`group relative flex flex-col gap-4 p-5 rounded-2xl border-2 bg-white dark:bg-slate-900 transition-all duration-200 h-full
      ${
        isLive
          ? `border-slate-100 dark:border-slate-800 cursor-pointer ${accentBorder} hover:border-2 hover:shadow-lg hover:-translate-y-1`
          : 'border-slate-100 dark:border-slate-800 cursor-default opacity-60'
      }`}
    >
      {!isLive && (
        <div className="absolute top-3.5 right-3.5">
          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            Soon
          </span>
        </div>
      )}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1.5 flex-1">
        <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-snug pr-16">
          <Highlight text={title} query={query} />
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <Highlight text={desc} query={query} />
        </p>
      </div>
      {isLive && (
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors">
          Open tool{' '}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </div>
  );

  return isLive ? (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full">{inner}</div>
  );
}
