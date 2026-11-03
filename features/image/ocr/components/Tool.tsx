'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  ImageIcon,
  Languages,
  Loader2,
  RotateCcw,
  ScanText,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { MultiFileDropZone, Switch } from '@/features/shared/components';
import { cn } from '@/lib/utils';
import { useOcr, type EngineState, type OcrItem } from '../hooks/useOcr';
import { LANGUAGES, getLanguage } from '../lib/languages';
import {
  combineTexts,
  countWords,
  tidyText,
  type TextLayout,
} from '../lib/text';

const MAX_FILES = 20;
const ACCEPT =
  'image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/heic,image/heif,.heic,.heif';
const PILLS = ['JPG', 'PNG', 'WebP', 'HEIC', 'Screenshots'];
/** Lines Tesseract is less sure of than this are highlighted for checking. */
const LOW_CONFIDENCE = 60;

const LAYOUTS: { id: TextLayout; label: string; hint: string }[] = [
  {
    id: 'paragraphs',
    label: 'Paragraphs',
    hint: 'Joins wrapped lines - best for documents and articles.',
  },
  {
    id: 'lines',
    label: 'Keep lines',
    hint: 'Line for line as in the image - best for receipts, lists and code.',
  },
];

const baseName = (name: string) => name.replace(/\.[^.]+$/, '') || 'image';

const LOAD_LABEL: Record<'engine' | 'language', string> = {
  engine: 'Downloading the text-recognition engine',
  language: 'Downloading language data',
};

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

function EngineBanner({
  engine,
  onRetry,
}: {
  engine: EngineState;
  onRetry: () => void;
}) {
  if (engine.kind === 'loading') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/60 dark:bg-blue-950/30"
      >
        <div className="flex items-center justify-between gap-3 text-sm">
          <p className="flex items-center gap-2 font-semibold text-blue-900 dark:text-blue-200">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {LOAD_LABEL[engine.step]}
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
          A one-time download of a few MB from this site. It’s cached, so next
          time it starts instantly. Your images stay on your device.
        </p>
      </div>
    );
  }
  if (engine.kind === 'error') {
    return (
      <div
        role="alert"
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
      >
        <span className="flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
          The text-recognition engine couldn’t load: {engine.message}
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }
  return null;
}

/** The image with a box around every line Tesseract found. Lines it is
 *  unsure of are amber, so you know which ones to check. */
function Preview({
  item,
  showLines,
}: {
  item: OcrItem;
  showLines: boolean;
}) {
  const { result, width, height } = item;
  return (
    <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src!}
        alt={`${item.file.name}`}
        className="block max-h-[560px] max-w-full object-contain"
        draggable={false}
      />
      {showLines &&
        result &&
        width &&
        height &&
        result.lines.map((line, i) => {
          const low = line.confidence < LOW_CONFIDENCE;
          return (
            <div
              key={i}
              title={`${line.text}\n${Math.round(line.confidence)}% sure`}
              className={cn(
                'absolute rounded-[3px] border transition-colors',
                low
                  ? 'border-amber-500 bg-amber-400/25 hover:bg-amber-400/40'
                  : 'border-blue-500/70 bg-blue-500/10 hover:bg-blue-500/25',
              )}
              style={{
                left: `${(line.bbox.x0 / width) * 100}%`,
                top: `${(line.bbox.y0 / height) * 100}%`,
                width: `${((line.bbox.x1 - line.bbox.x0) / width) * 100}%`,
                height: `${((line.bbox.y1 - line.bbox.y0) / height) * 100}%`,
              }}
            />
          );
        })}
    </div>
  );
}

function ConfidenceNote({ item }: { item: OcrItem }) {
  const r = item.result!;
  const unsure = r.lines.filter((l) => l.confidence < LOW_CONFIDENCE).length;
  const [tone, text] =
    r.confidence >= 85 && unsure === 0
      ? (['good', 'Read with high confidence'] as const)
      : r.confidence >= LOW_CONFIDENCE
        ? ([
            'check',
            unsure
              ? `${unsure} line${unsure === 1 ? '' : 's'} worth checking (amber)`
              : 'Mostly confident - worth a quick check',
          ] as const)
        : (['poor', 'Low confidence - a sharper, straighter photo helps'] as const);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
        tone === 'good' &&
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
        tone === 'check' &&
          'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
        tone === 'poor' &&
          'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
      )}
    >
      {text}
    </span>
  );
}

// --- Tool -------------------------------------------------------------------------

