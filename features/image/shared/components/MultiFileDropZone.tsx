import React, { useCallback } from 'react';
import { UploadCloud, ImageIcon } from 'lucide-react';

interface MultiFileDropZoneProps {
  isReady: boolean;
  onFiles: (files: File[]) => void;
  currentCount: number;
  maxFiles?: number;
  accept: string;
  formatPills?: string[];
}

export const MultiFileDropZone = ({
  isReady,
  onFiles,
  currentCount,
  maxFiles = 20,
  accept,
  formatPills,
}: MultiFileDropZoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const arr = Array.from(fileList);
      const remaining = maxFiles - currentCount;
      onFiles(arr.slice(0, remaining));
    },
    [onFiles, currentCount, maxFiles],
  );

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
      if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    },
    [handleFiles],
  );

  const remaining = maxFiles - currentCount;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => isReady && inputRef.current?.click()}
      role="button"
      tabIndex={isReady ? 0 : -1}
      aria-label="Upload image files"
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
        multiple
        disabled={!isReady}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
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
            <ImageIcon className="w-7 h-7" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isDragging ? (
              'Drop files here'
            ) : (
              <>
                Drag & drop files, or{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {currentCount > 0
              ? `${currentCount} added · ${remaining} more allowed`
              : `Up to ${maxFiles} images at once`}
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
      </div>
    </div>
  );
};
