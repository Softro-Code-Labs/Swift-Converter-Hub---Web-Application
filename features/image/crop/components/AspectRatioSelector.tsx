import { AspectRatioPreset } from '../types/crop';

const PRESETS: { value: AspectRatioPreset; label: string; desc: string }[] = [
  { value: 'free', label: 'Free', desc: 'Any shape' },
  { value: '1:1', label: '1:1', desc: 'Square' },
  { value: '4:3', label: '4:3', desc: 'Standard' },
  { value: '16:9', label: '16:9', desc: 'Widescreen' },
  { value: '3:2', label: '3:2', desc: 'Photo' },
  { value: '9:16', label: '9:16', desc: 'Portrait' },
  { value: '2:3', label: '2:3', desc: 'Portrait' },
];

export const ASPECT_RATIOS: Record<AspectRatioPreset, number | null> = {
  free: null,
  '1:1': 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  '3:2': 3 / 2,
  '9:16': 9 / 16,
  '2:3': 2 / 3,
};

interface AspectRatioSelectorProps {
  selected: AspectRatioPreset;
  onChange: (preset: AspectRatioPreset) => void;
}

export const AspectRatioSelector = ({
  selected,
  onChange,
}: AspectRatioSelectorProps) => (
  <div className="space-y-2">
    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
      Aspect ratio
    </p>
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((preset) => (
        <button
          key={preset.value}
          onClick={() => onChange(preset.value)}
          className={`flex flex-col items-center px-3 py-2 rounded-xl border text-center transition-all
            ${
              selected === preset.value
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
        >
          <span className="text-xs font-black">{preset.label}</span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500">
            {preset.desc}
          </span>
        </button>
      ))}
    </div>
  </div>
);
