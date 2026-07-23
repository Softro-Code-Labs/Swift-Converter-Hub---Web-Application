'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu, Group, Minus, Plus } from 'lucide-react';
import { useBaseConverter } from '../hooks/useBaseConverter';
import { BaseInput } from './BaseInput';
import { BitPattern } from './BitPattern';
import type { Base } from '../types/numberBase';

const BASES: Base[] = [2, 8, 10, 16];

// Quick reference: common values in all bases
const QUICK_VALUES = [
  { label: '0', dec: 0 },
  { label: '1', dec: 1 },
  { label: '7', dec: 7 },
  { label: '8', dec: 8 },
  { label: '10', dec: 10 },
  { label: '15', dec: 15 },
  { label: '16', dec: 16 },
  { label: '31', dec: 31 },
  { label: '32', dec: 32 },
  { label: '63', dec: 63 },
  { label: '64', dec: 64 },
  { label: '127', dec: 127 },
  { label: '128', dec: 128 },
  { label: '255', dec: 255 },
  { label: '256', dec: 256 },
  { label: '1023', dec: 1023 },
  { label: '1024', dec: 1024 },
  { label: '65535', dec: 65535 },
];

export default function NumberBaseTool() {
  const [activeBase, setActiveBase] = useState<Base>(10);
  const [rawInput, setRawInput] = useState('');
  const [grouped, setGrouped] = useState(true);

  const result = useBaseConverter(rawInput, activeBase, grouped);

  const handleChange = useCallback((raw: string, base: Base) => {
    setActiveBase(base);
    setRawInput(raw);
  }, []);

  const handleFocus = useCallback(
    (base: Base) => {
      setActiveBase(base);
      // Convert current value to the newly focused base
      if (result.value !== null) {
        const abs = result.isNegative ? -result.value : result.value;
        const prefix = result.isNegative ? '-' : '';
        switch (base) {
          case 2:
            setRawInput(prefix + abs.toString(2));
            break;
          case 8:
            setRawInput(prefix + abs.toString(8));
            break;
          case 10:
            setRawInput(prefix + abs.toString(10));
            break;
          case 16:
            setRawInput(prefix + abs.toString(16).toUpperCase());
            break;
        }
      } else {
        setRawInput('');
      }
    },
    [result],
  );

  const handleQuickValue = (dec: number) => {
    setActiveBase(10);
    setRawInput(dec.toString());
  };

  const hasValue = result.value !== null;
  const isError = result.error !== null && rawInput !== '';

  // Get display value for each base
  const displays: Record<Base, string> = {
    2: result.binary,
    8: result.octal,
    10: result.decimal,
    16: result.hex,
  };

  // Raw value for active input
  const rawForBase: Record<Base, string> = {
    2: result.binary.replace(/\s/g, ''),
    8: result.octal.replace(/\s/g, ''),
    10: result.decimal.replace(/\s/g, ''),
    16: result.hex.replace(/\s/g, ''),
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-lime-400 selection:text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 dark:bg-lime-950/50 text-lime-600 dark:text-lime-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Number Base Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Binary, octal, decimal, hex - edit any field and all update
              instantly
            </p>
          </div>
        </div>

        {/* Options row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button
            onClick={() => setGrouped((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
              ${
                grouped
                  ? 'border-lime-400 bg-lime-50 dark:bg-lime-950/40 text-lime-700 dark:text-lime-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-lime-300 hover:text-lime-600 bg-white dark:bg-slate-900'
              }`}
          >
            <Group className="w-3 h-3" />
            Group digits
          </button>

          {hasValue && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => {
                  if (result.value !== null) {
                    const next = result.value - BigInt(1);
                    setActiveBase(10);
                    setRawInput(next.toString());
                  }
                }}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:border-lime-300 hover:text-lime-600 cursor-pointer transition-all"
                title="Decrement"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-bold text-slate-400">±1</span>
              <button
                onClick={() => {
                  if (result.value !== null) {
                    const next = result.value + BigInt(1);
                    setActiveBase(10);
                    setRawInput(next.toString());
                  }
                }}
                className="flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:border-lime-300 hover:text-lime-600 cursor-pointer transition-all"
                title="Increment"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}

          {rawInput && (
            <button
              onClick={() => setRawInput('')}
              className="text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error */}
        {isError && (
          <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400">
              {result.error}
            </p>
          </div>
        )}

        {/* Four base inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {BASES.map((base) => (
            <BaseInput
              key={base}
              base={base}
              value={displays[base]}
              rawValue={activeBase === base ? rawInput : rawForBase[base]}
              isActive={activeBase === base}
              isError={isError && activeBase === base}
              onChange={handleChange}
              onFocus={handleFocus}
            />
          ))}
        </div>

        {/* Bit pattern */}
        {hasValue && !isError && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5">
            <BitPattern binary={result.binary} bits={result.bits} />
          </div>
        )}

        {/* Stats row */}
        {hasValue && !isError && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Decimal', value: result.decimal.replace(/\s/g, '') },
              {
                label: 'Bit length',
                value: `${result.bits} bit${result.bits !== 1 ? 's' : ''}`,
              },
              {
                label: 'Byte size',
                value: `${Math.ceil(result.bits / 8)} byte${Math.ceil(result.bits / 8) !== 1 ? 's' : ''}`,
              },
              { label: 'Hex', value: `0x${result.hex.replace(/\s/g, '')}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center"
              >
                <p className="text-sm font-black font-mono text-slate-700 dark:text-slate-300 truncate">
                  {value}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick reference values */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <span className="w-1 h-2.5 rounded-full bg-lime-400 inline-block" />
            Common values - click to load
          </p>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              {['Dec', 'Hex', 'Oct', 'Bin', ''].map((h) => (
                <span
                  key={h}
                  className="text-[9px] font-bold uppercase tracking-widest text-slate-400"
                >
                  {h}
                </span>
              ))}
            </div>
            {QUICK_VALUES.map(({ label, dec }) => {
              const bin = dec.toString(2);
              const oct = dec.toString(8);
              const hex = dec.toString(16).toUpperCase();
              return (
                <button
                  key={dec}
                  onClick={() => handleQuickValue(dec)}
                  className="w-full grid grid-cols-5 px-4 py-2.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-lime-50 dark:hover:bg-lime-950/10 cursor-pointer transition-colors text-left group"
                >
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {label}
                  </span>
                  <span className="text-xs font-mono text-violet-600 dark:text-violet-400">
                    0x{hex}
                  </span>
                  <span className="text-xs font-mono text-sky-600 dark:text-sky-400">
                    0o{oct}
                  </span>
                  <span className="text-xs font-mono text-lime-600 dark:text-lime-400 truncate">
                    0b{bin}
                  </span>
                  <span className="text-[9px] text-slate-300 dark:text-slate-700 group-hover:text-lime-500 text-right">
                    Load →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-lime-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            All bases update instantly - pure JavaScript, no server
          </p>
        </div>
      </div>
    </main>
  );
}
