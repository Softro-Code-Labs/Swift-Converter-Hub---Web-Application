import { CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * One-line status for batch tools. Stays hidden until something has been
 * processed, so a fresh queue doesn't greet people with "0 failed".
 */
export function BatchSummary({
  waiting,
  done,
  failed,
  doneLabel = 'converted',
}: {
  waiting: number;
  done: number;
  failed: number;
  doneLabel?: string;
}) {
  if (done + failed === 0) return null;
  return (
    <p
      role="status"
      className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/50"
    >
      {done > 0 && (
        <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {done} {doneLabel}
        </span>
      )}
      {failed > 0 && (
        <span className="flex items-center gap-1.5 font-medium text-red-700 dark:text-red-400">
          <XCircle className="h-4 w-4" aria-hidden />
          {failed} failed - see the message on each file
        </span>
      )}
      {waiting > 0 && (
        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4" aria-hidden />
          {waiting} waiting
        </span>
      )}
    </p>
  );
}
