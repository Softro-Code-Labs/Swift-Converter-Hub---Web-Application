import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface EngineStatusBarProps {
  isLoaded: boolean;
  readyLabel?: string;
  loadingLabel?: string;
  sourceLabel?: string;
  targetLabel?: string;
}

export const EngineStatusBar = ({
  isLoaded,
  readyLabel = 'Engine ready',
  loadingLabel = 'Initializing engine…',
  sourceLabel,
  targetLabel,
}: EngineStatusBarProps) => (
  <div
    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all
    ${
      isLoaded
        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
        : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400'
    }`}
  >
    <div className="flex items-center gap-2">
      {isLoaded ? (
        <>
          <CheckCircle className="w-3.5 h-3.5" /> {readyLabel}
        </>
      ) : (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {loadingLabel}
        </>
      )}
    </div>

    {isLoaded && sourceLabel && targetLabel && (
      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
        <span className="font-black text-sm">{sourceLabel}</span>
        <ArrowRight className="w-3 h-3" />
        <span className="font-black text-sm">{targetLabel}</span>
      </div>
    )}
  </div>
);
