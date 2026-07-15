import { Download, Trash2, Wand2, Loader2, Archive } from 'lucide-react';
import { MediaFileItem } from '@/features/shared/types/mediaFile';

interface ProcessToolbarProps {
  files: MediaFileItem[];
  isProcessing: boolean;
  isZipping: boolean;
  isEngineLoaded: boolean;
  onProcessAll: () => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
  /** e.g. "Convert", "Compress", "Normalize" - used for the primary button */
  actionVerb?: string;
  /** e.g. "Converting", "Compressing" - used for in-progress labels */
  actionVerbIng?: string;
}

export const ProcessToolbar = ({
  files,
  isProcessing,
  isZipping,
  isEngineLoaded,
  onProcessAll,
  onDownloadAll,
  onClearAll,
  actionVerb = 'Convert',
  actionVerbIng = 'Converting',
}: ProcessToolbarProps) => {
  const idleCount = files.filter((f) => f.status === 'idle').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const hasProcessed = successCount > 0;
  const allDone = idleCount === 0 && files.length > 0;

  return (
    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
      {isProcessing && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>{actionVerbIng}…</span>
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            disabled={isProcessing || isZipping}
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 py-2 rounded-xl transition-all disabled:opacity-30 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>

          {hasProcessed && (
            <button
              disabled={isProcessing || isZipping}
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

        <button
          disabled={
            isProcessing || isZipping || idleCount === 0 || !isEngineLoaded
          }
          onClick={onProcessAll}
          className={`flex-1 sm:ml-auto flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all
            ${
              idleCount > 0 && isEngineLoaded && !isProcessing
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 !cursor-not-allowed'
            }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>
                {actionVerbIng} {idleCount} left…
              </span>
            </>
          ) : allDone ? (
            <>
              <Download className="w-4 h-4" />
              <span>All done</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>
                {actionVerb} {idleCount} {idleCount === 1 ? 'file' : 'files'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
