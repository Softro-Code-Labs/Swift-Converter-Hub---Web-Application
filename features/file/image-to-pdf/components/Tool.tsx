'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownAZ,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  Loader2,
  RotateCw,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { MultiFileDropZone } from '@/features/shared/components';
import { formatBytes } from '@/features/shared/lib/format';
import { cn } from '@/lib/utils';
import { useImageToPdf } from '../hooks/useImageToPdf';
import { layoutPage } from '../lib/layout';
import {
  ACCEPT,
  DEFAULT_OPTIONS,
  MAX_IMAGES,
  SUPPORTED_LABELS,
  type ImageItem,
  type PdfOptions,
} from '../types/imageToPdf';

// --- Small building blocks ----------------------------------------------------

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <fieldset disabled={disabled} className={cn(disabled && 'opacity-50')}>
      <legend className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </legend>
      <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors',
              value === o.value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {hint && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
  danger,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors disabled:pointer-events-none disabled:opacity-30 dark:text-slate-400',
        danger
          ? 'hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400'
          : 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

/** A card showing the PDF page this image will become. */
function PageCard({
  item,
  index,
  total,
  options,
  onMove,
  onRotate,
  onRemove,
  dragging,
  dragHandlers,
}: {
  item: ImageItem;
  index: number;
  total: number;
  options: PdfOptions;
  onMove: (from: number, to: number) => void;
  onRotate: () => void;
  onRemove: () => void;
  dragging: boolean;
  dragHandlers: React.HTMLAttributes<HTMLLIElement>;
}) {
  const quarter = item.rotation === 90 || item.rotation === 270;
  const w = item.width ? (quarter ? item.height! : item.width) : 3;
  const h = item.height ? (quarter ? item.width! : item.height) : 4;
  const l = layoutPage(w, h, options);

  // Position of the image on the page, as percentages (PDF origin is bottom-left).
  const box = {
    left: `${(l.x / l.pageWidth) * 100}%`,
    bottom: `${(l.y / l.pageHeight) * 100}%`,
    width: `${(l.width / l.pageWidth) * 100}%`,
    height: `${(l.height / l.pageHeight) * 100}%`,
  };

  return (
    <li
      {...dragHandlers}
      className={cn(
        'group flex flex-col rounded-xl border border-slate-200 bg-white p-2.5 transition-shadow dark:border-slate-700 dark:bg-slate-900',
        dragging && 'opacity-40',
        item.error && 'border-rose-300 dark:border-rose-500/40',
      )}
    >
      <div className="relative flex aspect-[3/4] items-center justify-center rounded-lg bg-slate-100 p-3 dark:bg-slate-800/70">
        <span className="absolute left-2 top-2 z-10 rounded-md bg-slate-900/80 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-white">
          {index + 1}
        </span>

        {item.error ? (
          <div className="flex flex-col items-center gap-1.5 px-2 text-center">
            <TriangleAlert className="h-5 w-5 text-rose-500" aria-hidden />
            <p className="text-xs text-rose-700 dark:text-rose-300">
              Can&apos;t read this image
            </p>
          </div>
        ) : (
          // The page, drawn to scale
          <div
            className="relative max-h-full max-w-full bg-white shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
            style={{
              aspectRatio: `${l.pageWidth} / ${l.pageHeight}`,
              width: l.pageWidth >= l.pageHeight ? '100%' : 'auto',
              height: l.pageWidth < l.pageHeight ? '100%' : 'auto',
            }}
          >
            {item.previewUrl ? (
              <div className="absolute overflow-hidden" style={box}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt=""
                  draggable={false}
                  className="absolute left-1/2 top-1/2 max-w-none"
                  style={{
                    width: quarter ? `${(100 * l.height) / l.width}%` : '100%',
                    height: quarter ? `${(100 * l.width) / l.height}%` : '100%',
                    transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                    objectFit: 'fill',
                  }}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2
                  className="h-5 w-5 animate-spin text-slate-400"
                  aria-label="Preparing preview"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 min-w-0 px-0.5">
        <p
          className="truncate text-[13px] font-medium text-slate-900 dark:text-white"
          title={item.name}
        >
          {item.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatBytes(item.size)}
          {item.width && item.height ? `, ${item.width}×${item.height}` : ''}
        </p>
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex">
          <IconButton
            label="Move earlier"
            onClick={() => onMove(index, index - 1)}
            disabled={index === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </IconButton>
          <IconButton
            label="Move later"
            onClick={() => onMove(index, index + 1)}
            disabled={index === total - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </IconButton>
        </div>
        <div className="flex">
          <IconButton
            label="Rotate 90° clockwise"
            onClick={onRotate}
            disabled={!!item.error}
          >
            <RotateCw className="h-4 w-4" />
          </IconButton>
          <IconButton label={`Remove ${item.name}`} onClick={onRemove} danger>
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
    </li>
  );
}

// --- Tool ---------------------------------------------------------------------

export default function ImageToPdfTool() {
  const {
    items,
    isBuilding,
    progress,
    result,
    error,
    addFiles,
    remove,
    move,
    rotate,
    sortByName,
    clear,
    build,
    clearResult,
  } = useImageToPdf();

  const [options, setOptions] = useState<PdfOptions>(DEFAULT_OPTIONS);
  const [fileName, setFileName] = useState('');
  const [dragFrom, setDragFrom] = useState<number | null>(null);

  // Any change invalidates a finished PDF, so the Create button returns.
  const set = <K extends keyof PdfOptions>(k: K, v: PdfOptions[K]) => {
    clearResult();
    setOptions((o) => ({ ...o, [k]: v }));
  };

  const usable = items.filter((i) => !i.error);
  const loading = items.some((i) => !i.error && (!i.width || !i.previewUrl));
  const defaultName = useMemo(() => {
    if (!items.length) return 'images.pdf';
    const base = items[0].name.replace(/\.[^.]+$/, '');
    return `${items.length > 1 ? `${base}-and-${items.length - 1}-more` : base}.pdf`;
  }, [items]);
  const outName = fileName.trim() || defaultName;

  // --- Empty state ---
  if (!items.length) {
    return (
      <MultiFileDropZone
        isReady
        onFiles={addFiles}
        currentCount={0}
        maxFiles={MAX_IMAGES}
        accept={ACCEPT}
        formatPills={SUPPORTED_LABELS}
        icon={FileImage}
        unitLabel="images"
        ariaLabel="Choose images to turn into a PDF"
      />
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-[minmax(0,1fr)_18.5rem]">
        {/* -- Pages ------------------------------------------------------- */}
        <section aria-label="Pages" className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">
                {usable.length} {usable.length === 1 ? 'page' : 'pages'}
              </span>{' '}
              - drag to reorder, or use the arrows
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={sortByName}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <ArrowDownAZ className="h-4 w-4" aria-hidden />
                Sort by name
              </button>
              <button
                type="button"
                onClick={clear}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Remove all
              </button>
            </div>
          </div>

          <ol className="grid grid-cols-2 gap-3 @md:grid-cols-3 @5xl:grid-cols-4">
            {items.map((item, index) => (
              <PageCard
                key={item.id}
                item={item}
                index={index}
                total={items.length}
                options={options}
                onMove={move}
                onRotate={() => rotate(item.id)}
                onRemove={() => remove(item.id)}
                dragging={dragFrom === index}
                dragHandlers={{
                  draggable: true,
                  onDragStart: (e) => {
                    setDragFrom(index);
                    e.dataTransfer.effectAllowed = 'move';
                  },
                  onDragOver: (e) => {
                    if (dragFrom === null) return;
                    e.preventDefault();
                    if (dragFrom !== index) {
                      move(dragFrom, index);
                      setDragFrom(index);
                    }
                  },
                  onDrop: (e) => {
                    if (dragFrom !== null) e.preventDefault();
                  },
                  onDragEnd: () => setDragFrom(null),
                }}
              />
            ))}
          </ol>

          {items.length < MAX_IMAGES && (
            <div className="mt-4">
              <MultiFileDropZone
                isReady
                onFiles={addFiles}
                currentCount={items.length}
                maxFiles={MAX_IMAGES}
                accept={ACCEPT}
                icon={FileImage}
                unitLabel="images"
                ariaLabel="Add more images"
              />
            </div>
          )}
        </section>

        {/* -- Settings + output ------------------------------------------ */}
        <aside className="space-y-5 @3xl:sticky @3xl:top-[calc(var(--header-h)+4rem)] @3xl:self-start">
          <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <h2 className="font-sans text-base font-semibold tracking-normal text-slate-900 dark:text-white">
              Page settings
            </h2>
            <Segmented
              label="Page size"
              value={options.pageSize}
              onChange={(v) => set('pageSize', v)}
              options={[
                { value: 'a4', label: 'A4' },
                { value: 'letter', label: 'Letter' },
                { value: 'fit', label: 'Fit image' },
              ]}
              hint={
                options.pageSize === 'fit'
                  ? 'Each page is exactly the size of its image.'
                  : undefined
              }
            />
            <Segmented
              label="Orientation"
              value={options.orientation}
              onChange={(v) => set('orientation', v)}
              disabled={options.pageSize === 'fit'}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'portrait', label: 'Portrait' },
                { value: 'landscape', label: 'Landscape' },
              ]}
              hint={
                options.pageSize !== 'fit' && options.orientation === 'auto'
                  ? 'Wide images get landscape pages.'
                  : undefined
              }
            />
            <Segmented
              label="Margin"
              value={options.margin}
              onChange={(v) => set('margin', v)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'small', label: 'Small' },
                { value: 'large', label: 'Large' },
              ]}
            />
            <Segmented
              label="Image quality"
              value={options.quality}
              onChange={(v) => set('quality', v)}
              options={[
                { value: 'original', label: 'Original' },
                { value: 'compact', label: 'Smaller file' },
              ]}
              hint={
                options.quality === 'compact'
                  ? 'Resizes large photos to 2000px and recompresses them.'
                  : 'Keeps every image at full quality.'
              }
            />
            <div>
              <label
                htmlFor="pdf-file-name"
                className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                File name
              </label>
              <input
                id="pdf-file-name"
                value={fileName}
                onChange={(e) => {
                  clearResult();
                  setFileName(e.target.value);
                }}
                placeholder={defaultName}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            >
              {error}
            </p>
          )}

          {result ? (
            <div
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/25 dark:bg-emerald-500/10"
              aria-live="polite"
            >
              <p className="text-[15px] font-semibold text-emerald-900 dark:text-emerald-100">
                Your PDF is ready
              </p>
              <p className="mt-0.5 break-all text-sm text-emerald-800 dark:text-emerald-200">
                {result.fileName} - {result.pageCount}{' '}
                {result.pageCount === 1 ? 'page' : 'pages'},{' '}
                {formatBytes(result.size)}
              </p>
              <a
                href={result.url}
                download={result.fileName}
                className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 text-[15px] font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download PDF
              </a>
              <p className="mt-2.5 text-xs text-emerald-800/80 dark:text-emerald-200/80">
                Change any setting or page to make a new version.
              </p>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => build(options, outName)}
                disabled={isBuilding || loading || usable.length === 0}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Adding page {progress?.done ?? 0} of{' '}
                    {progress?.total ?? usable.length}…
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Preparing images…
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4" aria-hidden />
                    Create PDF ({usable.length}{' '}
                    {usable.length === 1 ? 'page' : 'pages'})
                  </>
                )}
              </button>
              {isBuilding && progress && (
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={progress.total}
                  aria-valuenow={progress.done}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 transition-[width] duration-200 dark:bg-blue-400"
                    style={{
                      width: `${(progress.done / progress.total) * 100}%`,
                    }}
                  />
                </div>
              )}
              {items.length - usable.length > 0 && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {items.length - usable.length} unreadable{' '}
                  {items.length - usable.length === 1
                    ? 'image will be'
                    : 'images will be'}{' '}
                  skipped.
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
