'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Wand2, Layers, RefreshCw } from 'lucide-react';
import {
  VIDEO_FORMATS,
  getConversionHref,
} from '@/features/video/convert/config/formats';

const POPULAR_CONVERSIONS = [
  {
    href: '/video/convert/mov-to-mp4',
    label: 'MOV → MP4',
    desc: 'iPhone video to universal format',
  },
  {
    href: '/video/convert/webm-to-mp4',
    label: 'WEBM → MP4',
    desc: 'Wider device compatibility',
  },
  {
    href: '/video/convert/mp4-to-webm',
    label: 'MP4 → WEBM',
    desc: 'Smaller, web-native format',
  },
  {
    href: '/video/convert/avi-to-mp4',
    label: 'AVI → MP4',
    desc: 'Modernize an old file',
  },
  {
    href: '/video/convert/mkv-to-mp4',
    label: 'MKV → MP4',
    desc: 'Universal playback',
  },
  {
    href: '/video/convert/mp4-to-mov',
    label: 'MP4 → MOV',
    desc: 'For editing in QuickTime/Final Cut',
  },
  {
    href: '/video/convert/mp4-to-avi',
    label: 'MP4 → AVI',
    desc: 'Legacy software compatibility',
  },
  {
    href: '/video/convert/mov-to-webm',
    label: 'MOV → WEBM',
    desc: 'Smaller file for the web',
  },
];

export default function VideoFormatsClient() {
  const router = useRouter();
  const [sourceFormat, setSourceFormat] = useState('');
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/video"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Video Studio
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Video Format Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {VIDEO_FORMATS.length} formats - pick a source, then a target, to
              open the converter
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Format Converter
              </h2>
              <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                {VIDEO_FORMATS.length} formats
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              {!sourceFormat
                ? 'Step 1: select a source format'
                : !targetFormat
                  ? 'Step 2: select a target format'
                  : 'Ready to convert'}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {VIDEO_FORMATS.map((format) => {
                const state = getCellState(format.extension);
                return (
                  <button
                    key={format.extension}
                    onClick={() => handleGridClick(format.extension)}
                    title={format.description}
                    className={`py-3 px-2 rounded-xl text-center cursor-pointer transition-all text-xs font-bold border
                      ${
                        state === 'source'
                          ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                          : state === 'target'
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-700 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
                      }`}
                  >
                    {format.label}
                  </button>
                );
              })}
            </div>

            {bothSelected && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Route:{' '}
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    /video/convert/{sourceFormat}-to-{targetFormat}
                  </span>
                </p>
              </div>
            )}

            <button
              onClick={handleRoute}
              disabled={!bothSelected}
              className={`mt-4 w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
                ${
                  bothSelected
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-500/20 active:scale-[0.99] cursor-pointer'
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
                className="mt-2 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                Reset selection
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-purple-500 inline-block" />
            Popular conversions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_CONVERSIONS.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/30 dark:hover:bg-purple-950/10 transition-all"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {route.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {route.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            FFmpeg WebAssembly engine - conversion happens entirely in your
            browser
          </p>
        </div>
      </div>
    </main>
  );
}
