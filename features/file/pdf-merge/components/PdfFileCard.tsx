'use client';

import { useRef } from 'react';
import { FileText, X, GripVertical, Loader2, AlertCircle } from 'lucide-react';
import type { PdfFileItem } from '../types/pdfMerge';

interface PdfFileCardProps {
  item: PdfFileItem;
  index: number;
  total: number;
  onRemove: (id: string) => void;
  onReorder: (from: number, to: number) => void;
}

export function PdfFileCard({
  item,
  index,
  total,
  onRemove,
  onReorder,
}: PdfFileCardProps) {
  const dragIndex = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const from = parseInt(e.dataTransfer.getData('text/plain'));
    if (!isNaN(from) && from !== index) {
      onReorder(from, index);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="group flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl transition-all hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-sm cursor-grab active:cursor-grabbing active:opacity-70 active:scale-[0.99]"
    >
      {/* Drag handle */}
      <GripVertical className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />

      {/* Order badge */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-[10px] font-black">
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {item.thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbUrl}
            alt="Page 1"
            className="h-full w-full object-cover"
          />
        ) : item.pageCount === null ? (
          <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
        ) : item.error ? (
          <AlertCircle className="w-4 h-4 text-red-400" />
        ) : (
          <FileText className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
          {item.name}
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 tabular-nums">
          <span>{item.sizeLabel}</span>
          {item.pageCount !== null && !item.error && (
            <>
              <span>·</span>
              <span>
                {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
              </span>
            </>
          )}
          {item.error && <span className="text-red-400">{item.error}</span>}
        </div>
      </div>

      {/* Move up/down */}
      <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => index > 0 && onReorder(index, index - 1)}
          disabled={index === 0}
          className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer transition-colors text-[10px] leading-none"
          title="Move up"
        >
          ▲
        </button>
        <button
          onClick={() => index < total - 1 && onReorder(index, index + 1)}
          disabled={index === total - 1}
          className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer transition-colors text-[10px] leading-none"
          title="Move down"
        >
          ▼
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item.id)}
        className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-all"
        title="Remove"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
