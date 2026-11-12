'use client';

import { useState, type ReactNode } from 'react';
import { Check, Minus } from 'lucide-react';
import { PRESETS, type CompressionLevel } from '@/features/file/pdf-compress/types/pdfCompress';
import { ChoiceGroup } from './ChoiceGroup';

/** Long edge of an A4 page, in inches. */
const A4_LONG_EDGE_IN = 11.69;
const MAX_DIMENSION = Math.max(...PRESETS.map((p) => p.maxImageDimension));

const BEST_FOR: Record<CompressionLevel, string> = {
  light: 'Documents you might print, and scans with small text.',
  balanced: 'Most documents you will email or share on screen.',
  maximum: 'Hitting a strict upload limit, when screen viewing is enough.',
};

/**
 * Explains the three levels of our PDF compressor. The numbers come straight
 * from the tool's presets, so this can never drift from what the tool does.
 */
export function CompressionLevels() {
  const [level, setLevel] = useState<CompressionLevel>('balanced');
  const preset = PRESETS.find((p) => p.id === level)!;
  const dpi = Math.round(preset.maxImageDimension / A4_LONG_EDGE_IN);

  const removed = [
    { label: 'Hidden metadata', on: preset.removeMetadata },
    { label: 'Comments & annotations', on: preset.removeAnnotations },
    { label: 'Bookmarks', on: preset.removeBookmarks },
    { label: 'Attached files', on: preset.removeAttachments },
  ];

  return (
    <div>
      <ChoiceGroup
        label="Compression level"
        value={level}
        onChange={setLevel}
        options={PRESETS.map((p) => ({ value: p.id, label: p.label }))}
      />

      <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-400" aria-live="polite">
        {preset.desc}.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Image quality" value={`${Math.round(preset.imageQuality * 100)}%`}>
          <Meter value={preset.imageQuality} />
        </Stat>
        <Stat label="Largest image side" value={`${preset.maxImageDimension.toLocaleString('en-US')} px`}>
          <Meter value={preset.maxImageDimension / MAX_DIMENSION} />
        </Stat>
        <Stat label="Full-page A4 scan keeps" value={`≈ ${dpi} DPI`}>
          <Meter value={preset.maxImageDimension / MAX_DIMENSION} />
        </Stat>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-[13px] font-semibold text-slate-900 dark:text-white">Also removed</p>
          <ul className="space-y-1.5">
            {removed.map((r) => (
              <li key={r.label} className="flex items-center gap-2 text-[14px] text-slate-700 dark:text-slate-300">
                {r.on ? (
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-label="Removed" />
                ) : (
                  <Minus className="h-4 w-4 text-slate-400" aria-label="Kept" />
                )}
                <span className={r.on ? '' : 'text-slate-400 dark:text-slate-500'}>{r.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-500/10">
          <p className="text-[13px] font-semibold text-blue-700 dark:text-blue-300">Best for</p>
          <p className="mt-1 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{BEST_FOR[level]}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
      <p className="text-[12px] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-0.5 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{value}</p>
      {children}
    </div>
  );
}

function Meter({ value }: { value: number }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        className="h-full rounded-full bg-blue-600 transition-[width] duration-500 ease-out dark:bg-blue-400"
        style={{ width: `${Math.min(1, value) * 100}%` }}
      />
    </div>
  );
}
