'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlignLeft, RefreshCw } from 'lucide-react';
import { useLoremGenerator } from '../hooks/useLoremGenerator';
import { TypeSelector } from './TypeSelector';
import { OutputCard } from './OutputCard';
import type { GenerateType, CorpusType } from '../types/loremIpsum';

const COUNT_LIMITS: Record<
  GenerateType,
  { min: number; max: number; default: number }
> = {
  paragraphs: { min: 1, max: 20, default: 3 },
  sentences: { min: 1, max: 50, default: 5 },
  words: { min: 5, max: 500, default: 50 },
};

export default function LoremIpsumTool() {
  const [type, setType] = useState<GenerateType>('paragraphs');
  const [count, setCount] = useState(3);
  const [corpus, setCorpus] = useState<CorpusType>('classic');
  const [startWithLorem, setStart] = useState(true);
  const [output, setOutput] = useState('');
  const [spinning, setSpinning] = useState(false);

  const { generate } = useLoremGenerator();

  const run = useCallback(() => {
    setOutput(generate({ type, count, corpus, startWithLorem }));
  }, [generate, type, count, corpus, startWithLorem]);

  // Auto-generate on any option change
  useEffect(() => {
    run();
  }, [run]);

  // Adjust count when type switches
  const handleTypeChange = (newType: GenerateType) => {
    setType(newType);
    setCount(COUNT_LIMITS[newType].default);
  };

  const handleRegenerate = () => {
    setSpinning(true);
    run();
    setTimeout(() => setSpinning(false), 400);
  };

  const limits = COUNT_LIMITS[type];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-orange-400 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
            <AlignLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Lorem Ipsum Generator
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Placeholder text on demand - classic Latin or random English
            </p>
          </div>
        </div>

        {/* Controls card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-5">
          {/* Type selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Generate
            </label>
            <TypeSelector value={type} onChange={handleTypeChange} />
          </div>

          {/* Count + slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Count
              </label>
              <input
                type="number"
                min={limits.min}
                max={limits.max}
                value={count}
                onChange={(e) => {
                  const v = Math.min(
                    limits.max,
                    Math.max(limits.min, Number(e.target.value)),
                  );
                  setCount(v);
                }}
                className="w-16 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-1 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              />
            </div>
            <input
              type="range"
              min={limits.min}
              max={limits.max}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-100 dark:bg-slate-800 accent-orange-500 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 font-semibold tabular-nums">
              <span>{limits.min}</span>
              <span>{limits.max}</span>
            </div>
          </div>

          {/* Bottom row: corpus + options + regenerate */}
          <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
            {/* Corpus toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(['classic', 'random'] as CorpusType[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCorpus(c)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all capitalize
                    ${
                      corpus === c
                        ? 'bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  {c === 'classic' ? 'Classic Latin' : 'Random English'}
                </button>
              ))}
            </div>

            {/* Start with Lorem toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setStart((v) => !v)}
                className={`relative w-8 h-4 rounded-full transition-colors
                  ${startWithLorem ? 'bg-orange-400' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform
                  ${startWithLorem ? 'translate-x-4' : 'translate-x-0.5'}`}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                Start with "Lorem ipsum"
              </span>
            </label>

            {/* Regenerate */}
            <button
              onClick={handleRegenerate}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-bold cursor-pointer transition-all"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 transition-transform duration-300 ${spinning ? 'rotate-180' : ''}`}
              />
              Regenerate
            </button>
          </div>
        </div>

        {/* Output */}
        {output && <OutputCard text={output} onRegenerate={handleRegenerate} />}

        {/* Live indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Generated instantly - no server, no tracking
          </p>
        </div>
      </div>
    </main>
  );
}
