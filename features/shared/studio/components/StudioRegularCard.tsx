import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Highlight } from './Highlight';
import type { StudioTool } from '../types/studio';

export function StudioRegularCard({
  tool,
  query,
}: {
  tool: StudioTool;
  query: string;
}) {
  const {
    icon: Icon,
    title,
    desc,
    color,
    accentBorder,
    accentText,
    href,
    status,
  } = tool;
  const isLive = status === 'live';

  const inner = (
    <div
      className={`group flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200
      ${
        isLive
          ? `cursor-pointer ${accentBorder} hover:shadow-md hover:-translate-y-0.5`
          : 'cursor-default opacity-60'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <h3
          className={`text-sm font-bold text-slate-800 dark:text-slate-200 ${isLive ? accentText : ''} transition-colors`}
        >
          <Highlight text={title} query={query} />
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          <Highlight text={desc} query={query} />
        </p>
      </div>
      {isLive ? (
        <ArrowRight className="w-3.5 h-3.5 text-slate-200 dark:text-slate-700 shrink-0 self-center group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
      ) : (
        <span className="shrink-0 self-center inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
          Soon
        </span>
      )}
    </div>
  );

  return isLive ? (
    <Link href={href} className="block">
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}
