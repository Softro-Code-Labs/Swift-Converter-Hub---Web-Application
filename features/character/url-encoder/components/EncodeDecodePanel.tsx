'use client';

import { useState, useCallback } from 'react';
import { ClipboardPaste, Trash2, Copy, Check, ArrowDown } from 'lucide-react';
import { useEncodeDecoder } from '../hooks/useUrlProcessor';
import type { EncodeMode } from '../types/urlEncoder';

const MODES: { id: EncodeMode; label: string; desc: string }[] = [
  {
    id: 'component',
    label: 'encodeURIComponent',
    desc: 'Encodes all special chars - use for query values and path segments',
  },
  {
    id: 'full',
    label: 'encodeURI',
    desc: 'Encodes most chars but preserves :// ? & = - use for full URLs',
  },
  {
    id: 'decode',
    label: 'Decode',
    desc: 'Decode any %XX encoded string back to plain text',
  },
];

export function EncodeDecodePanel() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EncodeMode>('component');
  const [copied, setCopied] = useState(false);

  const result = useEncodeDecoder(input, mode);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result.output]);

  const isError = result.output.startsWith('Error:');

  return (
    <div className="space-y-5">
      {/* Mode selector */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {MODES.map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex flex-col gap-1 p-3 rounded-xl border text-left cursor-pointer transition-all
                ${
                  mode === id
                    ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
            >
              <span
                className={`text-xs font-black font-mono
                ${
                  mode === id
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {label}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
                {desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {mode === 'decode' ? 'Encoded string' : 'Plain text'}
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
            >
              <ClipboardPaste className="w-3 h-3" /> Paste
            </button>
            {input && (
              <>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={() => setInput('')}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </>
            )}
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'decode'
              ? 'Paste a %XX encoded string…\ne.g. Hello%20World%21'
              : mode === 'full'
                ? 'Paste a full URL to encode…\ne.g. https://example.com/path?q=hello world'
                : 'Paste text to encode…\ne.g. hello world & more=stuff'
          }
          spellCheck={false}
          rows={5}
          className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-400/30 transition-all"
        />
      </div>

      {/* Arrow */}
      {input && (
        <div className="flex justify-center">
          <ArrowDown className="w-4 h-4 text-indigo-300 dark:text-indigo-700" />
        </div>
      )}

      {/* Output */}
      {input && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {mode === 'decode' ? 'Decoded' : 'Encoded'}
              {result.changed && (
                <span className="ml-2 font-normal normal-case text-indigo-400">
                  · {result.output.length} chars
                </span>
              )}
            </label>
            {!isError && result.output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
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
            )}
          </div>
          <div
            className={`rounded-2xl border px-5 py-4 min-h-[100px]
            ${
              isError
                ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20'
                : result.changed
                  ? 'border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <p
              className={`text-sm font-mono break-all leading-relaxed
              ${isError ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}
            >
              {result.output || (
                <span className="text-slate-300 dark:text-slate-600 italic">
                  {result.changed === false && !isError
                    ? 'No change - input is already in this form'
                    : ''}
                </span>
              )}
            </p>
          </div>
          {!isError && !result.changed && input && (
            <p className="text-[10px] text-slate-400 italic px-1">
              No characters needed encoding - output is identical to input.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
