import type { ReactNode } from 'react';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import { ART_H, ART_W, Checkerboard, Scene, Silhouette, Subject } from './PortraitArt';

function Tile({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">{children}</div>
      <p className="mt-2 text-[14px] font-semibold text-slate-900 dark:text-white">{title}</p>
      <p className="text-[13px] leading-snug text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}

const svgProps = {
  viewBox: `0 0 ${ART_W} ${ART_H}`,
  className: 'block h-auto w-full',
  'aria-hidden': true,
} as const;

/** Photo → AI model → mask → cut-out, as four tiles. */
export function MaskPipeline() {
  return (
    <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] sm:items-start sm:gap-x-2">
      <li>
        <Tile title="① Your photo" desc="Loaded into the tab, not uploaded.">
          <svg {...svgProps}>
            <Scene id="mp-a" />
            <Subject />
          </svg>
        </Tile>
      </li>
      <Arrow />
      <li>
        <Tile title="② AI model" desc="Scores every pixel: subject or background?">
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-fuchsia-600 text-white">
            <BrainCircuit className="h-10 w-10" aria-hidden />
            <span className="text-[13px] font-semibold">IS-Net</span>
            <span className="text-[11px] opacity-80">on your graphics chip</span>
          </div>
        </Tile>
      </li>
      <Arrow />
      <li>
        <Tile title="③ The mask" desc="White keeps, black removes, grey blends.">
          <svg {...svgProps}>
            <rect width={ART_W} height={ART_H} fill="#000" />
            <Silhouette />
          </svg>
        </Tile>
      </li>
      <Arrow />
      <li>
        <Tile title="④ Cut-out" desc="Photo × mask = subject on transparency.">
          <svg {...svgProps}>
            <Checkerboard id="mp-d" />
            <defs>
              <mask id="mp-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={ART_W} height={ART_H}>
                <Silhouette />
              </mask>
            </defs>
            <g mask="url(#mp-mask)">
              <Subject />
            </g>
          </svg>
        </Tile>
      </li>
    </ol>
  );
}

function Arrow() {
  return (
    <li aria-hidden className="hidden pt-[13%] text-slate-400 sm:block">
      <ArrowRight className="h-5 w-5" />
    </li>
  );
}
