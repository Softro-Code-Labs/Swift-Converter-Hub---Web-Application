import {
  CUSTOM_BITRATE_MIN,
  CUSTOM_BITRATE_MAX,
} from '@/features/audio/shared/config/formats';

interface CustomBitrateControlsProps {
  kbps: number;
  onKbpsChange: (kbps: number) => void;
  disabled?: boolean;
}

export const CustomBitrateControls = ({
  kbps,
  onKbpsChange,
  disabled,
}: CustomBitrateControlsProps) => (
  <div className="space-y-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Bitrate
      </p>
      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
        {kbps} kbps
      </p>
    </div>
    <input
      type="range"
      min={CUSTOM_BITRATE_MIN}
      max={CUSTOM_BITRATE_MAX}
      step={8}
      value={kbps}
      disabled={disabled}
      onChange={(e) => onKbpsChange(Number(e.target.value))}
      className="w-full accent-blue-600 cursor-pointer disabled:opacity-40"
    />
    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
      <span>Smaller file</span>
      <span>Higher quality</span>
    </div>
  </div>
);
