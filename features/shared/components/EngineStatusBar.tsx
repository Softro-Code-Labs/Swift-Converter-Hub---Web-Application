import { Loader2 } from 'lucide-react';

interface EngineStatusBarProps {
  isLoaded: boolean;
  readyLabel?: string;
  loadingLabel?: string;
  /** Kept for compatibility - the page header now shows the conversion. */
  sourceLabel?: string;
  targetLabel?: string;
}

/**
 * Only speaks up while the processing engine is still downloading. Once it
 * is ready there is nothing to say, so it renders nothing (the drop zone
 * becomes clickable at the same moment).
 */
export const EngineStatusBar = ({
  isLoaded,
  loadingLabel = 'Getting the engine ready…',
}: EngineStatusBarProps) => {
  if (isLoaded) return null;
  return (
    <p
      role="status"
      className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100"
    >
      <Loader2
        className="h-4 w-4 shrink-0 animate-spin text-blue-600 dark:text-blue-300"
        aria-hidden
      />
      <span>
        <span className="font-semibold">
          {loadingLabel.replace(/Initializing/i, 'Loading')}
        </span>{' '}
        <span className="text-blue-800/80 dark:text-blue-200/80">
          The first visit downloads it once; after that it&apos;s cached.
        </span>
      </span>
    </p>
  );
};
