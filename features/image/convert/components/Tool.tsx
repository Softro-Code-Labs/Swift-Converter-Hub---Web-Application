'use client';

import { useState } from 'react';
import { BaseConverterProps } from '@/features/image/convert/types/converter';
import {
  ImageFormat,
  getAllowedTargetFormats,
} from '@/features/image/convert/config/formats';
import { useMagickEngine } from '../../shared/hooks/useMagickEngine';
import { useFileQueue } from '../hooks/useFileQueue';
import { useImageConverter } from '../hooks/useImageConverter';
import { FileListItem } from './FileListItem';
import { ConverterToolbar } from './ConverterToolbar';

// -- Shared components -------------------------------------------------------
import {
  UnsupportedFormatDialog,
  MultiFileDropZone,
} from '../../shared/components';
import { EngineStatusBar } from '../../shared/components/EngineStatusBar';

const CONVERTER_ACCEPT = 'image/*, image/x-icon';
const FORMAT_PILLS = ['JPG', 'PNG', 'WebP', 'HEIC', 'GIF', 'SVG'];

export default function BaseImageConverter({
  sourceFormat,
  targetFormat,
}: BaseConverterProps) {
  const targetFormats = getAllowedTargetFormats(sourceFormat.extension);
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
      <EngineStatusBar
        isLoaded={isMagickLoaded}
        sourceLabel={sourceFormat.label}
        targetLabel={selectedTarget.label}
      />

      {/* -- Progress summary - shown when files exist -------------------- */}
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

      {/* -- Drop zone ----------------------------------------------------- */}
      {files.length < 20 && (
        <MultiFileDropZone
          isReady={isMagickLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={20}
          accept={CONVERTER_ACCEPT}
          formatPills={FORMAT_PILLS}
        />
      )}

      {/* -- File list ------------------------------------------------------ */}
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

      {/* -- Toolbar -------------------------------------------------------- */}
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

      <UnsupportedFormatDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        fileName={invalidFileDetails.name}
        fileExtension={invalidFileDetails.type}
        supportedFormats={[sourceFormat.label]}
        reason={`This converter only accepts ${sourceFormat.label} files`}
        showConverterCta={false}
        onTryAnother={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
