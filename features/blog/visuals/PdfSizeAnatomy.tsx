'use client';

import { useState } from 'react';
import { ChoiceGroup } from './ChoiceGroup';

type Doc = 'scan' | 'report' | 'text';

const PARTS = [
  { key: 'images', label: 'Images', color: 'bg-rose-500', dot: 'bg-rose-500' },
  { key: 'fonts', label: 'Embedded fonts', color: 'bg-amber-400', dot: 'bg-amber-400' },
  { key: 'text', label: 'Text & page structure', color: 'bg-blue-500', dot: 'bg-blue-500' },
  { key: 'extra', label: 'Metadata & leftovers', color: 'bg-slate-400', dot: 'bg-slate-400' },
] as const;

type Share = Record<(typeof PARTS)[number]['key'], number>;

/** Illustrative shares (percent), chosen to show the typical pattern. */
const DOCS: Record<Doc, { label: string; size: string; share: Share; fix: string }> = {
  scan: {
    label: 'Scanned contract',
    size: '20 pages · 38 MB',
    share: { images: 96, fonts: 0, text: 2, extra: 2 },
    fix: 'Almost all of it is page images. Re-encoding them at a sensible resolution is where nearly all the savings are.',
  },
  report: {
    label: 'Report with photos',
    size: '24 pages · 12 MB',
    share: { images: 78, fonts: 12, text: 6, extra: 4 },
    fix: 'Photos dominate. Moderate image compression shrinks it a lot; removing metadata and leftovers adds a little more.',
  },
  text: {
    label: 'Text-only document',
    size: '60 pages · 1.4 MB',
    share: { images: 0, fonts: 58, text: 30, extra: 12 },
    fix: 'No images to squeeze, so there is little to gain. Big savings here usually mean fonts were embedded in full.',
  },
};

export function PdfSizeAnatomy() {
  const [doc, setDoc] = useState<Doc>('scan');
  const d = DOCS[doc];

  return (
    <div>
      <ChoiceGroup
        label="Pick a document"
        value={doc}
        onChange={setDoc}
        options={(Object.keys(DOCS) as Doc[]).map((k) => ({ value: k, label: DOCS[k].label }))}
      />

      <p className="mt-6 text-[13px] text-slate-500 dark:text-slate-400">{d.size}</p>
      <div
        className="mt-2 flex h-10 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800"
        role="img"
        aria-label={PARTS.map((p) => `${p.label} ${d.share[p.key]}%`).join(', ')}
      >
        {PARTS.map((p) =>
          d.share[p.key] > 0 ? (
            <div
              key={p.key}
              className={`${p.color} flex items-center justify-center text-[12px] font-semibold text-white transition-[width] duration-500 ease-out`}
              style={{ width: `${d.share[p.key]}%` }}
            >
              {d.share[p.key] >= 8 ? `${d.share[p.key]}%` : ''}
            </div>
          ) : null,
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-600 dark:text-slate-400">
        {PARTS.map((p) => (
          <li key={p.key} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${p.dot}`} aria-hidden />
            {p.label} <span className="tabular-nums text-slate-400">{d.share[p.key]}%</span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-[15px] leading-relaxed text-slate-700 dark:bg-slate-800/60 dark:text-slate-300" aria-live="polite">
        <strong className="text-slate-900 dark:text-white">What to do: </strong>
        {d.fix}
      </p>
    </div>
  );
}
