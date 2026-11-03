'use client';

import { cn } from '@/lib/utils';

/** Accessible on/off switch: a real button with role="switch", operable by
 *  keyboard (Space/Enter) and announced as on/off by screen readers. */
export function Switch({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'group inline-flex items-center gap-2 select-none',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative mt-px h-5 w-9 shrink-0 rounded-full transition-colors',
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span
          className={cn(
            // left-0: without it the knob's static position follows the
            // button's centred text, pushing it off the track.
            'absolute top-0.5 left-0 h-4 w-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5',
          )}
        />
      </span>
      <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
    </button>
  );
}
