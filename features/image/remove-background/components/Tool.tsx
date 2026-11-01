'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Archive,
  Blend,
  Cpu,
  Download,
  ImagePlus,
  Loader2,
  Palette,
  RotateCcw,
  Sparkles,
  Trash2,
  TriangleAlert,
  X,
  Zap,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { MultiFileDropZone, Switch } from '@/features/shared/components';
import { uniqueZipName } from '@/features/shared/lib/zipName';
import { cn } from '@/lib/utils';
import { useRemoveBackground, type BgItem } from '../hooks/useRemoveBackground';
import {
  DEFAULT_SETTINGS,
  compose,
  fitWithin,
  toBlob,
  type BackgroundKind,
  type ComposeSettings,
  type OutputFormat,
} from '../lib/compose';

const MAX_FILES = 20;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp';
const PILLS = ['JPG', 'PNG', 'WebP', 'AVIF'];
const MODEL_MB = 47;
const PREVIEW_SIDE = 1400;

const SWATCHES = [
  '#ffffff',
  '#000000',
  '#f1f5f9',
  '#2563eb',
  '#16a34a',
  '#facc15',
  '#f472b6',
  '#ef4444',
];

const BACKGROUNDS: {
  id: BackgroundKind;
  label: string;
  icon: typeof Palette;
}[] = [
  { id: 'transparent', label: 'None', icon: Sparkles },
  { id: 'color', label: 'Colour', icon: Palette },
  { id: 'blur', label: 'Blur', icon: Blend },
  { id: 'image', label: 'Image', icon: ImagePlus },
];

/** Grey checkerboard that shows where the image is transparent. */
const CHECKER =
  'bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] bg-[image:linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-white dark:bg-slate-900 dark:bg-[image:linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)]';

const baseName = (name: string) => name.replace(/\.[^.]+$/, '') || 'image';

// --- Small pieces ---------------------------------------------------------------

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </legend>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
  left,
  right,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  left: string;
  right: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <span className="mt-0.5 flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{left}</span>
        <span>{right}</span>
      </span>
    </label>
  );
}

