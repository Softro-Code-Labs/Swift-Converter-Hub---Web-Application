'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Wand2,
  ChevronDown,
  Search,
  X,
  RefreshCw,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { IMAGE_FORMATS } from '@/features/image/convert/config/formats';

// ─── Popular conversions ──────────────────────────────────────────────────────

const POPULAR_CONVERSIONS = [
  {
    href: '/image/convert/jpg-to-png',
    label: 'JPG → PNG',
    desc: 'Lossless with transparency',
  },
  {
    href: '/image/convert/png-to-jpg',
    label: 'PNG → JPG',
    desc: 'Compress to universal format',
  },
  {
    href: '/image/convert/jpg-to-webp',
    label: 'JPG → WebP',
    desc: 'Optimise for web loading',
  },
  {
    href: '/image/convert/png-to-webp',
    label: 'PNG → WebP',
    desc: 'Dramatic size reduction',
  },
  {
    href: '/image/convert/jpg-to-ico',
    label: 'JPG → ICO',
    desc: 'Create favicons & icons',
  },
  {
    href: '/image/convert/heic-to-jpg',
    label: 'HEIC → JPG',
    desc: 'iPhone photos to JPG',
  },
  {
    href: '/image/convert/svg-to-png',
    label: 'SVG → PNG',
    desc: 'Rasterize vector graphics',
  },
  {
    href: '/image/convert/webp-to-jpg',
    label: 'WebP → JPG',
    desc: 'Back to universal JPG',
  },
];

// ─── Searchable dropdown ──────────────────────────────────────────────────────

interface DropdownProps {
  label: string;
  value: string;
  onChange: (ext: string) => void;
  options: typeof IMAGE_FORMATS;
  placeholder?: string;
  accentColor?: 'blue' | 'emerald';
}

function SearchableDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select format',
  accentColor = 'blue',
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = IMAGE_FORMATS.find((f) => f.extension === value);

  const accent =
    accentColor === 'emerald'
      ? {
          ring: 'ring-emerald-500/20',
          pill: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
          border:
            'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20',
        }
      : {
          ring: 'ring-blue-500/20',
          pill: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
          border:
            'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20',
        };

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(
      (f) =>
        f.label.toLowerCase().includes(q) ||
        f.extension.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
        {label}
      </label>
      <button
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all focus:outline-none cursor-pointer
          ${
            selected
              ? `${accent.border} text-slate-800 dark:text-slate-100`
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {selected ? (
            <>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-lg shrink-0 ${accent.pill}`}
              >
                {selected.extension.toUpperCase()}
              </span>
              <span className="truncate">{selected.label}</span>
            </>
          ) : (
            <span>{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${selected ? 'text-slate-500' : 'text-slate-300'}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or extension…"
                className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No formats match "{query}"
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.extension}
                  onClick={() => {
                    onChange(opt.extension);
                    setOpen(false);
                    setQuery('');
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors group cursor-pointer
                    ${
                      value === opt.extension
                        ? 'bg-blue-50 dark:bg-blue-950/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 w-11 text-center
                    ${
                      value === opt.extension
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {opt.extension.toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate
                      ${
                        value === opt.extension
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {opt.description}
                    </p>
                  </div>
                  {value === opt.extension && (
                    <span className="text-blue-500 text-xs shrink-0 ml-auto">
                      ✓
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ImageFormatsClient() {
  const router = useRouter();
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');

  const sourceOptions = useMemo(
    () => IMAGE_FORMATS.filter((f) => f.extension !== targetFormat),
    [targetFormat],
  );
  const targetOptions = useMemo(
    () => IMAGE_FORMATS.filter((f) => f.extension !== sourceFormat),
    [sourceFormat],
  );

  const handleRoute = () => {
    if (sourceFormat && targetFormat)
      router.push(`/image/convert/${sourceFormat}-to-${targetFormat}`);
  };

  const handleFormatGridClick = (ext: string) => {
    if (!sourceFormat || sourceFormat === ext) {
      setSourceFormat(ext);
    } else if (!targetFormat) {
      setTargetFormat(ext);
    } else {
      setSourceFormat(ext);
      setTargetFormat('');
    }
  };

  const bothSelected = sourceFormat && targetFormat;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/image"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Image Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Image Format Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {IMAGE_FORMATS.length} formats supported - pick source and target,
              convert instantly
            </p>
          </div>
        </div>

        {/* Converter card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-8">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Format Converter
              </h2>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {IMAGE_FORMATS.length} formats
              </span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block">
              Select source → target → convert
            </span>
          </div>

          {/* Picker */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 relative z-20">
              <SearchableDropdown
                label="Convert from"
                value={sourceFormat}
                onChange={(ext) => {
                  setSourceFormat(ext);
                  if (ext === targetFormat) setTargetFormat('');
                }}
                options={sourceOptions}
                placeholder="Choose source format"
                accentColor="blue"
              />
              <div className="flex sm:flex-col items-center justify-center py-2 sm:pb-4 shrink-0">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300
                  ${
                    bothSelected
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-500'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
              </div>
              <SearchableDropdown
                label="Convert to"
                value={targetFormat}
                onChange={(ext) => {
                  setTargetFormat(ext);
                  if (ext === sourceFormat) setSourceFormat('');
                }}
                options={targetOptions}
                placeholder="Choose target format"
                accentColor="emerald"
              />
            </div>

            {/* Route preview */}
            {bothSelected && (
              <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Route:{' '}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    /image/convert/{sourceFormat}-to-{targetFormat}
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
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              <Wand2 className="w-4 h-4" />
              {bothSelected
                ? `Convert ${sourceFormat.toUpperCase()} → ${targetFormat.toUpperCase()}`
                : 'Select both formats to continue'}
            </button>

            {/* HEIC warning */}
            {(targetFormat === 'heic' || targetFormat === 'heif') && (
              <div className="flex items-start mt-4 gap-2 px-3 py-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  HEIC/HEIF can be read and converted to any format. Saving to
                  HEIC is not supported in browsers - use <strong>WebP</strong>{' '}
                  or <strong>AVIF</strong> for the same file-size benefit.
                </span>
              </div>
            )}
          </div>

          {/* Format grid */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                All formats - click to auto-fill
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-blue-500/30 border border-blue-400" />
                  source
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500/30 border border-emerald-400" />
                  target
                </span>
              </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {IMAGE_FORMATS.map((format) => {
                const isSrc = sourceFormat === format.extension;
                const isTgt = targetFormat === format.extension;
                return (
                  <button
                    key={format.extension}
                    onClick={() => handleFormatGridClick(format.extension)}
                    className={`py-2 px-1 rounded-lg text-center transition-all text-[10px] font-bold border cursor-pointer
                      ${
                        isSrc
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : isTgt
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20'
                      }`}
                  >
                    {format.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular conversions */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-blue-500 inline-block" />
            Popular conversions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_CONVERSIONS.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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

        {/* Live indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            WebAssembly engine ready - conversion happens entirely in your
            browser
          </p>
        </div>
      </div>
    </main>
  );
}
