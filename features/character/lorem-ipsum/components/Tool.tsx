'use client';

import { Switch } from '@/features/shared/components/Switch';

import { useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import { RefreshCw } from 'lucide-react';
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

const noopSubscribe = () => () => {};

export default function LoremIpsumTool() {
  const [type, setType] = useState<GenerateType>('paragraphs');
  const [count, setCount] = useState(3);
  const [corpus, setCorpus] = useState<CorpusType>('classic');
  const [startWithLorem, setStart] = useState(true);
  const [spinning, setSpinning] = useState(false);
  // Bumped to force fresh random output on manual "Regenerate" clicks,
  // since the generator itself is random and wouldn't otherwise recompute
  // when none of the other settings have changed.
  const [regenKey, setRegenKey] = useState(0);

  const { generate } = useLoremGenerator();

  // Derived directly during render instead of via effect+state, avoiding
  // an extra post-settings-change render pass.
  // Random text must not be generated during server render, or the server
  // and browser produce different text and hydration fails. Generate only
  // once mounted on the client.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const output = useMemo(() => {
    void regenKey; // referenced only to force recomputation on manual regenerate
    if (!mounted) return '';
    return generate({ type, count, corpus, startWithLorem });
  }, [generate, type, count, corpus, startWithLorem, regenKey, mounted]);

  // Adjust count when type switches
  const handleTypeChange = (newType: GenerateType) => {
    setType(newType);
    setCount(COUNT_LIMITS[newType].default);
  };

  const handleRegenerate = useCallback(() => {
    setSpinning(true);
    setRegenKey((k) => k + 1);
    setTimeout(() => setSpinning(false), 400);
  }, []);

  const limits = COUNT_LIMITS[type];

  return (
    <div className="space-y-5">
      {/* Controls card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-5">
        {/* Type selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400">Generate</label>
          <TypeSelector value={type} onChange={handleTypeChange} />
        </div>

        {/* Count + slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400">Count</label>
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
              className="w-16 text-center text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            />
          </div>
          <input
            type="range"
            min={limits.min}
            max={limits.max}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-100 dark:bg-slate-800 accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-300 dark:text-slate-600 font-semibold tabular-nums">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all capitalize
                    ${
                      corpus === c
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
              >
                {c === 'classic' ? 'Classic Latin' : 'Random English'}
              </button>
            ))}
          </div>

          {/* Start with Lorem toggle */}
          <Switch
            checked={startWithLorem}
            onChange={setStart}
            label='Start with "Lorem ipsum"'
          />

          {/* Regenerate */}
          <button
            onClick={handleRegenerate}
            className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white text-xs font-bold cursor-pointer transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 transition-transform duration-300 ${spinning ? 'rotate-180' : ''}`}
            />
            Regenerate
          </button>
        </div>
      </div>

      {/* Output */}
      {output && <OutputCard text={output} />}
    </div>
  );
}
