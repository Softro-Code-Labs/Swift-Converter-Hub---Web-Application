'use client';

import { useState } from 'react';
import { ImageIcon, Wand2 } from 'lucide-react';
import { FilterPresets } from './FilterPresets';
import { AdjustmentSliders } from './AdjustmentSliders';
import { useAdjustEngine } from '../hooks/useAdjustEngine';
import {
  AdjustmentValues,
  DEFAULT_ADJUSTMENTS,
  FilterPreset,
  FILTER_PRESETS,
  isSupportedForAdjust,
} from '../types/adjust';

// -- Shared components -------------------------------------------------------
import {
  EngineStatusBar,
  FileInfoBar,
  OutputFormatSelector,
  ResultCard,
  SingleFileDropZone,
  ToolActions,
  UnsupportedFormatDialog,
} from '@/features/image/shared/components';
import { useMagickEngine } from '@/features/image/shared/hooks/useMagickEngine';
import { useSingleFileLoader } from '@/features/image/shared/hooks/useSingleFileLoader';

const OUTPUT_FORMATS = ['png', 'jpg', 'webp'];
const ADJUST_ACCEPT = 'image/jpeg,image/png,image/webp,image/bmp,image/avif';
const SUPPORTED_LABELS = ['JPG', 'PNG', 'WebP', 'BMP', 'AVIF'];

export default function AdjustTool() {
  const { isMagickLoaded } = useMagickEngine();
  const { isProcessing, result, applyAdjustments, clearResult } =
    useAdjustEngine();

  const [selectedPreset, setSelectedPreset] = useState<FilterPreset>('none');
  const [adjustments, setAdjustments] = useState<AdjustmentValues>({
    ...DEFAULT_ADJUSTMENTS,
  });
  const [outputFormat, setOutputFormat] = useState('png');

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
    isSupported: isSupportedForAdjust,
    onUnsupported: (f) => {
      setUnsupportedInfo({
        name: f.name,
        ext: f.name.split('.').pop()?.toLowerCase() ?? 'unknown',
      });
      setUnsupportedOpen(true);
    },
    onClear: () => {
      clearResult();
      setAdjustments({ ...DEFAULT_ADJUSTMENTS });
      setSelectedPreset('none');
    },
  });

  const reset = () => {
    baseReset();
    setOutputFormat('png');
  };

  // Combined CSS filter string for live preview (instant, no processing)
  const previewFilter = (() => {
    const parts: string[] = [];
    parts.push(`brightness(${1 + adjustments.brightness / 100})`);
    parts.push(`contrast(${1 + adjustments.contrast / 100})`);
    parts.push(`saturate(${Math.max(0, 1 + adjustments.saturation / 100)})`);
    if (adjustments.hue !== 0) parts.push(`hue-rotate(${adjustments.hue}deg)`);
    if (adjustments.blur > 0) parts.push(`blur(${adjustments.blur / 4}px)`);
    if (adjustments.grayscale) parts.push('grayscale(1)');
    if (adjustments.sepia) parts.push('sepia(0.7)');
    if (adjustments.invert) parts.push('invert(1)');
    return parts.join(' ');
  })();

  const handlePresetChange = (preset: FilterPreset) => {
    setSelectedPreset(preset);
    setAdjustments({ ...DEFAULT_ADJUSTMENTS, ...FILTER_PRESETS[preset] });
  };

  const handleSliderChange = (values: AdjustmentValues) => {
    setAdjustments(values);
    setSelectedPreset('none'); // manual edit clears active preset
  };

  const handleApply = async () => {
    if (!file || !isMagickLoaded) return;
    await applyAdjustments(file, adjustments, outputFormat);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const base = file?.name.substring(0, file.name.lastIndexOf('.')) ?? 'image';
    a.download = `${base}_adjusted.${outputFormat}`;
    a.click();
  };

  return (
    <>
      <UnsupportedFormatDialog
        open={unsupportedOpen}
        onOpenChange={setUnsupportedOpen}
        fileName={unsupportedInfo.name}
        fileExtension={unsupportedInfo.ext}
        supportedFormats={SUPPORTED_LABELS}
        reason="This file can't be adjusted"
        onTryAnother={() => setTimeout(() => inputRef.current?.click(), 50)}
      />

      <div className="space-y-5">
        <EngineStatusBar isLoaded={isMagickLoaded} />

        {!file ? (
          <SingleFileDropZone
            isReady={isMagickLoaded}
            onFile={loadFile}
            inputRef={inputRef}
            accept={ADJUST_ACCEPT}
            icon={ImageIcon}
            formatPills={SUPPORTED_LABELS}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
            {/* -- Preview column ---------------------------------------------- */}
            <div className="space-y-3">
              <FileInfoBar fileName={file.name} onChangeImage={changeImage} />

              {/* Live CSS-filtered preview - instant feedback before processing */}
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result?.url ?? previewUrl}
                  alt="Preview"
                  style={{ filter: result ? 'none' : previewFilter }}
                  className="max-w-full max-h-[440px] object-contain rounded-xl transition-all duration-150"
                />
              </div>

              {result && (
                <ResultCard
                  imageUrl={result.url}
                  label={`Final result - ${result.width} × ${result.height}px · ${result.size}`}
                  onDownload={handleDownload}
                  onDismiss={clearResult}
                  downloadLabel={`Download ${outputFormat.toUpperCase()}`}
                />
              )}
            </div>

            {/* -- Controls sidebar ---------------------------------------------- */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <FilterPresets
                  selected={selectedPreset}
                  onChange={handlePresetChange}
                  thumbnailUrl={previewUrl}
                />
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <AdjustmentSliders
                  values={adjustments}
                  onChange={handleSliderChange}
                />
              </div>

              <OutputFormatSelector
                formats={OUTPUT_FORMATS}
                selected={outputFormat}
                onChange={setOutputFormat}
              />

              <ToolActions
                onProcess={handleApply}
                onReset={reset}
                isProcessing={isProcessing}
                isReady={isMagickLoaded && !!file}
                processIcon={Wand2}
                processLabel="Apply Adjustments"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
