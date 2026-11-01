import { FileText, Loader2, RotateCcw, RotateCw } from 'lucide-react';
import type { PageRotation } from '../types/pdfRotate';

interface RotatePageCardProps {
  page: PageRotation;
  onRotateCw: () => void;
  onRotateCcw: () => void;
}

/** One page: click the thumbnail (or the ↻ button) to turn it clockwise.
 *  Controls are always visible so they work on touch screens and by keyboard. */
export function RotatePageCard({
  page,
  onRotateCw,
  onRotateCcw,
}: RotatePageCardProps) {
  const isRotated = page.currentRotation !== 0;
  const quarter = page.currentRotation === 90 || page.currentRotation === 270;
  const n = page.pageIndex + 1;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border-2 transition-colors ${
        isRotated
          ? 'border-blue-500 dark:border-blue-400'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <button
        type="button"
        onClick={onRotateCw}
        disabled={!page.loaded}
        aria-label={`Rotate page ${n} clockwise${isRotated ? ` (now ${page.currentRotation}°)` : ''}`}
        className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800"
      >
        {!page.loaded ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        ) : page.thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.thumbUrl}
            alt=""
            className="object-contain transition-transform duration-300"
            style={{
              transform: `rotate(${page.currentRotation}deg)`,
              maxWidth: quarter ? '75%' : '100%',
              maxHeight: quarter ? '75%' : '100%',
            }}
          />
        ) : (
          <FileText
            className="h-6 w-6 text-slate-400 transition-transform duration-300"
            style={{ transform: `rotate(${page.currentRotation}deg)` }}
          />
        )}
        {isRotated && (
          <span className="absolute right-1 top-1 rounded-md bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
            {page.currentRotation}°
          </span>
        )}
      </button>

      <div
        className={`flex items-center justify-between px-1.5 py-1 ${
          isRotated
            ? 'bg-blue-50 dark:bg-blue-500/10'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <span
          className={`pl-1 text-xs font-semibold tabular-nums ${
            isRotated
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {n}
        </span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={onRotateCcw}
            aria-label={`Rotate page ${n} counter-clockwise`}
            title="Rotate 90° counter-clockwise"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onRotateCw}
            aria-label={`Rotate page ${n} clockwise`}
            title="Rotate 90° clockwise"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:bg-white hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-300"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
