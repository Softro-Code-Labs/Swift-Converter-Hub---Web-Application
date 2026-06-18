import React, { useRef, useCallback } from 'react';
import { UploadCloud, ImageIcon } from 'lucide-react';

interface DropZoneProps {
  isMagickLoaded: boolean;
  onFiles: (files: FileList) => void;
  currentCount?: number;
}

const MAX_FILES = 20;

export const DropZone = ({
  isMagickLoaded,
  onFiles,
  currentCount = 0,
}: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drag if leaving the zone itself, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
    },
    [onFiles],
  );

  const remaining = MAX_FILES - currentCount;

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => isMagickLoaded && inputRef.current?.click()}
      role="button"
      tabIndex={isMagickLoaded ? 0 : -1}
      aria-label="Upload image files"
      onKeyDown={(e) =>
        e.key === 'Enter' && isMagickLoaded && inputRef.current?.click()
      }
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 select-none
        ${
          !isMagickLoaded
            ? 'opacity-50 cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20'
            : isDragging
              ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 scale-[0.995] cursor-copy'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 cursor-pointer'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*, image/x-icon"
        multiple
        disabled={!isMagickLoaded}
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />

      <div className="flex flex-col items-center justify-center gap-3 px-6 py-10">
        {/* Icon */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors
          ${
            isDragging
              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-500'
              : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
          }`}
        >
          {isDragging ? (
            <UploadCloud className="w-7 h-7" />
          ) : (
            <ImageIcon className="w-7 h-7" />
          )}
        </div>

        {/* Text */}
        <div className="text-center space-y-1">
          {isDragging ? (
            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
              Drop files to upload
            </p>
          ) : (
            <>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drag & drop files here, or{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {currentCount > 0
                  ? `${currentCount} added · ${remaining} more allowed`
                  : `Up to ${MAX_FILES} images at once`}
              </p>
            </>
          )}
        </div>

        {/* Accepted formats hint */}
        {!isDragging && (
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {['JPG', 'PNG', 'WebP', 'HEIC', 'GIF', 'SVG'].map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] font-bold text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md"
              >
                {fmt}
              </span>
            ))}
            <span className="text-[10px] text-slate-400 dark:text-slate-600">
              + more
            </span>
          </div>
        )}
      </div>

      {/* Engine not ready overlay */}
      {!isMagickLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <div className="h-3.5 w-3.5 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
            Waiting for engine…
          </div>
        </div>
      )}
    </div>
  );
};
