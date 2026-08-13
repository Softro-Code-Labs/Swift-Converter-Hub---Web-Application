'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  ImageIcon,
  AudioLines,
  Clapperboard,
  FileText,
  HelpCircle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

type ToolOption = { label: string; desc: string; href: string };

type Group = {
  label: string;
  hubHref: string;
  icon: typeof ImageIcon;
  accent: string;
  /** Curated next-step tools for this file type - not every studio tool,
   *  just the ones that actually accept this kind of file. */
  tools: ToolOption[];
};

// Grouped by what the file actually IS, not just its broad media type - a
// dropped .docx and a dropped .pdf both land in "Document Suite" but need
// completely different tool lists, since office-to-pdf only accepts Office
// files and pdf-merge/split/etc. only accept PDFs.
const GROUPS: Record<string, Group> = {
  image: {
    label: 'Image Studio',
    hubHref: '/image',
    icon: ImageIcon,
    accent: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    tools: [
      {
        label: 'Convert format',
        desc: 'PNG, JPG, WebP, HEIC & more',
        href: '/image/convert',
      },
      {
        label: 'Compress',
        desc: 'Shrink the file size',
        href: '/image/compress',
      },
      {
        label: 'Crop & resize',
        desc: 'Adjust dimensions',
        href: '/image/crop',
      },
      {
        label: 'Adjust',
        desc: 'Brightness, contrast & filters',
        href: '/image/adjust',
      },
    ],
  },
  audio: {
    label: 'Audio Studio',
    hubHref: '/audio',
    icon: AudioLines,
    accent:
      'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    tools: [
      {
        label: 'Convert format',
        desc: 'MP3, WAV, FLAC & more',
        href: '/audio/convert',
      },
      {
        label: 'Compress',
        desc: 'Reduce the file size',
        href: '/audio/compress',
      },
      { label: 'Trim', desc: 'Cut to a specific range', href: '/audio/trim' },
      { label: 'Merge', desc: 'Combine multiple files', href: '/audio/merge' },
    ],
  },
  video: {
    label: 'Video Studio',
    hubHref: '/video',
    icon: Clapperboard,
    accent:
      'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
    tools: [
      {
        label: 'Convert format',
        desc: 'MP4, WebM & more',
        href: '/video/convert',
      },
      {
        label: 'Compress',
        desc: 'Reduce the file size',
        href: '/video/compress',
      },
      { label: 'Trim', desc: 'Cut to a specific range', href: '/video/trim' },
      {
        label: 'Extract audio',
        desc: 'Pull out the soundtrack',
        href: '/video/extract-audio',
      },
    ],
  },
  pdf: {
    label: 'Document Suite',
    hubHref: '/file',
    icon: FileText,
    accent: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
    tools: [
      {
        label: 'Merge',
        desc: 'Combine with other PDFs',
        href: '/file/pdf-merge',
      },
      {
        label: 'Compress',
        desc: 'Reduce the file size',
        href: '/file/pdf-compress',
      },
      {
        label: 'Convert to Word',
        desc: 'Editable .docx',
        href: '/file/pdf-to-word',
      },
      {
        label: 'Split',
        desc: 'Extract specific pages',
        href: '/file/pdf-split',
      },
    ],
  },
  office: {
    label: 'Document Suite',
    hubHref: '/file',
    icon: FileText,
    accent: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40',
    tools: [
      {
        label: 'Convert to PDF',
        desc: 'Word or Excel → PDF',
        href: '/file/office-to-pdf',
      },
    ],
  },
};

const EXTENSION_GROUP: Record<string, keyof typeof GROUPS> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  webp: 'image',
  gif: 'image',
  heic: 'image',
  heif: 'image',
  avif: 'image',
  bmp: 'image',
  tiff: 'image',
  svg: 'image',
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  m4a: 'audio',
  ogg: 'audio',
  aac: 'audio',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  avi: 'video',
  mkv: 'video',
  pdf: 'pdf',
  doc: 'office',
  docx: 'office',
  xls: 'office',
  xlsx: 'office',
};

type DetectState =
  | { kind: 'idle' }
  | { kind: 'matched'; fileName: string; group: Group }
  | { kind: 'unmatched'; fileName: string; ext: string };

export default function HeroDropZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [detected, setDetected] = useState<DetectState>({ kind: 'idle' });

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    const groupKey = EXTENSION_GROUP[ext];

    if (!groupKey) {
      setDetected({ kind: 'unmatched', fileName: file.name, ext });
      return;
    }
    setDetected({
      kind: 'matched',
      fileName: file.name,
      group: GROUPS[groupKey],
    });
  };

  const reset = () => setDetected({ kind: 'idle' });

  if (detected.kind === 'matched') {
    const { group } = detected;
    const Icon = group.icon;
    return (
      <div className="mt-8 max-w-xl mx-auto">
        <div
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${group.accent}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {detected.fileName}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                What would you like to do with it?
              </p>
            </div>
            <button
              onClick={reset}
              aria-label="Try a different file"
              className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {group.tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {tool.label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {tool.desc}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>

          {/* "I have no idea" escape hatch - always present, never a dead end */}
          <Link
            href={group.hubHref}
            className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Not sure? Browse all {group.label} tools
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        data-tour="drop-zone"
        aria-label="Drop a file to see which tools you can use, or press Enter to browse"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative flex flex-col items-center justify-center gap-2.5 px-6 py-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />

        {detected.kind === 'unmatched' ? (
          <div
            aria-live="polite"
            className="flex flex-col items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <HelpCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              No .{detected.ext || 'that'} tool yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Try another file, or browse all studios below
            </p>
          </div>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Drop a file to see which tools you can use
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Image, audio, video or document - nothing uploads anywhere
            </p>
          </>
        )}
      </div>

      {/* "I have no idea" escape hatch, available before a file is even dropped */}
      <div className="flex justify-center mt-3">
        <Link
          href="#studios"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Not sure what you need? Browse all tools
        </Link>
      </div>
    </div>
  );
}
