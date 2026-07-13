import React, { useCallback } from 'react';
import { UploadCloud, type LucideIcon } from 'lucide-react';

interface SingleFileDropZoneProps {
  isReady: boolean;
  onFile: (file: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  icon: LucideIcon;
  title?: string;
  subtitle?: string;
  formatPills?: string[];
  /** e.g. "Upload image", "Upload audio file" */
  ariaLabel?: string;
  /** e.g. "Drop image here", "Drop audio file here" */
  dropLabel?: string;
  loadingLabel?: string;
}

export const SingleFileDropZone = ({
  isReady,
  onFile,
  inputRef,
  accept,
  icon: Icon,
  title,
  subtitle = 'One file at a time',
  formatPills,
  ariaLabel = 'Upload file',
  dropLabel = 'Drop file here',
  loadingLabel = 'Initializing engine',
}: SingleFileDropZoneProps) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node))
      setIsDragging(false);
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => isReady && inputRef.current?.click()}
      role="button"
      tabIndex={isReady ? 0 : -1}
      aria-label={ariaLabel}
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 select-none
        ${
          !isReady
            ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20'
            : isDragging
              ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 scale-[0.995] cursor-copy'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 cursor-pointer'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={!isReady}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors
          ${
            isDragging
              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-500'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'
          }`}
        >
          {isDragging ? (
            <UploadCloud className="w-7 h-7" />
          ) : (
            <Icon className="w-7 h-7" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isDragging ? (
              dropLabel
            ) : (
              <>
                {title ?? 'Drag & drop a file, or'}{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        </div>
        {!isDragging && formatPills && (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {formatPills.map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}

        {/* Engine loading overlay */}
        {!isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/40 dark:bg-slate-950/40 backdrop-blur-[2px] rounded-2xl">
            <div className="flex flex-col items-center gap-2.5 px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">
                  {loadingLabel}
                </p>
              </div>
              <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 bg-blue-500 rounded-full w-1/2 animate-[loading_1s_ease-in-out_infinite]" />
              </div>
            </div>
            <style jsx global>{`
              @keyframes loading {
                0% {
                  transform: translateX(-100%);
                }
                50% {
                  transform: translateX(100%);
                }
                100% {
                  transform: translateX(200%);
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};
