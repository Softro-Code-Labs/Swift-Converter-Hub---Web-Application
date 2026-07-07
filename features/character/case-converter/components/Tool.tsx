'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CaseSensitive,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  ArrowDownUp,
} from 'lucide-react';
import { CaseButton } from './CaseButton';
import { useCaseConverter } from '../hooks/useCaseConverter';
import type { CaseId, CaseOption } from '../types/caseConverter';

const CASE_OPTIONS: CaseOption[] = [
  // basic
  { id: 'upper', label: 'UPPERCASE', example: 'HELLO WORLD', group: 'basic' },
  { id: 'lower', label: 'lowercase', example: 'hello world', group: 'basic' },
  { id: 'title', label: 'Title Case', example: 'Hello World', group: 'basic' },
  {
    id: 'sentence',
    label: 'Sentence case',
    example: 'Hello world.',
    group: 'basic',
  },
  // code
  { id: 'camel', label: 'camelCase', example: 'helloWorld', group: 'code' },
  { id: 'pascal', label: 'PascalCase', example: 'HelloWorld', group: 'code' },
  { id: 'snake', label: 'snake_case', example: 'hello_world', group: 'code' },
  { id: 'kebab', label: 'kebab-case', example: 'hello-world', group: 'code' },
  {
    id: 'constant',
    label: 'CONSTANT_CASE',
    example: 'HELLO_WORLD',
    group: 'code',
  },
  { id: 'dot', label: 'dot.case', example: 'hello.world', group: 'code' },
  // fun
  {
    id: 'alternating',
    label: 'aLtErNaTiNg',
    example: 'hElLo wOrLd',
    group: 'fun',
  },
  { id: 'inverse', label: 'iNVERSE', example: 'hELLO wORLD', group: 'fun' },
];

const GROUPS: { id: CaseOption['group']; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'code', label: 'Code' },
  { id: 'fun', label: 'Fun' },
];

const PLACEHOLDER = `Type or paste your text here…

The case converter works on the full text - switching cases is instant. Try pasting a camelCase variable name, a SHOUTING SENTENCE, or any mixed text.`;

export default function CaseConverterTool() {
  const [input, setInput] = useState('');
  const [activeCase, setActiveCase] = useState<CaseId>('upper');
  const [copied, setCopied] = useState(false);

  const output = useCaseConverter(input, activeCase);

  const handlePaste = useCallback(async () => {
    try {
      const t = await navigator.clipboard.readText();
      setInput(t);
    } catch {
      /* denied */
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const handleSwap = useCallback(() => {
    // Put the converted output back into the input
    setInput(output);
  }, [output]);

  const handleClear = useCallback(() => setInput(''), []);

  const isEmpty = input.trim().length === 0;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <CaseSensitive className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Case Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              12 case formats - instant, private, no server
            </p>
          </div>
        </div>

        {/* Case picker */}
        <div className="space-y-3 mb-6">
          {GROUPS.map(({ id: groupId, label: groupLabel }) => (
            <div key={groupId}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-2">
                <span
                  className={`w-1 h-2.5 rounded-full inline-block
                  ${groupId === 'basic' ? 'bg-blue-400' : groupId === 'code' ? 'bg-violet-400' : 'bg-pink-400'}`}
                />
                {groupLabel}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CASE_OPTIONS.filter((o) => o.group === groupId).map((opt) => (
                  <CaseButton
                    key={opt.id}
                    option={opt}
                    active={activeCase === opt.id}
                    onClick={setActiveCase}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Input
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleClear}
                  disabled={isEmpty}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="w-full h-64 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all font-mono"
            />
            {!isEmpty && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                {input.length.toLocaleString()} characters
              </p>
            )}
          </div>

          {/* Swap + Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="my-[4] text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Output -{' '}
                <span className="text-blue-500 dark:text-blue-400 normal-case font-black">
                  {CASE_OPTIONS.find((o) => o.id === activeCase)?.label}
                </span>
              </label>
              <button
                onClick={handleCopy}
                disabled={isEmpty}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="relative">
              <textarea
                readOnly
                value={output}
                placeholder="Converted text appears here…"
                className="w-full h-64 resize-none rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/10 px-5 py-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none font-mono"
              />
            </div>
            {!isEmpty && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                {output.length.toLocaleString()} characters
              </p>
            )}
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSwap}
            disabled={isEmpty}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            Use output as new input
          </button>
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converts instantly - no internet connection needed
          </p>
        </div>
      </div>
    </main>
  );
}
