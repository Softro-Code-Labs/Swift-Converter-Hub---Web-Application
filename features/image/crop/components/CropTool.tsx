'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  Download,
  RotateCcw,
  ImageIcon,
  Crop,
  Maximize2,
  CheckCircle,
  Loader2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CropCanvas } from './CropCanvas';
import { AspectRatioSelector, ASPECT_RATIOS } from './AspectRatioSelector';
import { ResizeControls } from './ResizeControls';
import { useCropEngine } from '../hooks/useCropEngine';
import { useMagickEngine } from '@/features/image/converter/hooks/useMagickEngine';
import {
  CropRegion,
  ResizeDimensions,
  CropMode,
  AspectRatioPreset,
  isSupportedForCrop,
  UNSUPPORTED_FORMATS_FOR_CROP,
} from '../types/crop';

const OUTPUT_FORMATS = ['png', 'jpg', 'webp'];

// Supported formats for quick reference in error dialog
const SUPPORTED_ALTERNATIVES = ['JPG', 'PNG', 'WebP', 'TIFF', 'BMP', 'HEIC'];

export default function CropTool() {
  const { isMagickLoaded } = useMagickEngine();
  const { isProcessing, result, processImage, clearResult } = useCropEngine();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState<string>('');

  const [mode, setMode] = useState<CropMode>('crop');
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>('free');
  const [outputFormat, setOutputFormat] = useState('png');

  // Crop region in NATURAL pixels — single source of truth
  const [cropRegion, setCropRegion] = useState<CropRegion>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [resizeDims, setResizeDims] = useState<ResizeDimensions>({
    width: 0,
    height: 0,
    lockAspect: true,
  });

  // ── Load a new file ───────────────────────────────────────────────────────
  const loadFile = useCallback(
    (f: File) => {
      // Check if format is supported
      if (!isSupportedForCrop(f)) {
        const ext = f.name.split('.').pop()?.toUpperCase() ?? 'this format';
        setUnsupportedFile(ext);
        return;
      }

      clearResult();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setNaturalW(w);
        setNaturalH(h);
        // Default crop = full image
        setCropRegion({ x: 0, y: 0, width: w, height: h });
        setResizeDims({ width: w, height: h, lockAspect: true });
      };
      img.src = url;
    },
    [clearResult, previewUrl],
  );

  // ── "Change image" — remove file and open picker immediately ─────────────
  const changeImage = useCallback(() => {
    clearResult();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setNaturalW(0);
    setNaturalH(0);
    setCropRegion({ x: 0, y: 0, width: 0, height: 0 });
    // Open file picker after state clears
    setTimeout(() => inputRef.current?.click(), 50);
  }, [clearResult, previewUrl]);

  // ── "Start over" — full reset, no file picker ─────────────────────────────
  const reset = useCallback(() => {
    clearResult();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setNaturalW(0);
    setNaturalH(0);
    setCropRegion({ x: 0, y: 0, width: 0, height: 0 });
    setAspectPreset('free');
    setMode('crop');
    setOutputFormat('png');
  }, [clearResult, previewUrl]);

  // ── Crop region input editing (natural pixels) ────────────────────────────
  const handleCropInput = (field: keyof CropRegion, rawVal: string) => {
    const val = parseInt(rawVal) || 0;
    const ratio = ASPECT_RATIOS[aspectPreset];

    setCropRegion((prev) => {
      let next = { ...prev, [field]: val };

      // Clamp to image bounds
      next.x = Math.max(0, Math.min(next.x, naturalW - 1));
      next.y = Math.max(0, Math.min(next.y, naturalH - 1));
      next.width = Math.max(1, Math.min(next.width, naturalW - next.x));
      next.height = Math.max(1, Math.min(next.height, naturalH - next.y));

      // Enforce aspect ratio if set and user changed width
      if (ratio && field === 'width') {
        next.height = Math.min(
          Math.round(next.width / ratio),
          naturalH - next.y,
        );
      }
      if (ratio && field === 'height') {
        next.width = Math.min(
          Math.round(next.height * ratio),
          naturalW - next.x,
        );
      }

      return next;
    });
  };

  // ── Aspect ratio change — recompute crop to match ─────────────────────────
  const handleAspectChange = (preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    const ratio = ASPECT_RATIOS[preset];
    if (!ratio || !naturalW || !naturalH) return;

    // Keep current width, adjust height to match ratio
    setCropRegion((prev) => {
      const newH = Math.min(Math.round(prev.width / ratio), naturalH - prev.y);
      return { ...prev, height: newH };
    });
  };

  // ── Process ───────────────────────────────────────────────────────────────
  const handleProcess = async () => {
    if (!file || !isMagickLoaded) return;
    const applyCrop = mode === 'crop' || mode === 'both' ? cropRegion : null;
    const applyResize =
      mode === 'resize' || mode === 'both' ? resizeDims : null;
    await processImage(file, applyCrop, applyResize, outputFormat);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const base = file?.name.substring(0, file.name.lastIndexOf('.')) ?? 'image';
    a.download = `${base}_${mode}.${outputFormat}`;
    a.click();
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) loadFile(f);
    },
    [loadFile],
  );

  const MODE_TABS: { id: CropMode; icon: typeof Crop; label: string }[] = [
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'resize', icon: Maximize2, label: 'Resize' },
    { id: 'both', icon: ImageIcon, label: 'Crop + Resize' },
  ];

  // ── Unsupported format dialog ─────────────────────────────────────────────
  if (unsupportedFile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-5 max-w-md mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {unsupportedFile} files can't be cropped
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The crop tool doesn't support{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              .{unsupportedFile.toLowerCase()}
            </strong>{' '}
            files. Convert your image to a supported format first, then crop it.
          </p>
        </div>

        {/* Supported formats */}
        <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-left">
            Supported formats
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_ALTERNATIVES.map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/image"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            Go to Format Converter
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              setUnsupportedFile('');
              setTimeout(() => inputRef.current?.click(), 50);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
          >
            Try a different file
          </button>
        </div>

        {/* Hidden input still available */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            setUnsupportedFile('');
            if (e.target.files?.[0]) loadFile(e.target.files[0]);
            e.target.value = '';
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Hidden file input — always in DOM */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) loadFile(e.target.files[0]);
          e.target.value = ''; // reset so same file can be re-selected
        }}
      />

      {/* ── Engine status ───────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all
        ${
          isMagickLoaded
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
            : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400'
        }`}
      >
        {isMagickLoaded ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" /> Engine ready — drop an image
            to begin
          </>
        ) : (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Initializing
            engine…
          </>
        )}
      </div>

      {!file ? (
        /* ── Drop zone ────────────────────────────────────────────────── */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => isMagickLoaded && inputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200
            ${!isMagickLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${
              isDragging
                ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30'
            }`}
        >
          <div className="flex flex-col items-center justify-center gap-3 py-14 px-6 text-center">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors
              ${
                isDragging
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-500'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isDragging ? (
                  'Drop image here'
                ) : (
                  <>
                    Drag & drop or{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-bold underline underline-offset-2">
                      browse
                    </span>
                  </>
                )}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                PNG, JPG, WebP, HEIC, TIFF, BMP and more
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          {/* ── Canvas column ─────────────────────────────────────────── */}
          <div className="space-y-3">
            {/* File info bar */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 min-w-0">
                <ImageIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {file.name}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {naturalW} × {naturalH}px
                </span>
              </div>
              {/* ✅ FIX: "Change image" removes current + opens picker */}
              <button
                onClick={changeImage}
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
              >
                Change image
              </button>
            </div>

            {/* Canvas / preview */}
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 overflow-hidden">
              {mode === 'crop' || mode === 'both' ? (
                /* ✅ FIX: canvas is controlled by cropRegion state — single source of truth */
                <CropCanvas
                  imageUrl={previewUrl}
                  naturalWidth={naturalW}
                  naturalHeight={naturalH}
                  aspectRatio={aspectPreset}
                  cropRegion={cropRegion}
                  onCropChange={setCropRegion}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-[400px] object-contain mx-auto rounded-xl"
                />
              )}
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Result — {result.width} × {result.height}px ·{' '}
                      {result.size}
                    </span>
                  </div>
                  <button
                    onClick={clearResult}
                    className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Result"
                  className="max-w-full max-h-[300px] object-contain mx-auto rounded-xl border border-slate-200 dark:border-slate-700"
                />
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Download {outputFormat.toUpperCase()}
                </button>
              </div>
            )}
          </div>

          {/* ── Controls sidebar ──────────────────────────────────────── */}
          <div className="space-y-4">
            {/* Mode */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Mode
                </p>
              </div>
              <div className="p-3 grid grid-cols-3 gap-1.5">
                {MODE_TABS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setMode(id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-center transition-all
                      ${
                        mode === id
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-300'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[9px] font-bold leading-tight">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Crop controls */}
            {(mode === 'crop' || mode === 'both') && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                {/* ✅ FIX: aspect ratio change updates canvas */}
                <AspectRatioSelector
                  selected={aspectPreset}
                  onChange={handleAspectChange}
                />

                {/* ✅ FIX: editable crop region inputs that update canvas */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Crop region (px)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { field: 'x' as const, label: 'X offset' },
                      { field: 'y' as const, label: 'Y offset' },
                      { field: 'width' as const, label: 'Width' },
                      { field: 'height' as const, label: 'Height' },
                    ].map(({ field, label }) => (
                      <div key={field} className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          {label}
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={
                            field === 'x' || field === 'width'
                              ? naturalW
                              : naturalH
                          }
                          value={Math.round(cropRegion[field])}
                          onChange={(e) =>
                            handleCropInput(field, e.target.value)
                          }
                          className="w-full px-2 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Common size presets */}
                  <div className="space-y-1 pt-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      Quick sizes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: '1920×1080', w: 1920, h: 1080 },
                        { label: '1280×720', w: 1280, h: 720 },
                        { label: '1080×1080', w: 1080, h: 1080 },
                        { label: '800×600', w: 800, h: 600 },
                        { label: '512×512', w: 512, h: 512 },
                      ].map((p) => {
                        // Only show if fits in image
                        if (p.w > naturalW || p.h > naturalH) return null;
                        const isActive =
                          cropRegion.width === p.w && cropRegion.height === p.h;
                        return (
                          <button
                            key={p.label}
                            onClick={() =>
                              setCropRegion((prev) => ({
                                ...prev,
                                width: Math.min(p.w, naturalW - prev.x),
                                height: Math.min(p.h, naturalH - prev.y),
                              }))
                            }
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border transition-all
                              ${
                                isActive
                                  ? 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'
                              }`}
                          >
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resize controls */}
            {(mode === 'resize' || mode === 'both') && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <ResizeControls
                  dimensions={resizeDims}
                  originalWidth={naturalW}
                  originalHeight={naturalH}
                  onChange={setResizeDims}
                />
              </div>
            )}

            {/* Output format */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Output format
              </p>
              <div className="flex gap-2">
                {OUTPUT_FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-black uppercase transition-all
                      ${
                        outputFormat === fmt
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'
                      }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Process button */}
            <button
              onClick={handleProcess}
              disabled={!isMagickLoaded || isProcessing || !file}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${
                  isMagickLoaded && !isProcessing && file
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                </>
              ) : mode === 'crop' ? (
                <>
                  <Crop className="w-4 h-4" /> Apply Crop
                </>
              ) : mode === 'resize' ? (
                <>
                  <Maximize2 className="w-4 h-4" /> Apply Resize
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" /> Crop & Resize
                </>
              )}
            </button>

            {/* ✅ FIX: Start over = full reset only, no file picker */}
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
