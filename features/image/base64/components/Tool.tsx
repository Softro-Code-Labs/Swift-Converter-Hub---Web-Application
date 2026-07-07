'use client';

import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { EncodeTab } from './EncodeTab';
import { DecodeTab } from './DecodeTab';
import { Base64Mode } from '../types/base64';

export default function Base64Tool() {
  const [mode, setMode] = useState<Base64Mode>('encode');

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        <button
          onClick={() => setMode('encode')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
            ${
              mode === 'encode'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          <ArrowUpFromLine className="w-4 h-4" /> Image → Base64
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
            ${
              mode === 'decode'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          <ArrowDownToLine className="w-4 h-4" /> Base64 → Image
        </button>
      </div>

      {mode === 'encode' ? <EncodeTab /> : <DecodeTab />}
    </div>
  );
}
