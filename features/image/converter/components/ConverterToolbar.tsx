import { Download, Trash2, Wand2, Loader2, Archive } from 'lucide-react';
import { FileItem } from '@/features/image/converter/types/converter';

interface ConverterToolbarProps {
  files: FileItem[];
  isConvertingAll: boolean;
  isZipping: boolean;
  isMagickLoaded: boolean;
  onConvertAll: () => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
}

export const ConverterToolbar = ({
  files,
  isConvertingAll,
  isZipping,
  isMagickLoaded,
  onConvertAll,
  onDownloadAll,
  onClearAll,
}: ConverterToolbarProps) => {
  const idleCount = files.filter((f) => f.status === 'idle').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const hasConverted = successCount > 0;
  const allDone = idleCount === 0 && files.length > 0;

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
      {/* ── Progress bar — shown when converting ──────────────────────── */}
      {isConvertingAll && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>Converting…</span>
            <span>
              {successCount} / {files.length}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(successCount / files.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Actions row ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Secondary actions */}
        <div className="flex items-center gap-2">
          <button
            disabled={isConvertingAll || isZipping}
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2 rounded-xl transition-all disabled:opacity-30 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>

          {hasConverted && (
            <button
              disabled={isConvertingAll || isZipping}
              onClick={onDownloadAll}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-2 rounded-xl transition-all disabled:opacity-40 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {isZipping ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Archive className="w-3.5 h-3.5" />
              )}
              {isZipping ? 'Zipping…' : `Download ZIP (${successCount})`}
            </button>
          )}
        </div>

        {/* Primary convert button */}
        <button
          disabled={
            isConvertingAll || isZipping || idleCount === 0 || !isMagickLoaded
          }
          onClick={onConvertAll}
          className={`flex-1 sm:ml-auto flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all
            ${
              idleCount > 0 && isMagickLoaded && !isConvertingAll
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 !cursor-not-allowed'
            }`}
        >
          {isConvertingAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Converting {idleCount} left…</span>
            </>
          ) : allDone ? (
            <>
              <Download className="w-4 h-4" />
              <span>All converted</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>
                Convert {idleCount} {idleCount === 1 ? 'image' : 'images'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
