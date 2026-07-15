import {
  BITRATE_PRESETS,
  BitratePresetId,
} from '@/features/audio/convert/types/converter';

interface BitrateSelectorProps {
  value: BitratePresetId;
  onChange: (id: BitratePresetId) => void;
  disabled?: boolean;
}

export const BitrateSelector = ({
  value,
  onChange,
  disabled,
}: BitrateSelectorProps) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
      Output quality
    </p>
    <div className="grid grid-cols-3 gap-2">
      {BITRATE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(preset.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed
            ${
              value === preset.id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
        >
          <span>{preset.label}</span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {preset.kbps} kbps
          </span>
        </button>
      ))}
    </div>
  </div>
);
