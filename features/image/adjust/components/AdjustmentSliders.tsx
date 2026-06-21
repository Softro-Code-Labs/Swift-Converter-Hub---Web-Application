import { RotateCcw } from 'lucide-react';
import { AdjustmentValues, DEFAULT_ADJUSTMENTS } from '../types/adjust';

interface AdjustmentSlidersProps {
  values: AdjustmentValues;
  onChange: (values: AdjustmentValues) => void;
}

const SLIDERS: {
  key: keyof AdjustmentValues;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'hue', label: 'Hue', min: -180, max: 180 },
  { key: 'sharpen', label: 'Sharpen', min: 0, max: 100 },
  { key: 'blur', label: 'Blur', min: 0, max: 20 },
];

const TOGGLES: { key: keyof AdjustmentValues; label: string }[] = [
  { key: 'grayscale', label: 'Grayscale' },
  { key: 'sepia', label: 'Sepia' },
  { key: 'invert', label: 'Invert colors' },
];

export const AdjustmentSliders = ({
  values,
  onChange,
}: AdjustmentSlidersProps) => {
  const update = (key: keyof AdjustmentValues, val: number | boolean) => {
    onChange({ ...values, [key]: val });
  };

  const hasChanges =
    JSON.stringify(values) !== JSON.stringify(DEFAULT_ADJUSTMENTS);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Manual adjustments
        </p>
        {hasChanges && (
          <button
            onClick={() => onChange({ ...DEFAULT_ADJUSTMENTS })}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        {SLIDERS.map(({ key, label, min, max }) => {
          const val = values[key] as number;
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {label}
                </label>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {val}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={val}
                onChange={(e) => update(key, parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {TOGGLES.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {label}
            </span>
            <input
              type="checkbox"
              checked={values[key] as boolean}
              onChange={(e) => update(key, e.target.checked)}
              className="w-4 h-4 accent-blue-600 cursor-pointer"
            />
          </label>
        ))}
      </div>
    </div>
  );
};
