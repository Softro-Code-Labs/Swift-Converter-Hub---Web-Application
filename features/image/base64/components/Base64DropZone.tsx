import React, { useRef, useCallback } from 'react';
import { UploadCloud, Binary } from 'lucide-react';

interface Base64DropZoneProps {
  onFile: (file: File) => void;
}

export const Base64DropZone = ({ onFile }: Base64DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
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
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload image to encode"
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 select-none cursor-pointer
        ${
          isDragging
            ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20 scale-[0.995]'
            : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30'
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
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
            <Binary className="w-7 h-7" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {isDragging ? (
              'Drop image here'
            ) : (
              <>
                Drag & drop an image, or{' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </>
            )}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Any image format accepted
          </p>
        </div>
      </div>
    </div>
  );
};
