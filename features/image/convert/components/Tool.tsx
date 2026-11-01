'use client';

import {
  getConversionHref,
  getFormatByExtension,
  isConversionAllowed,
} from '../config/formats';

import { BatchSummary } from '@/features/shared/components/BatchSummary';

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
import { EngineStatusBar } from '../../shared/components';

/** If the rejected file can be converted to the same target by another
 *  pair page, offer to take the user (and their file) there. */
function alternativeFor(
  details: { name: string; file?: File },
  target: { extension: string; label: string },
) {
  const ext = details.name.split('.').pop()?.toLowerCase() ?? '';
  const src = getFormatByExtension(ext);
  if (!src || !isConversionAllowed(ext, target.extension)) return undefined;
  return {
    label: `Convert ${src.label} to ${target.label} instead`,
    href: getConversionHref(ext, target.extension),
    file: details.file,
  };
}

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
        <BatchSummary
          waiting={idleCount}
          done={successCount}
          failed={errorCount}
          doneLabel="converted"
        />
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
        alternative={alternativeFor(invalidFileDetails, selectedTarget)}
      />
    </div>
  );
}
