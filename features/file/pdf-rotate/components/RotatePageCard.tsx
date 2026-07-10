import { FileText, Loader2, RotateCcw, RotateCw } from 'lucide-react';
import type { PageRotation } from '../types/pdfRotate';

interface RotatePageCardProps {
  page: PageRotation;
  onRotateCw: () => void;
  onRotateCcw: () => void;
}

export function RotatePageCard({
  page,
  onRotateCw,
  onRotateCcw,
}: RotatePageCardProps) {
  const isRotated = page.currentRotation !== 0;

  return (
    <div
      className={`group flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-150
      ${
        isRotated
          ? 'border-purple-400 dark:border-purple-600 shadow-sm shadow-purple-500/20'
          : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700'
      }`}
    >
      {/* Thumbnail with rotation applied via CSS transform */}
      <div
        className="relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: '3/4' }}
      >
        {!page.loaded ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        ) : page.thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.thumbUrl}
            alt={`Page ${page.pageIndex + 1}`}
            className="transition-transform duration-300 object-contain"
            style={{
              transform: `rotate(${page.currentRotation}deg)`,
              maxWidth:
                page.currentRotation === 90 || page.currentRotation === 270
                  ? '75%'
                  : '100%',
              maxHeight:
                page.currentRotation === 90 || page.currentRotation === 270
                  ? '75%'
                  : '100%',
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center transition-transform duration-300"
            style={{ transform: `rotate(${page.currentRotation}deg)` }}
          >
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
        )}

        {/* Rotation badge */}
        {isRotated && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-purple-500 text-white text-[9px] font-bold rounded-md">
            {page.currentRotation}°
          </div>
        )}
      </div>

      {/* Page number + controls */}
      <div
        className={`flex items-center justify-between px-2 py-1.5 transition-colors
        ${
          isRotated
            ? 'bg-purple-50 dark:bg-purple-950/30'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <span
          className={`text-[9px] font-bold tabular-nums
          ${isRotated ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {page.pageIndex + 1}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onRotateCcw}
            title="Rotate 90° counter-clockwise"
            className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/40 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <button
            onClick={onRotateCw}
            title="Rotate 90° clockwise"
            className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-950/40 cursor-pointer transition-all"
          >
            <RotateCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
