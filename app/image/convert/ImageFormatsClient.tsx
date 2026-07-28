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
  Lock,
} from 'lucide-react';
import {
  IMAGE_FORMATS,
  getAllowedTargets,
  isConversionAllowed,
  getConversionHref,
} from '@/features/image/convert/config/formats';

// --- Popular conversions ------------------------------------------------------

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

// --- Searchable dropdown ------------------------------------------------------

interface DropdownProps {
  label: string;
  value: string;
  onChange: (ext: string) => void;
  options: typeof IMAGE_FORMATS;
  disabledExtensions?: Set<string>;
  placeholder?: string;
  accentColor?: 'blue' | 'emerald';
  disabled?: boolean;
  disabledReason?: string;
}

function SearchableDropdown({
  label,
  value,
  onChange,
  options,
  disabledExtensions = new Set(),
  placeholder = 'Select format',
  accentColor = 'blue',
  disabled = false,
  disabledReason,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = IMAGE_FORMATS.find((f) => f.extension === value);

  const accent =
    accentColor === 'emerald'
      ? {
          pill: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
          border:
            'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20',
          selectedBg: 'bg-emerald-50 dark:bg-emerald-950/40',
          selectedText: 'text-emerald-600 dark:text-emerald-400',
          selectedPill:
            'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
        }
      : {
          pill: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
          border:
            'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20',
          selectedBg: 'bg-blue-50 dark:bg-blue-950/40',
          selectedText: 'text-blue-600 dark:text-blue-400',
          selectedPill:
            'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
        };

  // Split filtered into allowed and disabled groups
  const { allowed: filteredAllowed, disabledItems: filteredDisabled } =
    useMemo(() => {
      const q = query.toLowerCase().trim();
      const all = q
        ? options.filter(
            (f) =>
              f.label.toLowerCase().includes(q) ||
              f.extension.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q),
          )
        : options;

      return {
        allowed: all.filter((f) => !disabledExtensions.has(f.extension)),
        disabledItems: all.filter((f) => disabledExtensions.has(f.extension)),
      };
    }, [options, query, disabledExtensions]);

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

  const handleOpen = () => {
    if (!disabled) setOpen((p) => !p);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
        {label}
      </label>

      <button
        onClick={handleOpen}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 text-sm font-semibold transition-all focus:outline-none
          ${
            disabled
              ? 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-slate-300 dark:text-slate-600 cursor-not-allowed'
              : selected
                ? `${accent.border} text-slate-800 dark:text-slate-100 cursor-pointer`
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer'
          }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          {disabled ? (
            <span className="flex items-center gap-2 text-slate-400 dark:text-slate-600">
              <Lock className="w-3.5 h-3.5" />
              {disabledReason ?? 'Select a source format first'}
            </span>
          ) : selected ? (
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
        {!disabled && (
          <ChevronDown
            className={`w-4 h-4 shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${selected ? 'text-slate-500' : 'text-slate-300'}`}
          />
        )}
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
          {/* Search */}
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

          <div className="max-h-72 overflow-y-auto p-1.5">
            {filteredAllowed.length === 0 && filteredDisabled.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">
                No formats match &quot;{query}&quot;
              </p>
            )}

            {/* Allowed options */}
            {filteredAllowed.map((opt) => (
              <button
                key={opt.extension}
                onClick={() => {
                  onChange(opt.extension);
                  setOpen(false);
                  setQuery('');
                }}
                className={`w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-3 transition-colors group cursor-pointer
                  ${value === opt.extension ? accent.selectedBg : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 w-11 text-center
                  ${value === opt.extension ? accent.selectedPill : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
                >
                  {opt.extension.toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-semibold truncate
                    ${value === opt.extension ? accent.selectedText : 'text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {opt.description}
                  </p>
                </div>
                {value === opt.extension && (
                  <span
                    className={`text-xs shrink-0 ml-auto ${accent.selectedText}`}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}

            {/* Disabled options - always at bottom */}
            {filteredDisabled.length > 0 && (
              <>
                {filteredAllowed.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-2 mt-1">
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Not compatible with{' '}
                      {value ? value.toUpperCase() : 'this source'}
                    </span>
                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                  </div>
                )}
                {filteredDisabled.map((opt) => (
                  <div
                    key={opt.extension}
                    className="w-full rounded-xl px-3 py-2.5 flex items-center gap-3 opacity-35 cursor-not-allowed"
                  >
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 w-11 text-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                      {opt.extension.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate text-slate-500 dark:text-slate-500">
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {opt.description}
                      </p>
                    </div>
                    <Lock className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer: count */}
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 tabular-nums">
              {filteredAllowed.length} compatible format
              {filteredAllowed.length !== 1 ? 's' : ''}
            </span>
            {filteredDisabled.length > 0 && (
              <span className="text-[10px] text-slate-300 dark:text-slate-600 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                {filteredDisabled.length} incompatible
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Page ---------------------------------------------------------------------

export default function ImageFormatsClient() {
  const router = useRouter();
  const [sourceFormat, setSourceFormat] = useState('');
  const [targetFormat, setTargetFormat] = useState('');

  // Compute allowed targets whenever source changes
  const allowedTargetExtensions = useMemo(() => {
    if (!sourceFormat) return new Set<string>();
    return getAllowedTargets(sourceFormat);
  }, [sourceFormat]);

  // Disabled targets = all formats minus the allowed set minus the source itself
  const disabledTargetExtensions = useMemo(() => {
    if (!sourceFormat) return new Set<string>();
    const all = new Set(IMAGE_FORMATS.map((f) => f.extension));
    const disabled = new Set<string>();
    all.forEach((ext) => {
      if (ext !== sourceFormat && !allowedTargetExtensions.has(ext)) {
        disabled.add(ext);
      }
    });
    return disabled;
  }, [sourceFormat, allowedTargetExtensions]);

  // Source dropdown: all formats available
  // Target dropdown: only filtered by source - enabled/disabled via prop
  const sourceOptions = useMemo(
    () => IMAGE_FORMATS.filter((f) => f.extension !== targetFormat),
    [targetFormat],
  );

  const targetOptions = useMemo(
    () => IMAGE_FORMATS.filter((f) => f.extension !== sourceFormat),
    [sourceFormat],
  );

  const handleSourceChange = (ext: string) => {
    setSourceFormat(ext);
    // If current target is no longer compatible, clear it
    if (targetFormat && !isConversionAllowed(ext, targetFormat)) {
      setTargetFormat('');
    }
  };

  const handleTargetChange = (ext: string) => {
    setTargetFormat(ext);
  };

  const handleRoute = () => {
    if (sourceFormat && targetFormat)
      router.push(getConversionHref(sourceFormat, targetFormat));
  };

  // Format grid click logic
  const handleFormatGridClick = (ext: string) => {
    if (!sourceFormat) {
      // First click always sets source
      setSourceFormat(ext);
      setTargetFormat('');
      return;
    }

    if (ext === sourceFormat) {
      // Clicking source again deselects it
      setSourceFormat('');
      setTargetFormat('');
      return;
    }

    if (!targetFormat) {
      // If target slot is empty and format is allowed, set as target
      if (isConversionAllowed(sourceFormat, ext)) {
        setTargetFormat(ext);
      }
      // If not allowed, set as new source instead
      else {
        setSourceFormat(ext);
        setTargetFormat('');
      }
      return;
    }

    // Both selected - clicking a third format resets source
    setSourceFormat(ext);
    setTargetFormat('');
  };

  const bothSelected = sourceFormat && targetFormat;

  // Grid cell state for each format
  const getGridCellState = (
    ext: string,
  ): 'source' | 'target' | 'allowed' | 'disabled' | 'default' => {
    if (ext === sourceFormat) return 'source';
    if (ext === targetFormat) return 'target';
    if (!sourceFormat) return 'default';
    if (allowedTargetExtensions.has(ext)) return 'allowed';
    return 'disabled';
  };

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
              {IMAGE_FORMATS.length} formats - select source first, then pick a
              compatible target
            </p>
          </div>
        </div>

        {/* Converter card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-8">
          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Format Converter
              </h2>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {IMAGE_FORMATS.length} formats
              </span>
            </div>
            {sourceFormat && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {allowedTargetExtensions.size} targets available for{' '}
                {sourceFormat.toUpperCase()}
              </span>
            )}
            {!sourceFormat && (
              <span className="text-[10px] text-slate-400">
                Step 1: select a source format
              </span>
            )}
          </div>

          {/* Dropdowns */}
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 relative z-20">
              <SearchableDropdown
                label="1. Convert from"
                value={sourceFormat}
                onChange={handleSourceChange}
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
                      : sourceFormat
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-400 animate-pulse'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                  }`}
                >
                  <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                </div>
              </div>

              <SearchableDropdown
                label="2. Convert to"
                value={targetFormat}
                onChange={handleTargetChange}
                options={targetOptions}
                disabledExtensions={disabledTargetExtensions}
                placeholder="Choose target format"
                accentColor="emerald"
                disabled={!sourceFormat}
                disabledReason="Select a source format first"
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
                    : sourceFormat
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              <Wand2 className="w-4 h-4" />
              {bothSelected
                ? `Convert ${sourceFormat.toUpperCase()} → ${targetFormat.toUpperCase()}`
                : sourceFormat
                  ? 'Select a target format to continue'
                  : 'Select a source format to start'}
            </button>
          </div>

          {/* Format grid */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {sourceFormat
                  ? `Compatible targets for ${sourceFormat.toUpperCase()} - click to select`
                  : 'All formats - click to set as source'}
              </p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-blue-500/30 border border-blue-400" />
                  source
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-emerald-500/30 border border-emerald-400" />
                  target
                </span>
                {sourceFormat && (
                  <>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
                      compatible
                    </span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5 text-slate-300 dark:text-slate-600" />
                      incompatible
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
              {IMAGE_FORMATS.map((format) => {
                const state = getGridCellState(format.extension);
                return (
                  <button
                    key={format.extension}
                    onClick={() => handleFormatGridClick(format.extension)}
                    disabled={state === 'disabled'}
                    title={
                      state === 'disabled'
                        ? `Cannot convert ${sourceFormat.toUpperCase()} to ${format.label}`
                        : state === 'allowed'
                          ? `Set ${format.label} as target`
                          : undefined
                    }
                    className={`py-2 px-1 rounded-lg text-center transition-all text-[10px] font-bold border relative
                      ${
                        state === 'source'
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 cursor-pointer'
                          : state === 'target'
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 cursor-pointer'
                            : state === 'allowed'
                              ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 cursor-pointer'
                              : state === 'disabled'
                                ? 'border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer'
                      }`}
                  >
                    {format.label}
                    {state === 'disabled' && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-lg">
                        <Lock className="w-2.5 h-2.5 text-slate-300 dark:text-slate-700" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grid stats */}
            {sourceFormat && (
              <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-400">
                <span className="text-emerald-600 dark:text-emerald-500 font-bold tabular-nums">
                  {allowedTargetExtensions.size} compatible
                </span>
                <span>·</span>
                <span className="tabular-nums">
                  {IMAGE_FORMATS.length - allowedTargetExtensions.size - 1}{' '}
                  incompatible
                </span>
                <button
                  onClick={() => {
                    setSourceFormat('');
                    setTargetFormat('');
                  }}
                  className="ml-auto text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                >
                  Reset selection
                </button>
              </div>
            )}
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
