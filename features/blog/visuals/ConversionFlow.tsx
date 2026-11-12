'use client';

import { useState } from 'react';
import { ChoiceGroup } from './ChoiceGroup';
import { useReducedMotion } from './useReducedMotion';

type Mode = 'upload' | 'browser';

const FACTS: Record<Mode, { label: string; value: string; good: boolean }[]> = {
  upload: [
    { label: 'Where your file goes', value: 'To a stranger’s server and back', good: false },
    { label: 'File size limit', value: 'Whatever the server allows', good: false },
    { label: 'Connection drops mid-way', value: 'Conversion fails', good: false },
  ],
  browser: [
    { label: 'Where your file goes', value: 'Nowhere - it stays in the tab', good: true },
    { label: 'File size limit', value: 'Your device’s memory', good: true },
    { label: 'Connection drops mid-way', value: 'Keeps working', good: true },
  ],
};

/** Moving dot along a path; skipped when the visitor prefers less motion. */
function Packet({ path, dur, delay = 0, className }: { path: string; dur: number; delay?: number; className: string }) {
  return (
    <circle r="7" className={className}>
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} />
    </circle>
  );
}

export function ConversionFlow() {
  const [mode, setMode] = useState<Mode>('browser');
  const reduced = useReducedMotion();
  const upload = mode === 'upload';

  // Coordinates: device on the left, server on the right.
  const UP = 'M 205 95 C 300 60, 400 60, 495 95';
  const DOWN = 'M 495 165 C 400 200, 300 200, 205 165';
  const ENGINE = 'M 495 130 L 205 130';

  return (
    <div>
      <ChoiceGroup
        label="Show me"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'upload', label: 'A typical online converter' },
          { value: 'browser', label: 'An in-browser converter' },
        ]}
      />

      <svg
        viewBox="0 0 700 260"
        className="mt-6 h-auto w-full"
        role="img"
        aria-label={
          upload
            ? 'Your file is uploaded from your device to a server, converted there, and downloaded back.'
            : 'The server sends only the conversion engine, once. Your file is converted inside your device and never leaves it.'
        }
      >
        <defs>
          <marker id="cf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" className="fill-slate-400 dark:fill-slate-500" />
          </marker>
        </defs>

        {/* Device */}
        <rect x="20" y="30" width="185" height="200" rx="18" className="fill-blue-50 stroke-blue-300 dark:fill-blue-500/10 dark:stroke-blue-500/40" strokeWidth="2" />
        <text x="112" y="58" textAnchor="middle" className="fill-slate-900 text-[15px] font-semibold dark:fill-white">Your device</text>
        <rect x="45" y="80" width="135" height="44" rx="10" className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700" />
        <text x="112" y="107" textAnchor="middle" className="fill-slate-700 text-[13px] dark:fill-slate-300">📄 your-photo.heic</text>
        {!upload && (
          <>
            <rect x="45" y="140" width="135" height="44" rx="10" className="fill-emerald-50 stroke-emerald-300 dark:fill-emerald-500/10 dark:stroke-emerald-500/40" />
            <text x="112" y="160" textAnchor="middle" className="fill-emerald-800 text-[12px] font-semibold dark:fill-emerald-300">⚙️ engine converts</text>
            <text x="112" y="175" textAnchor="middle" className="fill-emerald-800 text-[12px] dark:fill-emerald-300">right here</text>
            <path d="M 112 124 L 112 138" className="stroke-emerald-500" strokeWidth="2" markerEnd="url(#cf-arrow)" />
          </>
        )}
        <text x="112" y="215" textAnchor="middle" className="fill-slate-500 text-[12px] dark:fill-slate-400">
          {upload ? 'waits for the result' : 'result saved straight away'}
        </text>

        {/* Server */}
        <rect x="495" y="30" width="185" height="200" rx="18" className={upload ? 'fill-rose-50 stroke-rose-300 dark:fill-rose-500/10 dark:stroke-rose-500/40' : 'fill-slate-50 stroke-slate-200 dark:fill-slate-800/60 dark:stroke-slate-700'} strokeWidth="2" />
        <text x="587" y="58" textAnchor="middle" className="fill-slate-900 text-[15px] font-semibold dark:fill-white">Website server</text>
        {upload ? (
          <>
            <rect x="520" y="105" width="135" height="50" rx="10" className="fill-white stroke-rose-200 dark:fill-slate-900 dark:stroke-rose-500/40" />
            <text x="587" y="127" textAnchor="middle" className="fill-rose-700 text-[12px] font-semibold dark:fill-rose-300">your file is here</text>
            <text x="587" y="143" textAnchor="middle" className="fill-rose-700 text-[12px] dark:fill-rose-300">converted, maybe kept</text>
          </>
        ) : (
          <>
            <rect x="520" y="105" width="135" height="50" rx="10" className="fill-white stroke-slate-200 dark:fill-slate-900 dark:stroke-slate-700" />
            <text x="587" y="127" textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold dark:fill-slate-300">pages + engine</text>
            <text x="587" y="143" textAnchor="middle" className="fill-slate-500 text-[12px] dark:fill-slate-400">never sees your file</text>
          </>
        )}

        {/* Connections */}
        {upload ? (
          <>
            <path d={UP} fill="none" className="stroke-rose-400" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#cf-arrow)" />
            <text x="350" y="52" textAnchor="middle" className="fill-rose-600 text-[13px] font-semibold dark:fill-rose-300">① upload your file</text>
            <path d={DOWN} fill="none" className="stroke-slate-400" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#cf-arrow)" />
            <text x="350" y="222" textAnchor="middle" className="fill-slate-600 text-[13px] font-semibold dark:fill-slate-300">② download the result</text>
            {!reduced && (
              <>
                <Packet path={UP} dur={2.4} className="fill-rose-500" />
                <Packet path={DOWN} dur={2.4} delay={1.2} className="fill-slate-500" />
              </>
            )}
          </>
        ) : (
          <>
            <path d={ENGINE} fill="none" className="stroke-blue-400" strokeWidth="2.5" strokeDasharray="6 6" markerEnd="url(#cf-arrow)" />
            <text x="350" y="118" textAnchor="middle" className="fill-blue-700 text-[13px] font-semibold dark:fill-blue-300">engine downloaded once</text>
            <text x="350" y="155" textAnchor="middle" className="fill-slate-500 text-[12px] dark:fill-slate-400">then cached - your file never crosses</text>
            {!reduced && <Packet path={ENGINE} dur={3} className="fill-blue-500" />}
          </>
        )}
      </svg>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        {FACTS[mode].map((f) => (
          <div key={f.label} className="rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
            <dt className="text-[12px] text-slate-500 dark:text-slate-400">{f.label}</dt>
            <dd className={`mt-0.5 text-[14px] font-semibold ${f.good ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
