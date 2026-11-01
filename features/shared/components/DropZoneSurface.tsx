'use client';

import React from 'react';
import { Loader2, UploadCloud, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The one drop-zone look used by every tool. Handles drag state, click and
 * keyboard (Enter / Space) activation; the caller owns the <input>.
 */
export function DropZoneSurface({
  isReady = true,
  icon: Icon,
  title,
  buttonLabel,
  hint,
  formatPills,
  loadingLabel = 'Getting the engine ready…',
  ariaLabel,
  onPick,
  onDropFiles,
  compact = false,
  children,
}: {
  isReady?: boolean;
  icon: LucideIcon;
  title: string;
  buttonLabel: string;
  hint?: React.ReactNode;
  formatPills?: string[];
  loadingLabel?: string;
  ariaLabel: string;
  onPick: () => void;
  onDropFiles: (files: FileList) => void;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <div
      role="button"
      tabIndex={isReady ? 0 : -1}
      aria-label={ariaLabel}
      aria-disabled={!isReady}
      onClick={() => isReady && onPick()}
      onKeyDown={(e) => {
        if (!isReady) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPick();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (isReady) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (isReady && e.dataTransfer.files?.length)
          onDropFiles(e.dataTransfer.files);
      }}
      className={cn(
        'group relative select-none rounded-2xl border-2 border-dashed transition-colors duration-150',
        !isReady
          ? 'cursor-wait border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40'
          : isDragging
            ? 'cursor-copy border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10'
            : 'cursor-pointer border-slate-300 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900/40 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/5',
      )}
    >
      {children}
      {compact ? (
        <div
          className={cn(
            'flex flex-wrap items-center gap-3 px-4 py-3',
            !isReady && 'opacity-40',
          )}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
            {isDragging ? (
              <UploadCloud className="h-[18px] w-[18px]" />
            ) : (
              <Icon className="h-[18px] w-[18px]" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isDragging ? 'Release to add' : title}
            </p>
            {hint && !isDragging && (
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                {hint}
              </p>
            )}
          </div>
          {!isDragging && (
            <span className="inline-flex h-9 items-center rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-800 transition-colors group-hover:border-blue-400 group-hover:text-blue-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:group-hover:text-blue-300">
              {buttonLabel}
            </span>
          )}
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-3 px-6 text-center',
            compact ? 'py-7' : 'py-10 sm:py-12',
            !isReady && 'opacity-40',
          )}
        >
          <span
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl border transition-colors',
              isDragging
                ? 'border-blue-200 bg-white text-blue-600 dark:border-blue-400/30 dark:bg-slate-900 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {isDragging ? (
              <UploadCloud className="h-6 w-6" />
            ) : (
              <Icon className="h-6 w-6" />
            )}
          </span>
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-white">
              {isDragging ? 'Release to add' : title}
            </p>
            {hint && !isDragging && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {hint}
              </p>
            )}
          </div>
          {!isDragging && (
            <span className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-blue-700 dark:bg-blue-500 dark:group-hover:bg-blue-400 dark:text-white">
              {buttonLabel}
            </span>
          )}
          {!isDragging && formatPills && formatPills.length > 0 && (
            <ul
              className="flex max-w-md flex-wrap items-center justify-center gap-1.5"
              aria-label="Supported formats"
            >
              {formatPills.map((fmt) => (
                <li
                  key={fmt}
                  className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                >
                  {fmt}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!isReady && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-live="polite"
        >
          <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
            {loadingLabel}
          </span>
        </div>
      )}
    </div>
  );
}
