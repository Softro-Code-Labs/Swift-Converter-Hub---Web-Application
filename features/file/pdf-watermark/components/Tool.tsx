'use client';

import { useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FilePlus,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  AlertCircle,
  Download,
  Type,
  ImageIcon,
} from 'lucide-react';
import { usePdfWatermark } from '../hooks/usePdfWatermark';
import { WatermarkPreview } from './WatermarkPreview';
import { POSITION_OPTIONS, TEXT_PRESETS } from '../types/pdfWatermark';

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </label>
        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 tabular-nums">
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-rose-500 cursor-pointer"
      />
    </div>
  );
}

function OptionChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-rose-300 hover:text-rose-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

export default function PdfWatermarkTool() {
  const pdfRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const {
    pdfFile,
    pageCount,
    thumbUrl,
    mode,
    setMode,
    textConfig,
    setTextConfig,
    imageConfig,
    setImageConfig,
    isApplying,
    result,
    error,
    loadPdf,
    loadImage,
    applyWatermark,
    clear,
  } = usePdfWatermark();

  const handlePdfInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadPdf(f);
      e.target.value = '';
    },
    [loadPdf],
  );

  const handleImgInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) loadImage(f);
      e.target.value = '';
    },
    [loadImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f && (f.type === 'application/pdf' || f.name.endsWith('.pdf'))) {
        loadPdf(f);
      }
    },
    [loadPdf],
  );

  const handleDownload = useCallback(() => {
    if (!result) return;
    const baseName = pdfFile?.name.replace(/\.pdf$/i, '') ?? 'document';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${baseName}_watermarked.pdf`;
    a.click();
  }, [result, pdfFile]);

  const activeConfig = mode === 'text' ? textConfig : imageConfig;
  const canApply =
    pdfFile &&
    (mode === 'text'
      ? textConfig.text.trim().length > 0
      : imageConfig.imageDataUrl !== null);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/file"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Document Suite
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <FilePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              PDF Watermark
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Add text or image watermarks to every page - live preview,
              processed in your browser
            </p>
          </div>
        </div>

        {/* Drop zone */}
        {!pdfFile ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => pdfRef.current?.click()}
            className="flex flex-col items-center justify-center gap-4 py-16 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/30 dark:hover:bg-rose-950/10 transition-all cursor-pointer"
          >
            <input
              ref={pdfRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfInput}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-500">
              <FilePlus className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Drop a PDF here or{' '}
                <span className="text-rose-600 dark:text-rose-400 font-bold underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Single PDF - watermark applied to every page in your browser
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* -- Controls column ----------------------------------- */}
            <div className="space-y-5 order-2 lg:order-1">
              {/* File info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                    {pdfFile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 tabular-nums">
                    {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                  </p>
                </div>
                <button
                  onClick={clear}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors shrink-0"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                {(['text', 'image'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all
                      ${
                        mode === m
                          ? 'bg-white dark:bg-slate-700 text-rose-700 dark:text-rose-300 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}
                  >
                    {m === 'text' ? (
                      <Type className="w-3.5 h-3.5" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5" />
                    )}
                    {m} watermark
                  </button>
                ))}
              </div>

              {/* -- Text mode controls ------------------------------- */}
              {mode === 'text' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
                  {/* Presets */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Presets
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {TEXT_PRESETS.map((preset) => (
                        <OptionChip
                          key={preset}
                          label={preset}
                          active={textConfig.text === preset}
                          onClick={() =>
                            setTextConfig((c) => ({ ...c, text: preset }))
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {/* Custom text */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      Custom text
                    </label>
                    <input
                      type="text"
                      value={textConfig.text}
                      onChange={(e) =>
                        setTextConfig((c) => ({ ...c, text: e.target.value }))
                      }
                      placeholder="Your watermark text…"
                      maxLength={60}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400/30 transition-all"
                    />
                  </div>

                  {/* Color + font size */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textConfig.color}
                          onChange={(e) =>
                            setTextConfig((c) => ({
                              ...c,
                              color: e.target.value,
                            }))
                          }
                          className="h-9 w-12 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent p-0.5"
                        />
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {textConfig.color.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Slider
                      label="Font size"
                      value={textConfig.fontSize}
                      min={12}
                      max={120}
                      step={2}
                      display={`${textConfig.fontSize}pt`}
                      onChange={(v) =>
                        setTextConfig((c) => ({ ...c, fontSize: v }))
                      }
                    />
                  </div>

                  {/* Opacity + angle */}
                  <Slider
                    label="Opacity"
                    value={textConfig.opacity}
                    min={0.05}
                    max={1}
                    step={0.05}
                    display={`${Math.round(textConfig.opacity * 100)}%`}
                    onChange={(v) =>
                      setTextConfig((c) => ({ ...c, opacity: v }))
                    }
                  />
                  <Slider
                    label="Angle"
                    value={textConfig.angle}
                    min={-180}
                    max={180}
                    step={5}
                    display={`${textConfig.angle}°`}
                    onChange={(v) => setTextConfig((c) => ({ ...c, angle: v }))}
                  />
                </div>
              )}

              {/* -- Image mode controls ------------------------------ */}
              {mode === 'image' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
                  <input
                    ref={imgRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleImgInput}
                  />

                  {!imageConfig.imageDataUrl ? (
                    <button
                      onClick={() => imgRef.current?.click()}
                      className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:bg-rose-50/30 dark:hover:bg-rose-950/10 cursor-pointer transition-all"
                    >
                      <ImageIcon className="w-7 h-7 text-slate-400" />
                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          Choose watermark image
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          JPEG or PNG · logo, stamp, or signature
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageConfig.imageDataUrl}
                        alt="Watermark"
                        className="h-12 w-12 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                          {imageConfig.imageFile?.name}
                        </p>
                        <button
                          onClick={() => imgRef.current?.click()}
                          className="text-[10px] text-rose-500 hover:text-rose-700 font-bold cursor-pointer transition-colors"
                        >
                          Change image
                        </button>
                      </div>
                    </div>
                  )}

                  <Slider
                    label="Scale"
                    value={imageConfig.scale}
                    min={0.05}
                    max={1}
                    step={0.05}
                    display={`${Math.round(imageConfig.scale * 100)}%`}
                    onChange={(v) =>
                      setImageConfig((c) => ({ ...c, scale: v }))
                    }
                  />
                  <Slider
                    label="Opacity"
                    value={imageConfig.opacity}
                    min={0.05}
                    max={1}
                    step={0.05}
                    display={`${Math.round(imageConfig.opacity * 100)}%`}
                    onChange={(v) =>
                      setImageConfig((c) => ({ ...c, opacity: v }))
                    }
                  />
                  <Slider
                    label="Angle"
                    value={imageConfig.angle}
                    min={-180}
                    max={180}
                    step={5}
                    display={`${imageConfig.angle}°`}
                    onChange={(v) =>
                      setImageConfig((c) => ({ ...c, angle: v }))
                    }
                  />
                </div>
              )}

              {/* Position - shared */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Position
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {POSITION_OPTIONS.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => {
                        if (mode === 'text') {
                          setTextConfig((c) => ({ ...c, position: id }));
                        } else {
                          setImageConfig((c) => ({ ...c, position: id }));
                        }
                      }}
                      className={`py-2 rounded-xl border text-[10px] font-bold text-center cursor-pointer transition-all
                        ${
                          (mode === 'text'
                            ? textConfig.position
                            : imageConfig.position) === id
                            ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-rose-300 bg-white dark:bg-slate-900'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-600 dark:text-red-400">
                      Failed to apply watermark
                    </p>
                    <p className="text-[11px] text-red-500 font-mono mt-0.5">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Apply button */}
              <button
                onClick={applyWatermark}
                disabled={!canApply || isApplying}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all
                  ${
                    canApply && !isApplying
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:scale-[0.99]'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Applying to{' '}
                    {pageCount} pages…
                  </>
                ) : (
                  <>
                    <FilePlus className="w-4 h-4" /> Apply watermark to all{' '}
                    {pageCount} pages
                  </>
                )}
              </button>

              {/* Result */}
              {result && !isApplying && (
                <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {pdfFile?.name.replace(/\.pdf$/i, '')}_watermarked.pdf
                    </p>
                    <p className="text-[10px] text-slate-400 tabular-nums">
                      {result.pageCount} pages · {result.sizeLabel}
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* -- Preview column ------------------------------------ */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-4 lg:self-start space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Live preview · Page 1
              </p>
              <WatermarkPreview
                thumbUrl={thumbUrl}
                config={activeConfig}
                canvasWidth={280}
              />
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic">
                Preview updates as you adjust settings
              </p>
            </div>
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Watermarked entirely in your browser using pdf-lib - your files
            never leave your device
          </p>
        </div>
      </div>
    </main>
  );
}
