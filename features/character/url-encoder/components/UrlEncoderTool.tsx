'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Link2, Shield } from 'lucide-react';
import { ModeTab } from './ModeTab';
import { EncodeDecodePanel } from './EncodeDecodePanel';
import { UrlParserPanel } from './UrlParserPanel';
import type { ToolMode } from '../types/urlEncoder';

export default function UrlEncoderTool() {
  const [mode, setMode] = useState<ToolMode>('encode-decode');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-indigo-400 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              URL Encoder / Decoder
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Encode, decode, and parse URLs - all in your browser
            </p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="mb-6">
          <ModeTab value={mode} onChange={setMode} />
        </div>

        {/* Main card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          {mode === 'encode-decode' ? (
            <EncodeDecodePanel />
          ) : (
            <UrlParserPanel />
          )}
        </div>

        {/* Reference strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              URLs never leave your browser - processed entirely client-side
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
            </span>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Updates as you type
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