/** Before/after view: drag (or use the arrow keys on) the divider. */
function Compare({
  before,
  after,
  transparent,
  alt,
}: {
  /** null hides the comparison (e.g. when the result is cropped). */
  before: string | null;
  after: string;
  transparent: boolean;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative mx-auto w-fit max-w-full select-none overflow-hidden rounded-xl">
      <div className={cn(transparent && CHECKER)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={alt}
          className="block max-h-[560px] max-w-full object-contain"
          draggable={false}
        />
      </div>
      {before && (
        <>
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={before}
              alt=""
              className="block h-full w-full object-contain"
              draggable={false}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
            style={{ left: `${pos}%` }}
          >
            <span className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-700 shadow-md">
              ⇆
            </span>
          </div>
          <span className="pointer-events-none absolute top-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
            Before
          </span>
          <span className="pointer-events-none absolute top-2 right-2 rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">
            After
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
            aria-label="Compare before and after"
            className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          />
        </>
      )}
    </div>
  );
}

// --- Tool -------------------------------------------------------------------------

export default function RemoveBackgroundTool() {
  const { items, engine, addFiles, remove, clear, retry, startEngine } =
    useRemoveBackground();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settings, setSettings] = useState<ComposeSettings>(DEFAULT_SETTINGS);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bgInput = useRef<HTMLInputElement>(null);

  const set = (p: Partial<ComposeSettings>) =>
    setSettings((s) => ({ ...s, ...p }));

  const handleFiles = useCallback(
    (files: File[]) => {
      const ids = addFiles(files);
      if (ids.length) setSelectedId((cur) => cur ?? ids[0]);
    },
    [addFiles],
  );

  const selected = items.find((i) => i.id === selectedId) ?? items[0] ?? null;
  const done = items.filter((i) => i.status === 'done');
  const working = items.find((i) => i.status === 'working');
  const queued = items.filter((i) => i.status === 'queued').length;
  const avgMs = done.length
    ? done.reduce((s, i) => s + (i.ms ?? 0), 0) / done.length
    : null;

  // Live preview of the selected result (re-drawn when settings change).
  useEffect(() => {
    if (!selected?.mask || !selected.bitmap) return;
    let url: string | null = null;
    let cancelled = false;
    const t = setTimeout(() => {
      const c = compose(
        selected.bitmap!,
        selected.mask!,
        selected.maskSize!,
        settings,
        PREVIEW_SIDE,
      );
      c.toBlob((b) => {
        if (!b || cancelled) return;
        url = URL.createObjectURL(b);
        setPreviewUrl(url);
      }, 'image/png');
    }, 60);
    return () => {
      cancelled = true;
      clearTimeout(t);
      if (url) URL.revokeObjectURL(url);
    };
  }, [selected, settings]);

  const render = async (item: BgItem) => {
    const c = compose(item.bitmap!, item.mask!, item.maskSize!, settings, null);
    return toBlob(c, format);
  };
  const ext = format === 'jpg' ? 'jpg' : format;
  const outName = (item: BgItem) => `${baseName(item.file.name)}-no-bg.${ext}`;

  const downloadOne = async (item: BgItem) => {
    setBusy(true);
    try {
      saveAs(await render(item), outName(item));
    } catch {
      toast.error('Could not save this image.');
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    setBusy(true);
    const id = toast.loading('Building ZIP…');
    try {
      const zip = new JSZip();
      for (const item of done) {
        zip.file(uniqueZipName(zip, outName(item)), await render(item));
      }
      saveAs(
        await zip.generateAsync({ type: 'blob' }),
        'backgrounds-removed.zip',
      );
      toast.success('ZIP ready', { id });
    } catch {
      toast.error('Could not build the ZIP.', { id });
    } finally {
      setBusy(false);
    }
  };

  const pickBackground = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const bm = await createImageBitmap(f, { imageOrientation: 'from-image' });
      settings.backgroundImage?.close();
      set({ background: 'image', backgroundImage: bm });
    } catch {
      toast.error('That background image couldn’t be opened.');
    }
  };

  const transparentOut = settings.background === 'transparent';
  const oversized =
    selected && selected.bitmap
      ? fitWithin(selected.bitmap.width, selected.bitmap.height).scaled
      : false;

  return (
    <div className="space-y-5">
      {/* Engine status */}
      {engine.kind === 'loading' && (
        <div
          role="status"
          className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/30"
        >
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Preparing the AI model
            </p>
            <span className="tabular-nums text-blue-800 dark:text-blue-300">
              {Math.round(engine.progress * 100)}%
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/50">
            <div
              className="h-full rounded-full bg-blue-600 transition-[width] dark:bg-blue-400"
              style={{ width: `${Math.max(3, engine.progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-blue-900/80 dark:text-blue-200/80">
            A one-time {MODEL_MB} MB download from this site. It’s cached, so
            next time it starts instantly. Your images stay on your device.
          </p>
        </div>
      )}
      {engine.kind === 'error' && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
        >
          <span className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
            The AI model couldn’t load: {engine.message}
          </span>
          <button
            type="button"
            onClick={() => {
              items
                .filter((i) => i.status === 'error')
                .forEach((i) => retry(i.id));
              void startEngine();
            }}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {items.length < MAX_FILES && (
        <MultiFileDropZone
          isReady
          onFiles={handleFiles}
          currentCount={items.length}
          maxFiles={MAX_FILES}
          accept={ACCEPT}
          formatPills={PILLS}
        />
      )}

      {items.length > 0 && (
        <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* Preview */}
          <div className="space-y-4">
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              {selected?.status === 'done' && previewUrl ? (
                <Compare
                  before={settings.cropToSubject ? null : selected.src}
                  after={previewUrl}
                  transparent={transparentOut}
                  alt={`${selected.file.name} with the background removed`}
                />
              ) : selected?.status === 'error' ? (
                <div className="flex max-w-sm flex-col items-center gap-3 text-center">
                  <TriangleAlert className="h-6 w-6 text-red-500" aria-hidden />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {selected.error}
                  </p>
                  <button
                    type="button"
                    onClick={() => retry(selected.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden /> Try again
                  </button>
                </div>
              ) : selected ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.src}
                    alt=""
                    className="max-h-[560px] max-w-full rounded-xl opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg dark:bg-slate-900/95 dark:text-slate-100"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      {selected.status === 'working'
                        ? engine.kind === 'loading'
                          ? 'Waiting for the AI model…'
                          : avgMs
                            ? `Removing background… about ${Math.max(1, Math.round(avgMs / 1000))} s`
                            : 'Removing background…'
                        : engine.kind === 'loading'
                          ? 'Waiting for the AI model…'
                          : 'Waiting in line…'}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Queue */}
            <div className="flex flex-wrap items-center gap-2">
              {items.map((it) => (
                <div key={it.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => setSelectedId(it.id)}
                    aria-label={`Show ${it.file.name}`}
                    aria-pressed={selected?.id === it.id}
                    className={cn(
                      'relative block h-16 w-16 overflow-hidden rounded-xl border-2 transition-colors',
                      selected?.id === it.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    {it.status !== 'done' && (
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-900/45">
                        {it.status === 'error' ? (
                          <TriangleAlert
                            className="h-4 w-4 text-white"
                            aria-hidden
                          />
                        ) : (
                          <Loader2
                            className={cn(
                              'h-4 w-4 text-white',
                              it.status === 'working' && 'animate-spin',
                            )}
                            aria-hidden
                          />
                        )}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedId === it.id) setSelectedId(null);
                      remove(it.id);
                    }}
                    aria-label={`Remove ${it.file.name}`}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-white opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100 dark:bg-slate-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={clear}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden /> Clear all
              </button>
            </div>
            {(working || queued > 0) && (
              <p
                className="text-xs text-slate-500 dark:text-slate-400"
                aria-live="polite"
              >
                {done.length} of {items.length} done
                {queued > 0 && ` · ${queued} waiting`}
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 @3xl:self-start">
            <Field label="Background">
              <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {BACKGROUNDS.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    aria-pressed={settings.background === b.id}
                    onClick={() =>
                      b.id === 'image' && !settings.backgroundImage
                        ? bgInput.current?.click()
                        : set({ background: b.id })
                    }
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md px-1 py-1.5 text-xs font-medium transition-colors',
                      settings.background === b.id
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                    )}
                  >
                    <b.icon className="h-4 w-4" aria-hidden />
                    {b.label}
                  </button>
                ))}
              </div>
              <input
                ref={bgInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={pickBackground}
              />
              {settings.background === 'color' && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Background colour ${c}`}
                      aria-pressed={settings.color === c}
                      onClick={() => set({ color: c })}
                      className={cn(
                        'h-7 w-7 rounded-full border border-slate-300 dark:border-slate-600',
                        settings.color === c &&
                          'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900',
                      )}
                      style={{ background: c }}
                    />
                  ))}
                  <label className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-slate-300 bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)] dark:border-slate-600">
                    <span className="sr-only">Custom colour</span>
                    <input
                      type="color"
                      value={settings.color}
                      onChange={(e) => set({ color: e.target.value })}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                  </label>
                </div>
              )}
              {settings.background === 'image' && settings.backgroundImage && (
                <button
                  type="button"
                  onClick={() => bgInput.current?.click()}
                  className="mt-3 text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
                >
                  Change background image
                </button>
              )}
            </Field>

            <div className="space-y-4">
              <Slider
                label="Edges"
                value={settings.crispness}
                min={0}
                max={100}
                onChange={(crispness) => set({ crispness })}
                left="Soft, natural"
                right="Crisp"
              />
              <Slider
                label="Feather"
                value={settings.feather}
                min={0}
                max={10}
                onChange={(feather) => set({ feather })}
                left="None"
                right="Smooth"
              />
            </div>

            <div className="space-y-3">
              <Switch
                className="flex w-full items-start text-left"
                checked={settings.cropToSubject}
                onChange={(cropToSubject) => set({ cropToSubject })}
                label="Crop to the subject"
              />
              {settings.cropToSubject && (
                <Slider
                  label="Space around it"
                  value={settings.padding}
                  min={0}
                  max={30}
                  onChange={(padding) => set({ padding })}
                  left="Tight"
                  right="Roomy"
                />
              )}
            </div>

            <Field
              label="Save as"
              hint={
                format === 'jpg' && transparentOut
                  ? 'JPG can’t be transparent, so it’s saved on white.'
                  : format === 'png'
                    ? 'Best quality, keeps transparency.'
                    : format === 'webp'
                      ? 'Much smaller, keeps transparency.'
                      : 'Smallest file.'
              }
            >
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                {(['png', 'webp', 'jpg'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={format === f}
                    onClick={() => setFormat(f)}
                    className={cn(
                      'rounded-md py-1.5 text-[13px] font-semibold uppercase transition-colors',
                      format === f
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>

            <div className="space-y-2">
              <button
                type="button"
                disabled={selected?.status !== 'done' || busy}
                onClick={() => selected && downloadOne(selected)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Download className="h-4 w-4" aria-hidden />
                )}
                Download {format.toUpperCase()}
              </button>
              {done.length > 1 && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={downloadAll}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  Download all {done.length} (ZIP)
                </button>
              )}
              {oversized && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Very large photo: saved at up to 16 megapixels so every
                  browser can handle it.
                </p>
              )}
            </div>

            {engine.kind === 'ready' && (
              <p
                className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                title={
                  engine.backend === 'webgpu'
                    ? 'Using your graphics card through WebGPU'
                    : 'Your browser has no WebGPU, so the processor is used - a little slower'
                }
              >
                {engine.backend === 'webgpu' ? (
                  <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden />
                ) : (
                  <Cpu className="h-3.5 w-3.5" aria-hidden />
                )}
                Running on your{' '}
                {engine.backend === 'webgpu' ? 'GPU' : 'processor'}
                {avgMs ? ` · ${(avgMs / 1000).toFixed(1)} s per image` : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
