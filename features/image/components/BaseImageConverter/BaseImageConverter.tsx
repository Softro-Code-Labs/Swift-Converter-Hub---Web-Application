'use client';

import { useState } from 'react';
import { BaseConverterProps } from '@/features/image/types/converter';
import { ImageFormat, getTargetFormats } from '@/features/image/config/formats';
import { useMagickEngine } from '../../hooks/useMagickEngine';
import { useFileQueue } from '../../hooks/useFileQueue';
import { useImageConverter } from '../../hooks/useImageConverter';
import { DropZone } from './DropZone';
import { FileListItem } from './FileListItem';
import { ConverterToolbar } from './ConverterToolbar';
import { InvalidFileDialog } from './InvalidFileDialog';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function BaseImageConverter({
  sourceFormat,
  targetFormat,
}: BaseConverterProps) {
  const targetFormats = getTargetFormats(sourceFormat.extension);

  const resolvedInitial =
    targetFormat &&
    targetFormats.find((f) => f.extension === targetFormat.extension)
      ? targetFormat
      : targetFormats[0];

  const [selectedTarget] = useState<ImageFormat>(resolvedInitial);

  const { isMagickLoaded } = useMagickEngine();

  const {
    files,
    isAlertOpen,
    invalidFileDetails,
    setIsAlertOpen,
    handleFiles,
    removeFile,
    clearAll,
    updateFile,
  } = useFileQueue(sourceFormat.extension);

  const {
    isConvertingAll,
    isZipping,
    convertAll,
    downloadAll,
    downloadSingle,
  } = useImageConverter(files, updateFile, selectedTarget, isMagickLoaded);

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  return (
    <div className="space-y-4">
      {/* ── Engine status bar ──────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all
        ${
          isMagickLoaded
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400'
            : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400'
        }`}
      >
        <div className="flex items-center gap-2">
          {isMagickLoaded ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <div className="h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
          <span>
            {isMagickLoaded ? 'Engine ready' : 'Initializing engine…'}
          </span>
        </div>

        {isMagickLoaded && (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <span className="font-black text-sm">{sourceFormat.label}</span>
            <ArrowRight className="w-3 h-3" />
            <span className="font-black text-sm">{selectedTarget.label}</span>
          </div>
        )}
      </div>

      {/* ── Progress summary — shown when files exist ──────────────────── */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            {
              label: 'Queued',
              value: idleCount,
              color: 'text-slate-600 dark:text-slate-300',
              bg: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
            },
            {
              label: 'Converted',
              value: successCount,
              color: 'text-emerald-600 dark:text-emerald-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50',
            },
            {
              label: 'Failed',
              value: errorCount,
              color: 'text-red-500 dark:text-red-400',
              bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50',
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} border rounded-xl px-3 py-2 text-center`}
            >
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Drop zone ─────────────────────────────────────────────────── */}
      {files.length < 20 && (
        <DropZone
          isMagickLoaded={isMagickLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
        />
      )}

      {/* ── File list ─────────────────────────────────────────────────── */}
      {files.length > 0 && (
        <div className="space-y-2 max-h-[440px] overflow-y-auto -mr-1 pr-1">
          {files.map((item) => (
            <FileListItem
              key={item.id}
              item={item}
              isConvertingAll={isConvertingAll}
              onDownload={downloadSingle}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}

      {/* ── Toolbar ───────────────────────────────────────────────────── */}
      {files.length > 0 && (
        <ConverterToolbar
          files={files}
          isConvertingAll={isConvertingAll}
          isZipping={isZipping}
          isMagickLoaded={isMagickLoaded}
          onConvertAll={convertAll}
          onDownloadAll={downloadAll}
          onClearAll={clearAll}
        />
      )}

      <InvalidFileDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        fileName={invalidFileDetails.name}
        fileType={invalidFileDetails.type}
        sourceFormatLabel={sourceFormat.label}
      />
    </div>
  );
}
