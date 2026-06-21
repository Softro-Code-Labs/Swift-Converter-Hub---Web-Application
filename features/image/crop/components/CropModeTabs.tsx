import { Crop, Maximize2, ImageIcon } from 'lucide-react';
import { CropMode } from '../types/crop';

interface CropModeTabsProps {
  mode: CropMode;
  onChange: (mode: CropMode) => void;
}

const MODE_TABS: { id: CropMode; icon: typeof Crop; label: string }[] = [
  { id: 'crop', icon: Crop, label: 'Crop' },
  { id: 'resize', icon: Maximize2, label: 'Resize' },
  { id: 'both', icon: ImageIcon, label: 'Crop + Resize' },
];

export const CropModeTabs = ({ mode, onChange }: CropModeTabsProps) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Mode
      </p>
    </div>
    <div className="p-3 grid grid-cols-3 gap-1.5">
      {MODE_TABS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all
            ${
              mode === id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300'
            }`}
        >
          <Icon className="w-4 h-4" />
          <span className="text-[9px] font-bold leading-tight">{label}</span>
        </button>
      ))}
    </div>
  </div>
);

export { MODE_TABS };
