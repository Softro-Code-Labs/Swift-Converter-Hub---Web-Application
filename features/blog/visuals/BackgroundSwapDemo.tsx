'use client';

import { useId, useState } from 'react';
import { ChoiceGroup } from './ChoiceGroup';
import { ART_H, ART_W, Checkerboard, Scene, Silhouette, Subject } from './PortraitArt';

type Bg = 'transparent' | 'colour' | 'blur' | 'image';

const SWATCHES = [
  { name: 'White', value: '#ffffff' },
  { name: 'Studio grey', value: '#d6dae1' },
  { name: 'Passport blue', value: '#c7dcf5' },
  { name: 'Sunny yellow', value: '#fde68a' },
  { name: 'Brand cobalt', value: '#2f5fe0' },
];

/** A different "photo" to drop in behind the subject. */
function OtherScene() {
  return (
    <g>
      <rect width={ART_W} height={ART_H} fill="#1e1b4b" />
      <circle cx="80" cy="60" r="2" fill="#fff" />
      <circle cx="140" cy="40" r="1.5" fill="#fff" />
      <circle cx="300" cy="50" r="2" fill="#fff" />
      <circle cx="350" cy="90" r="1.5" fill="#fff" />
      <circle cx="250" cy="30" r="1.5" fill="#fff" />
      <circle cx="330" cy="70" r="26" fill="#fef3c7" />
      <path d="M0 230 L 70 170 L 130 215 L 210 150 L 290 220 L 350 180 L 400 215 L 400 300 L 0 300 Z" fill="#312e81" />
      <path d="M0 260 L 90 225 L 180 255 L 270 230 L 400 262 L 400 300 L 0 300 Z" fill="#4338ca" />
    </g>
  );
}

/**
 * Interactive version of what the Background Remover does: swap the
 * background, soften the edge, and compare with the original.
 */
export function BackgroundSwapDemo() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [bg, setBg] = useState<Bg>('transparent');
  const [colour, setColour] = useState(SWATCHES[2].value);
  const [feather, setFeather] = useState(1);
  const [split, setSplit] = useState(35);

  const splitX = (split / 100) * ART_W;

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <svg
          viewBox={`0 0 ${ART_W} ${ART_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`Before and after: original photo on the left, ${
            bg === 'transparent' ? 'transparent background' : bg === 'colour' ? 'plain colour background' : bg === 'blur' ? 'blurred background' : 'new background image'
          } on the right.`}
        >
          <defs>
            <filter id={`${id}-blur`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <filter id={`${id}-feather`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation={feather} />
            </filter>
            <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="0" y="0" width={ART_W} height={ART_H}>
              <g filter={feather > 0 ? `url(#${id}-feather)` : undefined}>
                <Silhouette />
              </g>
            </mask>
            <clipPath id={`${id}-before`}>
              <rect x="0" y="0" width={splitX} height={ART_H} />
            </clipPath>
          </defs>

          {/* AFTER: new background */}
          {bg === 'transparent' && <Checkerboard id={id} />}
          {bg === 'colour' && <rect width={ART_W} height={ART_H} fill={colour} />}
          {bg === 'blur' && (
            <g filter={`url(#${id}-blur)`}>
              <Scene id={`${id}-b`} />
            </g>
          )}
          {bg === 'image' && <OtherScene />}

          {/* AFTER: the cut-out subject (edge pixels come from the photo, like a real cut-out) */}
          <g mask={`url(#${id}-mask)`}>
            <Scene id={`${id}-c`} />
            <Subject />
          </g>

          {/* BEFORE: original photo, shown left of the divider */}
          <g clipPath={`url(#${id}-before)`}>
            <Scene id={`${id}-o`} />
            <Subject />
          </g>

          {/* Divider and labels */}
          <line x1={splitX} y1="0" x2={splitX} y2={ART_H} stroke="#fff" strokeWidth="3" />
          <circle cx={splitX} cy={ART_H / 2} r="11" fill="#fff" stroke="#0f172a" strokeOpacity="0.2" />
          <path d={`M ${splitX - 4} ${ART_H / 2 - 4} l -4 4 l 4 4 M ${splitX + 4} ${ART_H / 2 - 4} l 4 4 l -4 4`} stroke="#0f172a" strokeWidth="1.8" fill="none" />
          {split > 14 && (
            <text x="12" y="24" className="text-[13px] font-semibold" fill="#0f172a" paintOrder="stroke" stroke="#fff" strokeWidth="3">
              Before
            </text>
          )}
          {split < 86 && (
            <text x={ART_W - 12} y="24" textAnchor="end" className="text-[13px] font-semibold" fill="#0f172a" paintOrder="stroke" stroke="#fff" strokeWidth="3">
              After
            </text>
          )}
        </svg>
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Compare before and after</span>
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
      </label>
      <p className="-mt-1 text-center text-[12px] text-slate-500 dark:text-slate-400">Drag to compare</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <ChoiceGroup
            label="Background"
            value={bg}
            onChange={setBg}
            options={[
              { value: 'transparent', label: 'Transparent' },
              { value: 'colour', label: 'Colour' },
              { value: 'blur', label: 'Blur' },
              { value: 'image', label: 'New image' },
            ]}
          />
          {bg === 'colour' && (
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Colour">
              {SWATCHES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  title={s.name}
                  aria-label={s.name}
                  aria-pressed={colour === s.value}
                  onClick={() => setColour(s.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    colour === s.value ? 'scale-110 border-blue-600 dark:border-blue-400' : 'border-slate-200 dark:border-slate-700'
                  }`}
                  style={{ background: s.value }}
                />
              ))}
            </div>
          )}
        </div>
        <label className="block">
          <span className="mb-2 flex items-baseline justify-between text-[14px] font-semibold text-slate-900 dark:text-white">
            Edge feather
            <span className="text-[13px] font-normal tabular-nums text-slate-500 dark:text-slate-400">
              {feather === 0 ? 'Crisp' : `${feather} px`}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={8}
            step={1}
            value={feather}
            onChange={(e) => setFeather(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <span className="mt-1 block text-[13px] leading-snug text-slate-500 dark:text-slate-400">
            A little softness hides a hard, &quot;pasted-on&quot; edge. Too much leaves a halo.
          </span>
        </label>
      </div>
    </div>
  );
}
