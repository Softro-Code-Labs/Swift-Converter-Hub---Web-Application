'use client';

import { useState } from 'react';
import { Crop, Maximize2, ImageIcon } from 'lucide-react';
import { CropCanvas } from './CropCanvas';
import { AspectRatioSelector, ASPECT_RATIOS } from './AspectRatioSelector';
import { ResizeControls } from './ResizeControls';
import { CropModeTabs } from './CropModeTabs';
import { CropRegionInputs } from './CropRegionInputs';
import { useCropEngine } from '../hooks/useCropEngine';
import {
  CropRegion,
  ResizeDimensions,
  CropMode,
  AspectRatioPreset,
  isSupportedForCrop,
  SUPPORTED_CROP_FORMATS,
} from '../types/crop';

// -- Shared components -------------------------------------------------------
import {
  EngineStatusBar,
  FileInfoBar,
  OutputFormatSelector,
  ResultCard,
  SingleFileDropZone,
  ToolActions,
  UnsupportedFormatDialog,
} from '../../shared/components';
import { useMagickEngine } from '@/features/image/shared/hooks/useMagickEngine';
import { useSingleFileLoader } from '../../shared/hooks/useSingleFileLoader';

const OUTPUT_FORMATS = ['png', 'jpg', 'webp'];
const CROP_ACCEPT = 'image/jpeg,image/png,image/webp,image/bmp,image/avif';

export default function CropTool() {
  const { isMagickLoaded } = useMagickEngine();
  const { isProcessing, result, processImage, clearResult } = useCropEngine();

  const [mode, setMode] = useState<CropMode>('crop');
  const [aspectPreset, setAspectPreset] = useState<AspectRatioPreset>('free');
  const [outputFormat, setOutputFormat] = useState('png');
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
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

  const [unsupportedOpen, setUnsupportedOpen] = useState(false);
  const [unsupportedInfo, setUnsupportedInfo] = useState({ name: '', ext: '' });

  const {
    file,
    previewUrl,
    inputRef,
    loadFile,
    changeImage,
    reset: baseReset,
  } = useSingleFileLoader({
    isSupported: isSupportedForCrop,
    onUnsupported: (f) => {
      setUnsupportedInfo({
        name: f.name,
        ext: f.name.split('.').pop()?.toLowerCase() ?? 'unknown',
      });
      setUnsupportedOpen(true);
    },
    onLoaded: (f, url) => {
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
    onClear: () => {
      clearResult();
      setNaturalW(0);
      setNaturalH(0);
      setCropRegion({ x: 0, y: 0, width: 0, height: 0 });
    },
  });

  const reset = () => {
    baseReset();
    setAspectPreset('free');
    setMode('crop');
    setOutputFormat('png');
  };

  const handleCropFieldChange = (field: keyof CropRegion, rawVal: string) => {
    const val = parseInt(rawVal) || 0;
    const ratio = ASPECT_RATIOS[aspectPreset];
    setCropRegion((prev) => {
      const next = { ...prev, [field]: val };
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

  const handleQuickSize = (w: number, h: number) => {
    setCropRegion((prev) => ({
      ...prev,
      width: Math.min(w, naturalW - prev.x),
      height: Math.min(h, naturalH - prev.y),
    }));
  };

  const handleAspectChange = (preset: AspectRatioPreset) => {
    setAspectPreset(preset);
    const ratio = ASPECT_RATIOS[preset];
    if (!naturalW || !naturalH) return;

    if (!ratio) {
      return;
    }

    const baseSize = Math.round(Math.min(naturalW, naturalH) * 0.6);
    const w = Math.min(baseSize, naturalW);
    const h = Math.min(Math.round(w / ratio), naturalH);
    const x = Math.round((naturalW - w) / 2);
    const y = Math.round((naturalH - h) / 2);

    setCropRegion({ x, y, width: w, height: h });
  };

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

  const formatPills = SUPPORTED_CROP_FORMATS.map((f) => f.toUpperCase());

  const PROCESS_ICON =
    mode === 'crop' ? Crop : mode === 'resize' ? Maximize2 : ImageIcon;
  const PROCESS_LABEL =
    mode === 'crop'
      ? 'Apply Crop'
      : mode === 'resize'
        ? 'Apply Resize'
        : 'Crop & Resize';

  return (
    <>
      <UnsupportedFormatDialog
        open={unsupportedOpen}
        onOpenChange={setUnsupportedOpen}
        fileName={unsupportedInfo.name}
        fileExtension={unsupportedInfo.ext}
        supportedFormats={formatPills}
        reason="The crop tool can't process this file type"
        onTryAnother={() => setTimeout(() => inputRef.current?.click(), 50)}
      />

      <div className="space-y-5">
        <EngineStatusBar isLoaded={isMagickLoaded} />

        {!file ? (
          <SingleFileDropZone
            isReady={isMagickLoaded}
            onFile={loadFile}
            inputRef={inputRef}
            accept={CROP_ACCEPT}
            icon={ImageIcon}
            formatPills={formatPills}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* -- Canvas column -------------------------------------------- */}
            <div className="space-y-3">
              <FileInfoBar
                fileName={file.name}
                meta={`${naturalW} × ${naturalH}px`}
                onChangeImage={changeImage}
              />

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
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain mx-auto rounded-xl"
                  />
                )}
              </div>

              {result && (
                <ResultCard
                  imageUrl={result.url}
                  label={`Result - ${result.width} × ${result.height}px · ${result.size}`}
                  onDownload={handleDownload}
                  onDismiss={clearResult}
                  downloadLabel={`Download ${outputFormat.toUpperCase()}`}
                />
              )}
            </div>

            {/* -- Controls sidebar ------------------------------------------ */}
            <div className="space-y-4">
              <CropModeTabs mode={mode} onChange={setMode} />

              {(mode === 'crop' || mode === 'both') && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4">
                  <AspectRatioSelector
                    selected={aspectPreset}
                    onChange={handleAspectChange}
                  />
                  <CropRegionInputs
                    cropRegion={cropRegion}
                    naturalW={naturalW}
                    naturalH={naturalH}
                    onFieldChange={handleCropFieldChange}
                    onQuickSize={handleQuickSize}
                  />
                </div>
              )}

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

              <OutputFormatSelector
                formats={OUTPUT_FORMATS}
                selected={outputFormat}
                onChange={setOutputFormat}
              />

              <ToolActions
                onProcess={handleProcess}
                onReset={reset}
                isProcessing={isProcessing}
                isReady={isMagickLoaded && !!file}
                processIcon={PROCESS_ICON}
                processLabel={PROCESS_LABEL}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