export default function OcrTool() {
  const {
    items,
    engine,
    language,
    setLanguage,
    addFiles,
    remove,
    clear,
    retry,
    retryAll,
    rereadAll,
  } = useOcr();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layout, setLayout] = useState<TextLayout>('paragraphs');
  const [showLines, setShowLines] = useState(true);
  /** Hand corrections, keyed by reading (OcrItem.runId), so a re-read
   *  starts from the new text. */
  const [edits, setEdits] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);

  const handleFiles = useCallback(
    (files: File[]) => {
      const ids = addFiles(files);
      if (ids.length) setSelectedId((cur) => cur ?? ids[0]);
    },
    [addFiles],
  );

  // Paste a screenshot straight from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const images = Array.from(e.clipboardData?.files ?? []).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (!images.length) return;
      e.preventDefault();
      const room = MAX_FILES - items.length;
      if (room <= 0) {
        toast.error(`You can add up to ${MAX_FILES} images.`);
        return;
      }
      const stamp = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');
      handleFiles(
        images.slice(0, room).map(
          (f, i) =>
            new File([f], `pasted-${stamp}${i ? `-${i + 1}` : ''}.png`, {
              type: f.type,
            }),
        ),
      );
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFiles, items.length]);

  const selected = items.find((i) => i.id === selectedId) ?? items[0] ?? null;
  const done = items.filter((i) => i.status === 'done');
  const working = items.find((i) => i.status === 'working');
  const queued = items.filter((i) => i.status === 'queued').length;
  const stale = done.filter((i) => i.lang !== language).length;
  const lang = getLanguage(language);

  const textOf = (item: OcrItem) =>
    edits[item.runId!] ??
    tidyText(item.result?.text ?? '', layout, {
      noSpaces: getLanguage(item.lang ?? language).noSpaces,
    });
  const editedText = (item: OcrItem) => edits[item.runId!];
  const setEdit = (item: OcrItem, text: string | undefined) =>
    setEdits((m) => {
      const next = { ...m };
      if (text === undefined) delete next[item.runId!];
      else next[item.runId!] = text;
      return next;
    });

  const changeLayout = (next: TextLayout) => {
    if (Object.keys(edits).length) {
      setEdits({});
      toast('Your edits were reset for the new layout.');
    }
    setLayout(next);
  };

  const selectedText = selected?.status === 'done' ? textOf(selected) : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(selectedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Your browser blocked copying - select the text instead.');
    }
  };

  const download = (text: string, name: string) =>
    saveAs(new Blob([text], { type: 'text/plain;charset=utf-8' }), name);

  return (
    <div className="space-y-5">
      <EngineBanner engine={engine} onRetry={retryAll} />

      {items.length < MAX_FILES && (
        <div>
          <MultiFileDropZone
            isReady
            onFiles={handleFiles}
            currentCount={items.length}
            maxFiles={MAX_FILES}
            accept={ACCEPT}
            formatPills={PILLS}
          />
          <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            Or paste a screenshot with{' '}
            <kbd className="rounded border border-slate-300 bg-white px-1 font-sans text-[11px] dark:border-slate-600 dark:bg-slate-800">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="rounded border border-slate-300 bg-white px-1 font-sans text-[11px] dark:border-slate-600 dark:bg-slate-800">
              V
            </kbd>
          </p>
        </div>
      )}

      {/* Settings */}
      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
        <Field
          label="Language in the image"
          hint={
            lang.latin
              ? 'Pick the main language of the text.'
              : `Read together with English, for mixed ${lang.label} and English text.`
          }
        >
          <div className="relative">
            <Languages
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language in the image"
              className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pr-8 pl-9 text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native ? `${l.label} - ${l.native}` : l.label}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-slate-400"
            >
              ▾
            </span>
          </div>
          {stale > 0 && (
            <button
              type="button"
              onClick={rereadAll}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Read {stale === 1 ? 'it' : `all ${stale}`} again in {lang.label}
            </button>
          )}
        </Field>

        <Field
          label="Text layout"
          hint={LAYOUTS.find((l) => l.id === layout)!.hint}
        >
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            {LAYOUTS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={layout === l.id}
                onClick={() => changeLayout(l.id)}
                className={cn(
                  'rounded-md py-1.5 text-[13px] font-semibold transition-colors',
                  layout === l.id
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {items.length > 0 && (
        <div className="grid gap-5 @3xl:grid-cols-2">
          {/* Image */}
          <div className="min-w-0 space-y-4">
            <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
              {selected?.src ? (
                <div className="relative">
                  <Preview
                    item={selected}
                    showLines={showLines && selected.status === 'done'}
                  />
                  {(selected.status === 'working' ||
                    selected.status === 'queued') && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-950/40">
                      <div
                        role="status"
                        className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-lg dark:bg-slate-900/95 dark:text-slate-100"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        {selected.status === 'queued'
                          ? engine.kind === 'loading'
                            ? 'Waiting for the engine…'
                            : 'Waiting in line…'
                          : `Reading text… ${Math.round((selected.progress ?? 0) * 100)}%`}
                      </div>
                    </div>
                  )}
                </div>
              ) : selected?.status === 'error' ? null : (
                <div
                  role="status"
                  className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Preparing photo…
                </div>
              )}
              {selected?.status === 'error' && !selected.src && (
                <p className="max-w-sm text-center text-sm text-slate-700 dark:text-slate-300">
                  {selected.error}
                </p>
              )}
            </div>

            {selected?.status === 'done' && selected.result!.lines.length > 0 && (
              <Switch
                checked={showLines}
                onChange={setShowLines}
                label="Highlight the lines it found"
              />
            )}

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
                      'relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border-2 bg-slate-100 transition-colors dark:bg-slate-800',
                      selected?.id === it.id
                        ? 'border-blue-500'
                        : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600',
                    )}
                  >
                    {it.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon
                        className="h-5 w-5 text-slate-400"
                        aria-hidden
                      />
                    )}
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
                onClick={() => {
                  clear();
                  setEdits({});
                  setSelectedId(null);
                }}
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

          {/* Text */}
          <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 @3xl:self-start">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                <span className="truncate">
                  {selected ? selected.file.name : 'Text'}
                </span>
              </h3>
              {selected?.status === 'done' && selectedText && (
                <ConfidenceNote item={selected} />
              )}
            </div>

            {selected?.status === 'done' ? (
              selectedText || editedText(selected) !== undefined ? (
                <>
                  <textarea
                    value={selectedText}
                    onChange={(e) => setEdit(selected, e.target.value)}
                    dir="auto"
                    spellCheck={false}
                    aria-label={`Text found in ${selected.file.name}`}
                    className="h-[420px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                  <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="tabular-nums">
                      {countWords(selectedText).toLocaleString()} words ·{' '}
                      {selectedText.length.toLocaleString()} characters
                    </span>
                    {editedText(selected) !== undefined && (
                      <button
                        type="button"
                        onClick={() => setEdit(selected, undefined)}
                        className="font-semibold text-blue-700 hover:underline dark:text-blue-300"
                      >
                        Undo my edits
                      </button>
                    )}
                    <span className="ml-auto">
                      {(selected.result!.ms / 1000).toFixed(1)} s ·{' '}
                      {getLanguage(selected.lang!).label}
                    </span>
                  </p>
                </>
              ) : (
                <div className="flex h-[420px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
                  <ScanText className="h-6 w-6 text-slate-400" aria-hidden />
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No text found
                  </p>
                  <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
                    Check that the language is right and the text is in focus.
                    Handwriting isn’t supported.
                  </p>
                </div>
              )
            ) : selected?.status === 'error' ? (
              <div className="flex h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-200 p-6 text-center dark:border-red-900/60">
                <TriangleAlert className="h-6 w-6 text-red-500" aria-hidden />
                <p className="max-w-xs text-sm text-slate-700 dark:text-slate-300">
                  {selected.error}
                </p>
                <button
                  type="button"
                  onClick={() => retry(selected.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden /> Try again
                </button>
              </div>
            ) : (
              <div className="h-[420px] animate-pulse space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                {[92, 78, 85, 60, 88, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-slate-200 dark:bg-slate-800"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                disabled={!selectedText}
                onClick={copy}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied ? 'Copied' : 'Copy text'}
              </button>
              <button
                type="button"
                disabled={!selectedText}
                onClick={() =>
                  selected &&
                  download(selectedText, `${baseName(selected.file.name)}.txt`)
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Download className="h-4 w-4" aria-hidden />
                Download .txt
              </button>
            </div>
            {done.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  download(
                    combineTexts(
                      done.map((i) => ({ name: i.file.name, text: textOf(i) })),
                    ),
                    'extracted-text.txt',
                  )
                }
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <FileText className="h-4 w-4" aria-hidden />
                Download all {done.length} as one .txt
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
