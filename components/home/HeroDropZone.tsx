'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileQuestion, Search, UploadCloud, X } from 'lucide-react';
import {
  STUDIOS,
  TOOLS,
  getStudio,
  type StudioId,
  type Tool,
} from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { setFileHandoff } from '@/features/shared/lib/fileHandoff';
import { openCommandMenu } from '@/components/shell/CommandMenu';
import { formatBytes } from '@/features/shared/lib/format';
import { cn } from '@/lib/utils';

/* What each kind of file can go into, best match first. Grouped by what the
   file actually is: a .docx and a .pdf are both "documents" but only some
   tools accept each. */
const ACTIONS: Record<
  string,
  { studio: StudioId; label: string; tools: string[] }
> = {
  image: {
    studio: 'image',
    label: 'image',
    tools: [
      'image-convert',
      'image-compress',
      'image-remove-background',
      'image-crop',
      'image-adjust',
      'image-to-pdf',
      'image-ocr',
      'image-metadata',
      'image-base64',
    ],
  },
  audio: {
    studio: 'audio',
    label: 'audio file',
    tools: [
      'audio-convert',
      'audio-trim',
      'audio-compress',
      'audio-volume',
      'audio-merge',
    ],
  },
  video: {
    studio: 'video',
    label: 'video',
    tools: [
      'video-convert',
      'video-compress',
      'video-trim',
      'video-gif',
      'video-extract-audio',
    ],
  },
  pdf: {
    studio: 'file',
    label: 'PDF',
    tools: [
      'pdf-compress',
      'pdf-merge',
      'pdf-to-word',
      'pdf-split',
      'pdf-rotate',
      'pdf-watermark',
    ],
  },
  word: { studio: 'file', label: 'Word document', tools: ['office-to-pdf'] },
  excel: {
    studio: 'file',
    label: 'spreadsheet',
    tools: ['office-to-pdf', 'excel-json'],
  },
  json: { studio: 'data', label: 'JSON file', tools: ['json-formatter'] },
  toml: { studio: 'data', label: 'TOML file', tools: ['toml-json'] },
};

const EXT: Record<string, keyof typeof ACTIONS> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  heic: 'image',
  heif: 'image',
  avif: 'image',
  bmp: 'image',
  tif: 'image',
  tiff: 'image',
  svg: 'image',
  ico: 'image',
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  m4a: 'audio',
  ogg: 'audio',
  aac: 'audio',
  opus: 'audio',
  wma: 'audio',
  aiff: 'audio',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  avi: 'video',
  mkv: 'video',
  m4v: 'video',
  '3gp': 'video',
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  xls: 'excel',
  xlsx: 'excel',
  json: 'json',
  toml: 'toml',
};

/** Tools that take one file at a time get only the first file. */
const MULTI = new Set([
  'image-convert',
  'image-compress',
  'image-remove-background',
  'image-ocr',
  'audio-convert',
  'audio-compress',
  'audio-merge',
  'video-convert',
  'video-compress',
  'video-extract-audio',
  'pdf-merge',
  'image-to-pdf',
]);

type State =
  | { kind: 'idle' }
  | { kind: 'matched'; files: File[]; group: (typeof ACTIONS)[string] }
  | { kind: 'unmatched'; file: File; ext: string };

const extOf = (f: File) => f.name.split('.').pop()?.toLowerCase() ?? '';

