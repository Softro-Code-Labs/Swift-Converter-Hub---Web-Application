'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileJson,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  AlertCircle,
  Upload,
  CheckCircle2,
  Minimize2,
  Maximize2,
  ArrowUpDown,
} from 'lucide-react';
import { useJsonFormatter } from '../hooks/useJsonFormatter';
import { JsonStatsPanel } from './JsonStatsPanel';
import type {
  FormatterOptions,
  FormatMode,
  IndentStyle,
} from '../types/jsonFormatter';

function OptionChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-cyan-300 hover:text-cyan-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

const MODE_TABS: {
  id: FormatMode;
  icon: React.ElementType;
  label: string;
  desc: string;
}[] = [
  {
    id: 'beautify',
    icon: Maximize2,
    label: 'Beautify',
    desc: 'Add indentation',
  },
  { id: 'minify', icon: Minimize2, label: 'Minify', desc: 'Strip whitespace' },
  {
    id: 'validate',
    icon: CheckCircle2,
    label: 'Validate',
    desc: 'Check syntax',
  },
];

const EXAMPLE_JSON = `{
  "name": "John Doe",
  "age": 32,
  "isActive": true,
  "scores": [98, 87, 93, 77],
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zip": "12345"
  },
  "tags": ["developer", "designer"],
  "metadata": null
}`;

export default function JsonFormatterTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<FormatMode>('beautify');
  const [indent, setIndent] = useState<IndentStyle>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [ensureAscii, setEnsureAscii] = useState(false);
  const [copied, setCopied] = useState(false);

  const opts: FormatterOptions = useMemo(
    () => ({ mode, indent, sortKeys, ensureAscii }),
    [mode, indent, sortKeys, ensureAscii],
  );

  const result = useJsonFormatter(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleFile = useCallback(async (f: File) => {
    setInput(await f.text());
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = '';
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleCopy = useCallback(() => {
    const text = result.output || input;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result.output, input]);

  const handleDownload = useCallback(() => {
    const text = result.output || input;
    if (!text) return;
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.output, input]);

  const handleSwapInOut = useCallback(() => {
    if (result.output) setInput(result.output);
  }, [result.output]);

  const isEmpty = !input.trim();
  const hasOutput = !!result.output && !result.error;
  const inputSize = useMemo(
    () => new TextEncoder().encode(input).length,
    [input],
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/data"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Data Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              JSON Formatter & Validator
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Beautify, minify, validate - instant, private, no server
            </p>
          </div>
        </div>

        {/* Mode tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {MODE_TABS.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left
                ${
                  mode === id
                    ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-300 dark:hover:border-cyan-700'
                }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors
                ${
                  mode === id
                    ? 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p
                  className={`text-xs font-black ${mode === id ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Actions */}
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:border-cyan-300 hover:text-cyan-600 bg-white dark:bg-slate-900 cursor-pointer transition-all"
            >
              <ClipboardPaste className="w-3 h-3" /> Paste
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:border-cyan-300 hover:text-cyan-600 bg-white dark:bg-slate-900 cursor-pointer transition-all"
            >
              <Upload className="w-3 h-3" /> Open file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileInput}
            />
            <button
              onClick={() => setInput(EXAMPLE_JSON)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 hover:border-cyan-300 hover:text-cyan-600 bg-white dark:bg-slate-900 cursor-pointer transition-all"
            >
              <FileJson className="w-3 h-3" /> Example
            </button>

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Indent */}
            {mode !== 'minify' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Indent
                </span>
                {([2, 4, 'tab'] as IndentStyle[]).map((n) => (
                  <OptionChip
                    key={String(n)}
                    label={n === 'tab' ? 'Tab' : `${n}`}
                    active={indent === n}
                    onClick={() => setIndent(n)}
                  />
                ))}
              </div>
            )}

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            <OptionChip
              label="Sort keys"
              active={sortKeys}
              onClick={() => setSortKeys((v) => !v)}
            />
            <OptionChip
              label="ASCII escape"
              active={ensureAscii}
              onClick={() => setEnsureAscii((v) => !v)}
            />

            {/* Right side actions */}
            {hasOutput && (
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={handleSwapInOut}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3" /> Use as input
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
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
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" /> .json
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={() => {
                    setInput('');
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main editor + stats layout */}
        <div
          className={`grid gap-4 ${result.stats ? 'lg:grid-cols-[1fr_240px]' : 'grid-cols-1'}`}
        >
          {/* Editor area */}
          <div className="space-y-4">
            {/* Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Input
                {!isEmpty && (
                  <span className="ml-2 font-normal normal-case text-slate-300 dark:text-slate-600 tabular-nums">
                    {input.split('\n').length} lines · {inputSize} B
                  </span>
                )}
              </label>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  placeholder={`Paste JSON here, drop a .json file, or click Example above…\n\n{ "hello": "world" }`}
                  spellCheck={false}
                  className={`w-full h-64 resize-none rounded-2xl border px-5 py-4 text-xs font-mono leading-relaxed focus:outline-none transition-all
                    ${
                      result.error
                        ? 'border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-400/30'
                        : !isEmpty && result.stats
                          ? 'border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-400/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-400/30'
                    }
                    placeholder:text-slate-300 dark:placeholder:text-slate-600`}
                />
                {result.errorLine && (
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                      Line {result.errorLine}
                      {result.errorCol ? `, col ${result.errorCol}` : ''}
                    </span>
                  </div>
                )}
                {!isEmpty && result.stats && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Valid JSON
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Error pane */}
            {result.error && !isEmpty && (
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Invalid JSON
                    {result.errorLine && ` - line ${result.errorLine}`}
                    {result.errorCol && `, column ${result.errorCol}`}
                  </p>
                  <p className="text-[11px] text-red-500 font-mono leading-relaxed">
                    {result.error}
                  </p>
                </div>
              </div>
            )}

            {/* Output */}
            {hasOutput && mode !== 'validate' && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {mode === 'minify' ? 'Minified' : 'Beautified'}
                  <span className="ml-2 font-normal normal-case text-slate-300 dark:text-slate-600 tabular-nums">
                    {result.output.split('\n').length} lines
                  </span>
                </label>
                <textarea
                  readOnly
                  value={result.output}
                  className="w-full h-64 resize-none rounded-2xl border border-cyan-100 dark:border-cyan-900/40 bg-cyan-50/30 dark:bg-cyan-950/10 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none"
                />
              </div>
            )}

            {/* Validate mode - just show valid/invalid, no output pane */}
            {mode === 'validate' && !isEmpty && result.stats && (
              <div className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    Valid JSON
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-500">
                    {result.stats.keys} keys · depth {result.stats.maxDepth} ·{' '}
                    {result.stats.minifiedSize} bytes minified
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Stats panel */}
          {result.stats && (
            <div className="lg:sticky lg:top-4 lg:self-start">
              <JsonStatsPanel stats={result.stats} inputSize={inputSize} />
            </div>
          )}
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Formats as you type - no server, your data never leaves this page
          </p>
        </div>
      </div>
    </main>
  );
}
