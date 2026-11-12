'use client';

import { useState } from 'react';
import { RotateCcw, Upload } from 'lucide-react';
import { ChoiceGroup } from './ChoiceGroup';

type Mode = 'browser' | 'upload';

interface Row {
  name: string;
  method: string;
  type: string;
  size: string;
  flag?: boolean;
}

const PAGE_LOAD: Row[] = [
  { name: 'convert', method: 'GET', type: 'document', size: '38 kB' },
  { name: 'app.js', method: 'GET', type: 'script', size: '212 kB' },
  { name: 'magick.wasm', method: 'GET', type: 'wasm', size: '14 MB' },
];

const AFTER_DROP: Record<Mode, Row[]> = {
  browser: [],
  upload: [
    { name: 'api/upload', method: 'POST', type: 'fetch', size: '4.2 MB', flag: true },
    { name: 'api/status?job=8121', method: 'GET', type: 'fetch', size: '0.3 kB' },
    { name: 'download/8121.jpg', method: 'GET', type: 'fetch', size: '1.1 MB' },
  ],
};

/** A pretend browser DevTools "Network" tab, to show what to look for. */
export function NetworkPanelDemo() {
  const [mode, setMode] = useState<Mode>('browser');
  const [dropped, setDropped] = useState(false);
  const rows = dropped ? [...PAGE_LOAD, ...AFTER_DROP[mode]] : PAGE_LOAD;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ChoiceGroup
          label="The tool you are testing"
          value={mode}
          onChange={(m) => {
            setMode(m);
            setDropped(false);
          }}
          options={[
            { value: 'browser', label: 'Runs in the browser' },
            { value: 'upload', label: 'Uploads files' },
          ]}
        />
        <button
          type="button"
          onClick={() => setDropped((d) => !d)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-[14px] font-semibold text-white hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {dropped ? <RotateCcw className="h-4 w-4" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
          {dropped ? 'Reset' : 'Drop a 4 MB photo'}
        </button>
      </div>

      {/* Mock DevTools panel */}
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-300 font-mono text-[12.5px] dark:border-slate-700">
        <div className="flex items-center gap-4 border-b border-slate-300 bg-slate-100 px-3 py-1.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <span>Elements</span>
          <span>Console</span>
          <span className="border-b-2 border-blue-500 pb-0.5 font-semibold text-slate-900 dark:text-white">Network</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] text-left">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              <tr>
                <th className="px-3 py-1.5 font-normal">Name</th>
                <th className="px-3 py-1.5 font-normal">Method</th>
                <th className="px-3 py-1.5 font-normal">Type</th>
                <th className="px-3 py-1.5 text-right font-normal">Size</th>
              </tr>
            </thead>
            <tbody aria-live="polite">
              {rows.map((r) => (
                <tr
                  key={r.name}
                  className={`border-t border-slate-200 dark:border-slate-800 ${
                    r.flag
                      ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200'
                      : 'bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-300'
                  }`}
                >
                  <td className="px-3 py-1.5">{r.name}</td>
                  <td className="px-3 py-1.5">{r.method}</td>
                  <td className="px-3 py-1.5">{r.type}</td>
                  <td className="px-3 py-1.5 text-right">{r.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p
        className={`mt-4 rounded-lg px-4 py-3 text-[14px] leading-relaxed ${
          !dropped
            ? 'bg-slate-50 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300'
            : mode === 'browser'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
        }`}
      >
        {!dropped
          ? 'The page and its engine load once. Now drop a file and watch what happens.'
          : mode === 'browser'
            ? 'No new requests. The file was converted inside the tab and never left your device.'
            : 'A POST request the same size as your photo: the file was uploaded to a server.'}
      </p>
    </div>
  );
}
