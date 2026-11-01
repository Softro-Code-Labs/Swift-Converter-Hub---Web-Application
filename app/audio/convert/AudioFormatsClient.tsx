'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { peekFileHandoff } from '@/features/shared/lib/fileHandoff';
import { ToolPageHeader } from '@/features/shared/components/page-sections';
import { ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import {
  AUDIO_FORMATS,
  getConversionHref,
} from '@/features/audio/convert/config/formats';

const POPULAR_CONVERSIONS = [
  {
    href: '/audio/convert/mp3-to-wav',
    label: 'MP3 → WAV',
    desc: 'Uncompress for editing',
  },
  {
    href: '/audio/convert/wav-to-mp3',
    label: 'WAV → MP3',
    desc: 'Shrink for sharing',
  },
  {
    href: '/audio/convert/m4a-to-mp3',
    label: 'M4A → MP3',
    desc: 'iPhone voice memos to MP3',
  },
  {
    href: '/audio/convert/mp3-to-flac',
    label: 'MP3 → FLAC',
    desc: 'Lossless container',
  },
  {
    href: '/audio/convert/wav-to-flac',
    label: 'WAV → FLAC',
    desc: 'Compress, keep quality',
  },
  {
    href: '/audio/convert/mp3-to-ogg',
    label: 'MP3 → OGG',
    desc: 'Open-source format',
  },
  {
    href: '/audio/convert/aac-to-mp3',
    label: 'AAC → MP3',
    desc: 'Universal compatibility',
  },
  {
    href: '/audio/convert/mp3-to-opus',
    label: 'MP3 → OPUS',
    desc: 'Modern, efficient codec',
  },
];

export default function AudioFormatsClient() {
  const router = useRouter();
  // If a file was handed over from the home page, start from its format.
  const [sourceFormat, setSourceFormat] = useState(() => {
    const handed = peekFileHandoff()?.files[0];
    const ext = handed?.name.split('.').pop()?.toLowerCase() ?? '';
    return AUDIO_FORMATS.some((f) => f.extension === ext) ? ext : '';
  });
  const [targetFormat, setTargetFormat] = useState('');

  const bothSelected = sourceFormat && targetFormat;

  const handleGridClick = (ext: string) => {
    if (!sourceFormat) {
      setSourceFormat(ext);
      return;
    }
    if (ext === sourceFormat) {
      setSourceFormat('');
      setTargetFormat('');
      return;
    }
    if (!targetFormat) {
      setTargetFormat(ext);
      return;
    }
    setSourceFormat(ext);
    setTargetFormat('');
  };

  const handleRoute = () => {
    if (sourceFormat && targetFormat) {
      router.push(getConversionHref(sourceFormat, targetFormat));
    }
  };

  const getCellState = (ext: string): 'source' | 'target' | 'default' => {
    if (ext === sourceFormat) return 'source';
    if (ext === targetFormat) return 'target';
    return 'default';
  };

  return (
    <div>
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Audio Studio', path: '/audio' },
          { name: 'Format Converter', path: '/audio/convert' },
        ]}
        title="Audio Format Converter"
        description="Pick the format you have and the one you need. The converter opens with batch support and bitrate control."
      />
      <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
        <section aria-labelledby="popular-conversions">
          <h2
            id="popular-conversions"
            className="mb-3 text-lg font-bold text-slate-900 dark:text-white"
          >
            Popular conversions
          </h2>
          <ul className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {POPULAR_CONVERSIONS.map((route) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/5"
                >
                  <span className="text-[15px] font-semibold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                    {route.label}
                  </span>
                  <span className="mt-0.5 text-[13px] leading-snug text-slate-500 dark:text-slate-400">
                    {route.desc}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="sr-only">Choose any two formats</h2>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Format Converter
              </h2>
              <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {AUDIO_FORMATS.length} formats
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {!sourceFormat
                ? 'Step 1: select a source format'
                : !targetFormat
                  ? 'Step 2: select a target format'
                  : 'Ready to convert'}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {AUDIO_FORMATS.map((format) => {
                const state = getCellState(format.extension);
                return (
                  <button
                    key={format.extension}
                    onClick={() => handleGridClick(format.extension)}
                    title={format.description}
                    className={`py-3 px-2 rounded-xl text-center cursor-pointer transition-all text-xs font-bold border
                      ${
                        state === 'source'
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : state === 'target'
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                      }`}
                  >
                    {format.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleRoute}
              disabled={!bothSelected}
              className={`mt-4 w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                ${
                  bothSelected
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              <Wand2 className="w-4 h-4" />
              {bothSelected ? (
                <>
                  Convert {sourceFormat.toUpperCase()}{' '}
                  <ArrowRight className="w-3.5 h-3.5" />{' '}
                  {targetFormat.toUpperCase()}
                </>
              ) : sourceFormat ? (
                'Select a target format to continue'
              ) : (
                'Select a source format to start'
              )}
            </button>

            {sourceFormat && (
              <button
                onClick={() => {
                  setSourceFormat('');
                  setTargetFormat('');
                }}
                className="mt-2 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                Reset selection
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
