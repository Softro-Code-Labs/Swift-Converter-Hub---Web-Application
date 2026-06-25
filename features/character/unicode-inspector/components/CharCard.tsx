'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';
import type { CharInfo } from '../types/unicodeInspector';

interface CharCardProps {
  info: CharInfo;
  highlight: boolean;
}

// What to display in the glyph box for invisible/control chars
function GlyphDisplay({ info }: { info: CharInfo }) {
  if (info.isInvisible || info.category === 'control') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-0.5">
        <span className="text-[9px] font-bold text-red-400 dark:text-red-500 leading-none">
          {info.hex}
        </span>
        <span className="text-[8px] text-red-300 dark:text-red-600 leading-none">
          invisible
        </span>
      </div>
    );
  }
  if (info.category === 'space' && info.codePoint !== 0x20) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-0.5">
        <span className="text-lg">␣</span>
        <span className="text-[8px] text-teal-400 leading-none">space</span>
      </div>
    );
  }
  return (
    <span className="text-2xl leading-none select-none" aria-hidden>
      {info.char}
    </span>
  );
}

export function CharCard({ info, highlight }: CharCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(info.char);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const isProblematic = info.isInvisible || info.category === 'control';

  return (
    <div
      className={`group relative flex flex-col rounded-xl border transition-all duration-150 overflow-hidden
        ${
          highlight
            ? 'border-violet-400 ring-2 ring-violet-400/30 shadow-sm'
            : isProblematic
              ? 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-300 dark:hover:border-violet-700'
        }`}
    >
      {/* Glyph box */}
      <div
        className={`flex items-center justify-center h-14 border-b
        ${
          isProblematic
            ? 'border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20'
            : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
        }`}
      >
        <GlyphDisplay info={info} />
      </div>

      {/* Info */}
      <div className="px-2 py-1.5 space-y-1 flex-1">
        {/* Code point */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] font-black font-mono text-violet-600 dark:text-violet-400">
            {info.hex}
          </span>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-300 hover:text-violet-500 cursor-pointer transition-all"
            title="Copy character"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Name */}
        <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 min-h-[24px]">
          {info.name}
        </p>

        {/* Category badge */}
        <CategoryBadge category={info.category} small />
      </div>
    </div>
  );
}
