'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { ModeTab } from './ModeTab';
import { EncodeDecodePanel } from './EncodeDecodePanel';
import { UrlParserPanel } from './UrlParserPanel';
import type { ToolMode } from '../types/urlEncoder';

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<ToolMode>('encode-decode');

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="mb-6">
        <ModeTab value={mode} onChange={setMode} />
      </div>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
        {mode === 'encode-decode' ? <EncodeDecodePanel /> : <UrlParserPanel />}
      </div>

      {/* Reference strip */}
      <div className="mt-5 grid grid-cols-2 @xl:grid-cols-4 gap-3">
        {[
          { char: 'Space', encoded: '%20' },
          { char: '&', encoded: '%26' },
          { char: '=', encoded: '%3D' },
          { char: '+', encoded: '%2B' },
          { char: '?', encoded: '%3F' },
          { char: '#', encoded: '%23' },
          { char: '/', encoded: '%2F' },
          { char: '@', encoded: '%40' },
        ].map(({ char, encoded }) => (
          <div
            key={char}
            className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
          >
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
              {char}
            </span>
            <span className="text-xs font-mono text-indigo-500 dark:text-indigo-400 font-bold">
              {encoded}
            </span>
          </div>
        ))}
      </div>

      {/* Privacy note + live indicator */}
      <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            URLs never leave your browser - processed entirely client-side
          </p>
        </div>
      </div>
    </div>
  );
}
