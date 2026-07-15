import { Loader2, RotateCcw, type LucideIcon } from 'lucide-react';

interface ToolActionsProps {
  onProcess: () => void;
  onReset: () => void;
  isProcessing: boolean;
  isReady: boolean; // engine loaded + file present
  processIcon: LucideIcon;
  processLabel: string;
  processingLabel?: string;
}

export const ToolActions = ({
  onProcess,
  onReset,
  isProcessing,
  isReady,
  processIcon: ProcessIcon,
  processLabel,
  processingLabel = 'Processing…',
}: ToolActionsProps) => (
  <>
    <button
      onClick={onProcess}
      disabled={!isReady || isProcessing}
      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
        ${
          isReady && !isProcessing
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
        }`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" /> {processingLabel}
        </>
      ) : (
        <>
          <ProcessIcon className="w-4 h-4" /> {processLabel}
        </>
      )}
    </button>
    <button
      onClick={onReset}
      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
    >
      <RotateCcw className="w-3.5 h-3.5" /> Start over
    </button>
  </>
);
