import { CropRegion } from '../types/crop';

interface QuickSizePreset {
  label: string;
  w: number;
  h: number;
}

const QUICK_SIZES: QuickSizePreset[] = [
  { label: '1920×1080', w: 1920, h: 1080 },
  { label: '1280×720', w: 1280, h: 720 },
  { label: '1080×1080', w: 1080, h: 1080 },
  { label: '800×600', w: 800, h: 600 },
  { label: '512×512', w: 512, h: 512 },
];

interface CropRegionInputsProps {
  cropRegion: CropRegion;
  naturalW: number;
  naturalH: number;
  onFieldChange: (field: keyof CropRegion, rawVal: string) => void;
  onQuickSize: (w: number, h: number) => void;
}

export const CropRegionInputs = ({
  cropRegion,
  naturalW,
  naturalH,
  onFieldChange,
  onQuickSize,
}: CropRegionInputsProps) => (
  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
      Crop region (px)
    </p>

    <div className="grid grid-cols-2 gap-2">
      {[
        { field: 'x' as const, label: 'X offset' },
        { field: 'y' as const, label: 'Y offset' },
        { field: 'width' as const, label: 'Width' },
        { field: 'height' as const, label: 'Height' },
      ].map(({ field, label }) => (
        <div key={field} className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
            {label}
          </label>
          <input
            type="number"
            min={0}
            max={field === 'x' || field === 'width' ? naturalW : naturalH}
            value={Math.round(cropRegion[field])}
            onChange={(e) => onFieldChange(field, e.target.value)}
            className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
      ))}
    </div>

    <div className="space-y-1 pt-1">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
        Quick sizes
      </p>
      <div className="flex flex-wrap gap-1">
        {QUICK_SIZES.map((p) => {
          if (p.w > naturalW || p.h > naturalH) return null;
          const isActive =
            cropRegion.width === p.w && cropRegion.height === p.h;
          return (
            <button
              key={p.label}
              onClick={() => onQuickSize(p.w, p.h)}
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition-all
                ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'
                }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
