import {
  CUSTOM_CRF_MIN,
  CUSTOM_CRF_MAX,
  CUSTOM_RESOLUTION_OPTIONS,
} from '@/features/video/shared/config/formats';

interface CustomQualityControlsProps {
  crf: number;
  maxHeight: number | null;
  onCrfChange: (crf: number) => void;
  onMaxHeightChange: (maxHeight: number | null) => void;
  disabled?: boolean;
}

export const CustomQualityControls = ({
  crf,
  maxHeight,
  onCrfChange,
  onMaxHeightChange,
  disabled,
}: CustomQualityControlsProps) => {
  // The slider's own range runs smaller-file -> higher-quality, which is
  // the opposite direction from CRF itself (lower number = higher
  // quality), so the displayed position is inverted from the raw value.
  const sliderPosition = CUSTOM_CRF_MAX - crf + CUSTOM_CRF_MIN;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3">
      <div className="space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Resolution
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {CUSTOM_RESOLUTION_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onMaxHeightChange(opt.maxHeight)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  maxHeight === opt.maxHeight
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Quality
          </p>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            CRF {crf}
          </p>
        </div>
        <input
          type="range"
          min={CUSTOM_CRF_MIN}
          max={CUSTOM_CRF_MAX}
          value={sliderPosition}
          disabled={disabled}
          onChange={(e) =>
            onCrfChange(
              CUSTOM_CRF_MAX - Number(e.target.value) + CUSTOM_CRF_MIN,
            )
          }
          className="w-full accent-purple-600 cursor-pointer disabled:opacity-40"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
          <span>Smaller file</span>
          <span>Higher quality</span>
        </div>
      </div>
    </div>
  );
};
