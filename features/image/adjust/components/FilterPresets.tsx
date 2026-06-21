import { FilterPreset, FILTER_PRESETS } from '../types/adjust';

interface FilterPresetsProps {
  selected: FilterPreset;
  onChange: (preset: FilterPreset) => void;
  thumbnailUrl?: string;
}

const PRESET_LABELS: Record<FilterPreset, string> = {
  none: 'Original',
  vivid: 'Vivid',
  warm: 'Warm',
  cool: 'Cool',
  bw: 'B&W',
  vintage: 'Vintage',
  dramatic: 'Dramatic',
  fade: 'Fade',
  noir: 'Noir',
};

// CSS filter approximations purely for the visual preview swatch
const PREVIEW_FILTERS: Record<FilterPreset, string> = {
  none: 'none',
  vivid: 'saturate(1.5) contrast(1.15)',
  warm: 'sepia(0.15) saturate(1.2) hue-rotate(-10deg)',
  cool: 'saturate(0.9) hue-rotate(15deg)',
  bw: 'grayscale(1) contrast(1.1)',
  vintage: 'sepia(0.4) contrast(0.9) brightness(1.05)',
  dramatic: 'contrast(1.35) saturate(0.85) brightness(0.95)',
  fade: 'contrast(0.75) brightness(1.1) saturate(0.8)',
  noir: 'grayscale(1) contrast(1.4) brightness(0.9)',
};

export const FilterPresets = ({
  selected,
  onChange,
  thumbnailUrl,
}: FilterPresetsProps) => (
  <div className="space-y-2">
    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
      Filter presets
    </p>
    <div className="grid grid-cols-3 gap-2">
      {(Object.keys(FILTER_PRESETS) as FilterPreset[]).map((preset) => {
        const isActive = selected === preset;
        return (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`flex flex-col items-center gap-1.5 p-1.5 rounded-xl border-2 transition-all
              ${
                isActive
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
              {thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={thumbnailUrl}
                  alt={preset}
                  className="w-full h-full object-cover"
                  style={{ filter: PREVIEW_FILTERS[preset] }}
                />
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    filter: PREVIEW_FILTERS[preset],
                    background: 'linear-gradient(135deg, #94a3b8, #475569)',
                  }}
                />
              )}
            </div>
            <span
              className={`text-[10px] font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}
            >
              {PRESET_LABELS[preset]}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
