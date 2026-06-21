import { Lock, Unlock } from 'lucide-react';
import { ResizeDimensions } from '../types/crop';

interface ResizeControlsProps {
  dimensions: ResizeDimensions;
  originalWidth: number;
  originalHeight: number;
  onChange: (dims: ResizeDimensions) => void;
}

export const ResizeControls = ({
  dimensions,
  originalWidth,
  originalHeight,
  onChange,
}: ResizeControlsProps) => {
  const aspect = originalWidth / originalHeight;

  const handleWidth = (val: string) => {
    const w = parseInt(val) || 0;
    if (dimensions.lockAspect && w > 0) {
      onChange({ ...dimensions, width: w, height: Math.round(w / aspect) });
    } else {
      onChange({ ...dimensions, width: w });
    }
  };

  const handleHeight = (val: string) => {
    const h = parseInt(val) || 0;
    if (dimensions.lockAspect && h > 0) {
      onChange({ ...dimensions, height: h, width: Math.round(h * aspect) });
    } else {
      onChange({ ...dimensions, height: h });
    }
  };

  const QUICK = [
    {
      label: '25%',
      w: Math.round(originalWidth * 0.25),
      h: Math.round(originalHeight * 0.25),
    },
    {
      label: '50%',
      w: Math.round(originalWidth * 0.5),
      h: Math.round(originalHeight * 0.5),
    },
    {
      label: '75%',
      w: Math.round(originalWidth * 0.75),
      h: Math.round(originalHeight * 0.75),
    },
    { label: '100%', w: originalWidth, h: originalHeight },
    { label: '1920', w: 1920, h: Math.round(1920 / aspect) },
    { label: '1280', w: 1280, h: Math.round(1280 / aspect) },
    { label: '800', w: 800, h: Math.round(800 / aspect) },
    { label: '512', w: 512, h: Math.round(512 / aspect) },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Output size (px)
      </p>

      {/* Width / Height inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold">
            Width
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={dimensions.width || ''}
            onChange={(e) => handleWidth(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>

        <button
          onClick={() =>
            onChange({ ...dimensions, lockAspect: !dimensions.lockAspect })
          }
          title={
            dimensions.lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'
          }
          className={`mt-5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all
            ${
              dimensions.lockAspect
                ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
        >
          {dimensions.lockAspect ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            <Unlock className="w-3.5 h-3.5" />
          )}
        </button>

        <div className="flex-1 space-y-1">
          <label className="text-[10px] text-slate-400 font-semibold">
            Height
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={dimensions.height || ''}
            onChange={(e) => handleHeight(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Quick presets */}
      <div className="flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q.label}
            onClick={() => onChange({ ...dimensions, width: q.w, height: q.h })}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all
              ${
                dimensions.width === q.w && dimensions.height === q.h
                  ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300'
              }`}
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
};
