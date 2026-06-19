'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Download,
  RotateCcw,
  ImageIcon,
  Crop,
  Maximize2,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { CropCanvas } from './CropCanvas';
import { AspectRatioSelector, ASPECT_RATIOS } from './AspectRatioSelector';
import { ResizeControls } from './ResizeControls';
import { CropDropZone } from './CropDropZone';
import { UnsupportedCropDialog } from './UnsupportedCropDialog';
import { useCropEngine } from '../hooks/useCropEngine';
import { useMagickEngine } from '@/features/image/converter/hooks/useMagickEngine';
import {
  CropRegion,
  ResizeDimensions,
  CropMode,
  AspectRatioPreset,
  isSupportedForCrop,
} from '../types/crop';

const OUTPUT_FORMATS = ['png', 'jpg', 'webp'];

export default function CropTool() {
  const { isMagickLoaded } = useMagickEngine();
  const { isProcessing, result, processImage, clearResult } = useCropEngine();
  const inputRef = useRef<HTMLInputElement>(null);

  // -- File state ------------------------------------------------------------
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);

  // -- Dialog state ----------------------------------------------------------
  const [unsupportedOpen, setUnsupportedOpen] = useState(false);
  const [unsupportedName, setUnsupportedName] = useState('');
  const [unsupportedExt, setUnsupportedExt] = useState('');

  // -- Tool state ------------------------------------------------------------
  const [mode, setMode] = useState<CropMode>('crop');
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>('free');
  const [outputFormat, setOutputFormat] = useState('png');
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

  // -- Load file -------------------------------------------------------------
  const loadFile = useCallback(
    (f: File) => {
      if (!isSupportedForCrop(f)) {
        setUnsupportedName(f.name);
        setUnsupportedExt(f.name.split('.').pop()?.toLowerCase() ?? 'unknown');
        setUnsupportedOpen(true);
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
        setCropRegion({ x: 0, y: 0, width: w, height: h });
        setResizeDims({ width: w, height: h, lockAspect: true });
      };
      img.src = url;
    },
    [clearResult, previewUrl],
  );

  // -- Change image — clears state then opens picker -------------------------
  const changeImage = useCallback(() => {
    clearResult();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setNaturalW(0);
    setNaturalH(0);
    setCropRegion({ x: 0, y: 0, width: 0, height: 0 });
    setTimeout(() => inputRef.current?.click(), 50);
  }, [clearResult, previewUrl]);

  // -- Start over — full reset, no picker -----------------------------------
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

  // -- Crop inputs -----------------------------------------------------------
  const handleCropInput = (field: keyof CropRegion, rawVal: string) => {
    const val = parseInt(rawVal) || 0;
    const ratio = ASPECT_RATIOS[aspectPreset];
    setCropRegion((prev) => {
      let next = { ...prev, [field]: val };
      next.x = Math.max(0, Math.min(next.x, naturalW - 1));
      next.y = Math.max(0, Math.min(next.y, naturalH - 1));
      next.width = Math.max(1, Math.min(next.width, naturalW - next.x));
      next.height = Math.max(1, Math.min(next.height, naturalH - next.y));
      if (ratio && field === 'width')
        next.height = Math.min(
          Math.round(next.width / ratio),
          naturalH - next.y,
        );
      if (ratio && field === 'height')
        next.width = Math.min(
          Math.round(next.height * ratio),
          naturalW - next.x,
        );
      return next;
    });
  };

  // -- Aspect ratio change ---------------------------------------------------
  const handleAspectChange = (preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    const ratio = ASPECT_RATIOS[preset];
    if (!ratio || !naturalW || !naturalH) return;
    setCropRegion((prev) => ({
      ...prev,
      height: Math.min(Math.round(prev.width / ratio), naturalH - prev.y),
    }));
  };

  // -- Process + download ----------------------------------------------------
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

  const MODE_TABS: { id: CropMode; icon: typeof Crop; label: string }[] = [
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'resize', icon: Maximize2, label: 'Resize' },
    { id: 'both', icon: ImageIcon, label: 'Crop + Resize' },
  ];

  return (
    <>
      {/* -- Unsupported format dialog --------------------------------------- */}
      <UnsupportedCropDialog
        open={unsupportedOpen}
        onOpenChange={setUnsupportedOpen}
        fileName={unsupportedName}
        fileExtension={unsupportedExt}
        onTryAnother={() => setTimeout(() => inputRef.current?.click(), 50)}
      />

      {/* -- Hidden input for "Change image" button --------------------------- */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/x-tga,image/vnd.adobe.photoshop,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) loadFile(e.target.files[0]);
          e.target.value = '';
        }}
      />

      <div className="space-y-5">
        {/* -- Engine status ------------------------------------------------- */}
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
              <CheckCircle className="w-3.5 h-3.5" /> Engine ready — drop an
              image to begin
            </>
          ) : (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Initializing
              engine…
            </>
          )}
        </div>

        {!file ? (
          /* -- Drop zone ---------------------------------------------------- */
          <CropDropZone isMagickLoaded={isMagickLoaded} onFile={loadFile} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* -- Canvas column ------------------------------------------- */}
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
                <button
                  onClick={changeImage}
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors shrink-0"
                >
                  Change image
                </button>
              </div>

              {/* Canvas */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 overflow-hidden">
                {mode === 'crop' || mode === 'both' ? (
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

            {/* -- Controls sidebar ---------------------------------------- */}
            <div className="space-y-4">
              {/* Mode tabs */}
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
                  <AspectRatioSelector
                    selected={aspectPreset}
                    onChange={handleAspectChange}
                  />

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

                    {/* Quick size presets */}
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
                          if (p.w > naturalW || p.h > naturalH) return null;
                          const isActive =
                            cropRegion.width === p.w &&
                            cropRegion.height === p.h;
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

              {/* Start over */}
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
    </>
  );
}
