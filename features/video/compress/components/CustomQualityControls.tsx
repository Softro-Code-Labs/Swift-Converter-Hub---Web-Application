import {
  CUSTOM_CRF_MIN,
  CUSTOM_CRF_MAX,
  CUSTOM_RESOLUTION_OPTIONS,
  CUSTOM_FPS_OPTIONS,
  CUSTOM_BITRATE_MIN_KBPS,
  CUSTOM_BITRATE_MAX_KBPS,
  CustomEncodeMode,
} from '@/features/video/shared/config/formats';

interface CustomQualityControlsProps {
  crf: number;
  maxHeight: number | null;
  fps: number | null;
  mode: CustomEncodeMode;
  bitrateKbps: number;
  onCrfChange: (crf: number) => void;
  onMaxHeightChange: (maxHeight: number | null) => void;
  onFpsChange: (fps: number | null) => void;
  onModeChange: (mode: CustomEncodeMode) => void;
  onBitrateChange: (kbps: number) => void;
  disabled?: boolean;
}

const BITRATE_LOG_RATIO = Math.log(
  CUSTOM_BITRATE_MAX_KBPS / CUSTOM_BITRATE_MIN_KBPS,
);

// The bitrate slider runs on a log scale - the gap between 300kbps and
// 600kbps matters far more to the eye than the gap between 15 and 15.3
// Mbps, so a linear slider would waste most of its range on values nobody
// wants. Internally this is still a plain 0-100 <input type="range">;
// only the mapping to/from kbps is logarithmic.
function bitrateToSliderPos(kbps: number): number {
  return (100 * Math.log(kbps / CUSTOM_BITRATE_MIN_KBPS)) / BITRATE_LOG_RATIO;
}

function sliderPosToBitrate(pos: number): number {
  return Math.round(
    CUSTOM_BITRATE_MIN_KBPS * Math.exp((pos / 100) * BITRATE_LOG_RATIO),
  );
}

function formatBitrate(kbps: number): string {
  return kbps >= 1000 ? `${(kbps / 1000).toFixed(1)} Mbps` : `${kbps} kbps`;
}

export const CustomQualityControls = ({
  crf,
  maxHeight,
  fps,
  mode,
  bitrateKbps,
  onCrfChange,
  onMaxHeightChange,
  onFpsChange,
  onModeChange,
  onBitrateChange,
  disabled,
}: CustomQualityControlsProps) => {
  // The quality slider's own range runs smaller-file -> higher-quality,
  // the opposite direction from CRF itself (lower number = higher
  // quality), so the displayed position is inverted from the raw value.
  const crfSliderPosition = CUSTOM_CRF_MAX - crf + CUSTOM_CRF_MIN;

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
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Frame rate
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {CUSTOM_FPS_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              disabled={disabled}
              onClick={() => onFpsChange(opt.fps)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  fps === opt.fps
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {fps && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Lower frame rates shrink file size further but can look choppy on
            fast motion.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Encode by
          </p>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            {(['quality', 'bitrate'] as const).map((m) => (
              <button
                key={m}
                type="button"
                disabled={disabled}
                onClick={() => onModeChange(m)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed
                  ${
                    mode === m
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {mode === 'quality' ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Quality-based - size varies with content
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                CRF {crf}
              </span>
            </div>
            <input
              type="range"
              min={CUSTOM_CRF_MIN}
              max={CUSTOM_CRF_MAX}
              value={crfSliderPosition}
              disabled={disabled}
              onChange={(e) =>
                onCrfChange(
                  CUSTOM_CRF_MAX - Number(e.target.value) + CUSTOM_CRF_MIN,
                )
              }
              className="w-full accent-purple-600 disabled:opacity-40 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Smaller file</span>
              <span>Higher quality</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                Fixed target - predictable size, quality varies with content
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                {formatBitrate(bitrateKbps)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={bitrateToSliderPos(bitrateKbps)}
              disabled={disabled}
              onChange={(e) =>
                onBitrateChange(sliderPosToBitrate(Number(e.target.value)))
              }
              className="w-full accent-purple-600 disabled:opacity-40 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>{formatBitrate(CUSTOM_BITRATE_MIN_KBPS)}</span>
              <span>{formatBitrate(CUSTOM_BITRATE_MAX_KBPS)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
