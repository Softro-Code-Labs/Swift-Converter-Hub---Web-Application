'use client';

import { useState } from 'react';
import { Copy, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { HASH_META } from '../types/hashGenerator';
import type { HashResult } from '../types/hashGenerator';

interface HashCardProps {
  result: HashResult;
}

export function HashCard({ result }: HashCardProps) {
  const [copied, setCopied] = useState(false);
  const meta = HASH_META[result.algorithm];

  const handleCopy = () => {
    if (!result.hex) return;
    navigator.clipboard.writeText(result.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-200
      ${
        result.status === 'done'
          ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
          : 'border-slate-100 dark:border-slate-800/50 bg-slate-50/60 dark:bg-slate-900/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
            {result.algorithm}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">
            {meta.bits}-bit · {meta.desc}
          </span>
          {meta.warning && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3 h-3" />
              {meta.warning}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!result.hex || result.status !== 'done'}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Hash output */}
      <div className="px-4 py-3 min-h-[52px] flex items-center">
        {result.status === 'computing' && (
          <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
        )}
        {result.status === 'done' && (
          <p className="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed select-all">
            {result.hex}
          </p>
        )}
        {result.status === 'error' && (
          <p className="text-xs text-red-500 font-mono">{result.error}</p>
        )}
        {result.status === 'idle' && (
          <p className="text-xs text-slate-300 dark:text-slate-600 italic">
            Enter text above to generate hash
          </p>
        )}
      </div>

      {/* Mobile warning */}
      {meta.warning && (
        <div className="sm:hidden flex items-center gap-1.5 px-4 py-2 border-t border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            {meta.warning}
          </span>
        </div>
      )}
    </div>
  );
}
