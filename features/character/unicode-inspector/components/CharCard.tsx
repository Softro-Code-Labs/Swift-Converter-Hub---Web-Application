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
        <span className="text-[11px] font-bold text-red-400 dark:text-red-500 leading-none">
          {info.hex}
        </span>
        <span className="text-[10px] text-red-300 dark:text-red-600 leading-none">
          invisible
        </span>
      </div>
    );
  }
  if (info.category === 'space' && info.codePoint !== 0x20) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-0.5">
        <span className="text-lg">␣</span>
        <span className="text-[10px] text-teal-400 leading-none">space</span>
      </div>
    );
  }
  return (
    <span className="text-2xl leading-none select-none" aria-hidden>
      {info.char}
    </span>
  );
}

/**
 * Copy button for one character. Rendered as a sibling of the selectable
 * card (not inside it) so there is never a button nested in a button.
 */
export function CharCopyButton({
  char,
  label,
}: {
  char: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(char).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      title="Copy character"
      className="rounded p-1 text-slate-400 opacity-60 transition hover:text-blue-600 group-hover:opacity-100 focus-visible:opacity-100 dark:hover:text-blue-300"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function CharCard({ info, highlight }: CharCardProps) {
  const isProblematic = info.isInvisible || info.category === 'control';

  return (
    <div
      className={`group relative flex flex-col rounded-xl border transition-all duration-150 overflow-hidden
        ${
          highlight
            ? 'border-violet-400 ring-2 ring-violet-400/30 shadow-sm'
            : isProblematic
              ? 'border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700'
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
          <span className="pr-6 text-[13px] font-bold font-mono text-violet-600 dark:text-violet-400">
            {info.hex}
          </span>
        </div>

        {/* Name */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 min-h-[24px]">
          {info.name}
        </p>

        {/* Category badge */}
        <CategoryBadge category={info.category} small />
      </div>
    </div>
  );
}
