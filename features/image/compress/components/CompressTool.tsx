'use client';

import { useState, useCallback } from 'react';
import { Loader2, Archive, Trash2, Wand2 } from 'lucide-react';
import { CompressFileItemRow } from './CompressFileItem';
import { QualitySlider } from './QualitySlider';
import { useCompressEngine } from '../hooks/useCompressEngine';
import {
  CompressPreset,
  CompressOptions,
  PRESETS,
  isSupportedForCompress,
  formatBytes,
} from '../types/compress';

// -- Shared components -------------------------------------------------------;
import {
  UnsupportedFormatDialog,
  EngineStatusBar,
  MultiFileDropZone,
} from '@/features/image/shared/components';
import { useMagickEngine } from '@/features/image/shared/hooks/useMagickEngine';

const MAX_FILES = 20;
const COMPRESS_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff,image/avif,image/heic,image/heif';
const SUPPORTED_LABELS = [
  'JPG',
  'PNG',
  'WebP',
  'GIF',
  'BMP',
  'TIFF',
  'AVIF',
  'HEIC',
];

export default function CompressTool() {
  const { isMagickLoaded } = useMagickEngine();
  const {
    files,
    isProcessing,
    isZipping,
    addFiles,
    removeFile,
    clearAll,
    compressAll,
    downloadSingle,
    downloadAll,
  } = useCompressEngine();

  const [preset, setPreset] = useState<CompressPreset>('balanced');
  const [options, setOptions] = useState<CompressOptions>({
    ...PRESETS.balanced,
  });

  const [unsupportedOpen, setUnsupportedOpen] = useState(false);
  const [unsupportedInfo, setUnsupportedInfo] = useState({ name: '', ext: '' });

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      const valid: File[] = [];
      for (const f of newFiles) {
        if (isSupportedForCompress(f)) {
          valid.push(f);
        } else {
          setUnsupportedInfo({
            name: f.name,
            ext: f.name.split('.').pop()?.toLowerCase() ?? 'unknown',
          });
          setUnsupportedOpen(true);
        }
      }
      if (valid.length) addFiles(valid);
    },
    [addFiles],
  );

  const totalOriginal = files.reduce((sum, f) => sum + f.originalSize, 0);
  const totalCompressed = files.reduce(
    (sum, f) => sum + (f.compressedSize ?? 0),
    0,
  );
  const totalSavings =
    totalOriginal > 0 && totalCompressed > 0
      ? Math.round(((totalOriginal - totalCompressed) / totalOriginal) * 100)
      : 0;
  const successCount = files.filter((f) => f.status === 'success').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  return (
    <div className="space-y-5">
      <UnsupportedFormatDialog
        open={unsupportedOpen}
        onOpenChange={setUnsupportedOpen}
        fileName={unsupportedInfo.name}
        fileExtension={unsupportedInfo.ext}
        supportedFormats={SUPPORTED_LABELS}
        reason="This file can't be compressed"
      />

      <EngineStatusBar isLoaded={isMagickLoaded} />

      {/* Summary stats - shown once files have been compressed */}
      {successCount > 0 && (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-black text-slate-700 dark:text-slate-300">
              {formatBytes(totalOriginal)}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Original</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatBytes(totalCompressed)}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Compressed</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl px-3 py-2 text-center">
            <p className="text-lg font-black text-blue-600 dark:text-blue-400">
              -{totalSavings}%
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Saved</p>
          </div>
        </div>
      )}

      {files.length < MAX_FILES && (
        <MultiFileDropZone
          isReady={isMagickLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={MAX_FILES}
          accept={COMPRESS_ACCEPT}
          formatPills={SUPPORTED_LABELS}
        />
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          {/* File list */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {files.map((item) => (
              <CompressFileItemRow
                key={item.id}
                item={item}
                isProcessing={isProcessing}
                onDownload={downloadSingle}
                onRemove={removeFile}
              />
            ))}
          </div>

          {/* Quality controls */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
                Compression settings
              </p>
              <QualitySlider
                preset={preset}
                options={options}
                onPresetChange={setPreset}
                onOptionsChange={setOptions}
              />
            </div>

            {/* Process button - kept inline since the label is dynamic
                (shows count) and a 3rd action (ZIP download) doesn't fit
                ToolActions' 2-button shape */}
            <button
              onClick={() => compressAll(options)}
              disabled={!isMagickLoaded || isProcessing || idleCount === 0}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${
                  isMagickLoaded && !isProcessing && idleCount > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Compressing…
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" /> Compress{' '}
                  {idleCount > 0 ? idleCount : ''}{' '}
                  {idleCount === 1 ? 'Image' : 'Images'}
                </>
              )}
            </button>

            {successCount > 0 && (
              <button
                onClick={downloadAll}
                disabled={isZipping}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isZipping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Archive className="w-4 h-4" />
                )}
                Download ZIP ({successCount})
              </button>
            )}

            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
