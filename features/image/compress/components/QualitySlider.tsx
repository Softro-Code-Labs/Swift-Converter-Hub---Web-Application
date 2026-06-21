import { Sparkles, Gauge, Zap } from 'lucide-react';
import { CompressPreset, CompressOptions, PRESETS } from '../types/compress';

interface QualitySliderProps {
  preset: CompressPreset;
  options: CompressOptions;
  onPresetChange: (preset: CompressPreset) => void;
  onOptionsChange: (options: CompressOptions) => void;
}

const PRESET_TABS: {
  id: Exclude<CompressPreset, 'custom'>;
  icon: typeof Sparkles;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    id: 'high',
    icon: Sparkles,
    label: 'High Quality',
    desc: '~90% quality, smallest visual loss',
    color: 'emerald',
  },
  {
    id: 'balanced',
    icon: Gauge,
    label: 'Balanced',
    desc: '~75% quality, great size/quality mix',
    color: 'blue',
  },
  {
    id: 'aggressive',
    icon: Zap,
    label: 'Aggressive',
    desc: '~50% quality, maximum size reduction',
    color: 'amber',
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string }> =
  {
    emerald: {
      border: 'border-emerald-400 dark:border-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
    blue: {
      border: 'border-blue-400 dark:border-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      text: 'text-blue-700 dark:text-blue-300',
    },
    amber: {
      border: 'border-amber-400 dark:border-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
    },
  };

export const QualitySlider = ({
  preset,
  options,
  onPresetChange,
  onOptionsChange,
}: QualitySliderProps) => {
  const handlePresetClick = (p: Exclude<CompressPreset, 'custom'>) => {
    onPresetChange(p);
    onOptionsChange({ ...options, ...PRESETS[p] });
  };

  const handleQualityDrag = (val: number) => {
    onPresetChange('custom');
    onOptionsChange({ ...options, quality: val });
  };

  return (
    <div className="space-y-4">
      {/* Preset tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {PRESET_TABS.map(({ id, icon: Icon, label, desc, color }) => {
          const isActive = preset === id;
          const c = COLOR_MAP[color];
          return (
            <button
              key={id}
              onClick={() => handlePresetClick(id)}
              className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 text-left transition-all
                ${isActive ? `${c.border} ${c.bg}` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300'}`}
            >
              <div className="flex items-center gap-1.5">
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? c.text : 'text-slate-400'}`}
                />
                <span
                  className={`text-xs font-bold ${isActive ? c.text : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug">
                {desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom quality slider */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Quality{' '}
            {preset === 'custom' && (
              <span className="text-blue-500">(custom)</span>
            )}
          </p>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300">
            {options.quality}%
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={options.quality}
          onChange={(e) => handleQualityDrag(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-600">
          <span>Smaller file</span>
          <span>Higher quality</span>
        </div>
      </div>

      {/* Strip metadata toggle */}
      <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer">
        <div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Strip metadata
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            Remove EXIF, GPS & color profiles
          </p>
        </div>
        <input
          type="checkbox"
          checked={options.stripMetadata}
          onChange={(e) =>
            onOptionsChange({ ...options, stripMetadata: e.target.checked })
          }
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
      </label>
    </div>
  );
};
