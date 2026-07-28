import { FileText, Loader2 } from 'lucide-react';
import type { PageThumb } from '../types/pdfSplit';

interface PageGridProps {
  thumbs: PageThumb[];
  selectedPages: Set<number>;
  /** Human-readable page ranges for the current selection, e.g. "1-3, 5" */
  rangeSummary?: string;
  onToggle: (idx: number) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

export function PageGrid({
  thumbs,
  selectedPages,
  rangeSummary,
  onToggle,
  onSelectAll,
  onSelectNone,
}: PageGridProps) {
  const allSelected = thumbs.length > 0 && selectedPages.size === thumbs.length;

  return (
    <div className="space-y-3">
      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Select pages
          <span className="ml-2 normal-case font-normal text-slate-300 dark:text-slate-600 tabular-nums">
            {selectedPages.size} of {thumbs.length} selected
            {rangeSummary ? ` (${rangeSummary})` : ''}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={allSelected ? onSelectNone : onSelectAll}
            className="text-[10px] font-bold text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-colors"
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}
      >
        {thumbs.map((thumb) => {
          const isSelected = selectedPages.has(thumb.pageIndex);
          const pageNum = thumb.pageIndex + 1;
          return (
            <button
              key={thumb.pageIndex}
              onClick={() => onToggle(thumb.pageIndex)}
              className={`relative flex flex-col items-center rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-150
                ${
                  isSelected
                    ? 'border-blue-500 shadow-md shadow-blue-500/20 scale-[1.03]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
            >
              {/* Thumbnail */}
              <div
                className="w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
                style={{ aspectRatio: '3/4' }}
              >
                {!thumb.loaded ? (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                ) : thumb.thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb.thumbUrl}
                    alt={`Page ${pageNum}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <FileText className="w-5 h-5 text-slate-400" />
                )}
              </div>

              {/* Page number */}
              <div
                className={`w-full py-1 text-center text-[9px] font-bold transition-colors
                ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {pageNum}
              </div>

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
