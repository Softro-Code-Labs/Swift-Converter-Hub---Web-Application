import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Highlight } from './Highlight';
import type { StudioTool, StudioGroup } from '../types/studio';

interface StudioSearchResultProps {
  tool: StudioTool;
  query: string;
  groups: StudioGroup[];
}

export function StudioSearchResult({
  tool,
  query,
  groups,
}: StudioSearchResultProps) {
  const {
    icon: Icon,
    title,
    desc,
    color,
    accentBorder,
    accentText,
    href,
    status,
    group,
  } = tool;
  const isLive = status === 'live';
  const groupMeta = groups.find((g) => g.id === group);

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
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3
            className={`text-sm font-bold text-slate-800 dark:text-slate-200 ${isLive ? accentText : ''} transition-colors`}
          >
            <Highlight text={title} query={query} />
          </h3>
          {groupMeta && (
            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400">
              {groupMeta.label}
            </span>
          )}
          {!isLive && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
              Soon
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <Highlight text={desc} query={query} />
        </p>
      </div>
      {isLive ? (
        <ArrowRight className="w-3.5 h-3.5 text-slate-200 dark:text-slate-700 shrink-0 self-center group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
      ) : null}
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