export default function HeroDropZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [state, setState] = useState<State>({ kind: 'idle' });

  const take = (list: FileList | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    const key = EXT[extOf(files[0])];
    if (!key) {
      setState({ kind: 'unmatched', file: files[0], ext: extOf(files[0]) });
      return;
    }
    // Keep files of the same kind as the first one.
    setState({
      kind: 'matched',
      files: files.filter((f) => EXT[extOf(f)] === key),
      group: ACTIONS[key],
    });
  };

  const open = (tool: Tool, files: File[]) => {
    setFileHandoff(MULTI.has(tool.id) ? files : files.slice(0, 1), tool.href);
    router.push(tool.href);
  };

  const reset = () => setState({ kind: 'idle' });

  // --- File recognised: offer what to do with it ---------------------------
  if (state.kind === 'matched') {
    const { files, group } = state;
    const studio = getStudio(group.studio);
    const accent = STUDIO_ACCENT[group.studio];
    const tools = group.tools.map((id) => TOOLS.find((t) => t.id === id)!);
    const StudioIcon = studio.icon;
    const total = files.reduce((n, f) => n + f.size, 0);

    return (
      <div
        className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/[0.06] sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none animate-rise-in"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <span
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
              accent.tile,
            )}
          >
            <StudioIcon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-slate-900 dark:text-white">
              {files.length === 1
                ? files[0].name
                : `${files.length} ${group.label}s`}
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              {formatBytes(total)} - stays on this device
            </p>
          </div>
          <button
            onClick={reset}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
            aria-label="Remove file and start again"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-2 mt-5 px-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          What do you want to do with{' '}
          {files.length === 1 ? `this ${group.label}` : 'them'}?
        </p>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <li
                key={tool.id}
                className={cn(i === 0 && tools.length > 1 && 'sm:col-span-2')}
              >
                <button
                  onClick={() => open(tool, files)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                    i === 0
                      ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                      i === 0 ? 'bg-white/15 text-white' : accent.tile,
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-[15px] font-semibold',
                        i === 0
                          ? 'text-white'
                          : 'text-slate-900 dark:text-white',
                      )}
                    >
                      {tool.title}
                    </span>
                    <span
                      className={cn(
                        'block truncate text-[13px]',
                        i === 0
                          ? 'text-blue-100'
                          : 'text-slate-500 dark:text-slate-400',
                      )}
                    >
                      {tool.desc}
                    </span>
                  </span>
                  <ArrowRight
                    className={cn(
                      'h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5',
                      i === 0 ? 'text-white' : 'text-slate-400',
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-[13px]">
          <Link
            href={studio.href}
            className="font-medium text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 dark:text-slate-400 dark:hover:text-white"
          >
            See everything in {studio.name}
          </Link>
          <button
            onClick={reset}
            className="font-medium text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 dark:text-slate-400 dark:hover:text-white"
          >
            Use a different file
          </button>
        </div>
      </div>
    );
  }

  // --- Idle / not recognised ------------------------------------------------
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        data-tour="drop-zone"
        aria-label="Choose a file to see which tools can open it"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          take(e.dataTransfer.files);
        }}
        className={cn(
          'group relative flex min-h-[19rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-colors duration-150',
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-500/10'
            : 'border-slate-300 bg-white hover:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500/60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            take(e.target.files);
            e.target.value = '';
          }}
        />

        {/* Studio swatches: a quiet legend of what can be dropped */}
        <div className="mb-6 flex -space-x-2" aria-hidden>
          {STUDIOS.map((s) => {
            const Icon = s.icon;
            return (
              <span
                key={s.id}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white transition-transform duration-300 dark:border-slate-900',
                  STUDIO_ACCENT[s.id].tile,
                  isDragging ? 'translate-y-1' : 'group-hover:-translate-y-0.5',
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            );
          })}
        </div>

        {state.kind === 'unmatched' ? (
          <div aria-live="polite">
            <FileQuestion
              className="mx-auto mb-2 h-6 w-6 text-slate-400"
              aria-hidden
            />
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              No tool opens .{state.ext || 'that'} files yet
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[15px] text-slate-600 dark:text-slate-400">
              Try another file, or search the tools below.
            </p>
          </div>
        ) : (
          <>
            <p className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isDragging ? 'Let go to see your options' : 'Drop a file here'}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-[15px] text-slate-600 dark:text-slate-400">
              We’ll show you every tool that can open it. Images, audio, video,
              PDFs, Office files and data all work.
            </p>
          </>
        )}

        <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[15px] font-semibold text-white transition-colors group-hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:group-hover:bg-slate-200">
          <UploadCloud className="h-[18px] w-[18px]" aria-hidden />
          Choose a file
        </span>
      </div>
      <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        Know what you need?{' '}
        <button
          type="button"
          onClick={() =>
            openCommandMenu(state.kind === 'unmatched' ? state.ext : '')
          }
          className="inline-flex items-center gap-1 font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-200"
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
          Search all {TOOLS.length} tools
        </button>
      </p>
    </div>
  );
}
