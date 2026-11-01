import { Zap } from 'lucide-react';

/**
 * Marks a result produced by the browser's built-in video engine
 * (WebCodecs) instead of FFmpeg: the GPU encoder where the device has one,
 * or a straight stream copy when no re-encode was needed.
 */
export function AcceleratedBadge() {
  return (
    <span
      title="Processed by your browser's built-in video engine, which uses your GPU when available - much faster than the standard engine."
      className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
    >
      <Zap className="h-3 w-3" aria-hidden="true" />
      Accelerated
    </span>
  );
}
