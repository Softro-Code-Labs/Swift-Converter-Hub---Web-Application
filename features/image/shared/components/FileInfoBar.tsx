import { ImageIcon } from 'lucide-react';

interface FileInfoBarProps {
  fileName: string;
  meta?: string;
  onChangeImage: () => void;
}

export const FileInfoBar = ({
  fileName,
  meta,
  onChangeImage,
}: FileInfoBarProps) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
    <div className="flex items-center gap-2 min-w-0">
      <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
        {fileName}
      </p>
      {meta && (
        <span className="text-[10px] text-slate-400 shrink-0">{meta}</span>
      )}
    </div>
    <button
      onClick={onChangeImage}
      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
    >
      Change image
    </button>
  </div>
);
