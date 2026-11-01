import { Archive, CheckCircle2, Loader2, Trash2, Wand2 } from 'lucide-react';

interface ProcessToolbarProps {
  /** Any queue whose items carry a status ('idle' | 'success' | 'error' | …). */
  files: { status: string }[];
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

/**
 * Footer for batch tools. The main button always shows the next useful
 * step: process what's waiting, then download what's finished.
 */
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
  const errorCount = files.filter((f) => f.status === 'error').length;
  const finished = successCount + errorCount;
  const allDone = idleCount === 0 && files.length > 0 && !isProcessing;
  const unit = (n: number) => (n === 1 ? 'file' : 'files');

  const secondary =
    'flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800';

  return (
    <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
      {isProcessing && (
        <div className="space-y-1.5" aria-live="polite">
          <div className="flex items-center justify-between text-[13px] text-slate-600 dark:text-slate-400">
            <span>
              {actionVerbIng} {Math.min(finished + 1, files.length)} of{' '}
              {files.length}…
            </span>
            <span className="tabular-nums">
              {Math.round((finished / files.length) * 100)}%
            </span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={files.length}
            aria-valuenow={finished}
          >
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400"
              style={{ width: `${(finished / files.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col-reverse items-stretch gap-2 @xl:flex-row @xl:items-center">
        <button
          type="button"
          disabled={isProcessing || isZipping}
          onClick={onClearAll}
          className={`${secondary} justify-center hover:border-red-200 hover:text-red-700 dark:hover:text-red-300`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Clear all
        </button>

        {/* ZIP is a secondary action while files are still waiting. */}
        {successCount > 1 && !allDone && (
          <button
            type="button"
            disabled={isProcessing || isZipping}
            onClick={onDownloadAll}
            className={`${secondary} justify-center`}
          >
            {isZipping ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Archive className="h-4 w-4" aria-hidden />
            )}
            Download {successCount} as ZIP
          </button>
        )}

        <div className="flex-1 @xl:ml-auto">
          {allDone ? (
            successCount > 1 ? (
              <button
                type="button"
                onClick={onDownloadAll}
                disabled={isZipping}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                {isZipping ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Archive className="h-4 w-4" aria-hidden />
                )}
                {isZipping
                  ? 'Preparing ZIP…'
                  : `Download all ${successCount} as ZIP`}
              </button>
            ) : (
              <p className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-50 px-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <CheckCircle2
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                {successCount === 1
                  ? 'Done - use Download on the file above.'
                  : 'Nothing could be processed - see the message on each file.'}
              </p>
            )
          ) : (
            <button
              type="button"
              disabled={
                isProcessing || isZipping || idleCount === 0 || !isEngineLoaded
              }
              onClick={onProcessAll}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  {actionVerbIng}…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" aria-hidden />
                  {actionVerb} {idleCount} {unit(idleCount)}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
