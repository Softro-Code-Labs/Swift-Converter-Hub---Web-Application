'use client';

import { BatchSummary } from '@/features/shared/components/BatchSummary';

import { useState } from 'react';
import {
  BaseConverterProps,
  BITRATE_PRESETS,
  BitratePresetId,
} from '@/features/audio/convert/types/converter';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useFileQueue } from '../hooks/useFileQueue';
import { useAudioConverter } from '../hooks/useAudioConverter';
import { FileListItem } from '@/features/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { BitrateSelector } from '@/features/audio/shared/components/BitrateSelector';
import {
  EngineStatusBar,
  MultiFileDropZone,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { Music2 } from 'lucide-react';

const FORMAT_PILLS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A', 'OPUS'];

export default function BaseAudioConverter({
  sourceFormat,
  targetFormat,
}: BaseConverterProps) {
  const [bitratePreset, setBitratePreset] =
    useState<BitratePresetId>('standard');
  const bitrateKbps =
    BITRATE_PRESETS.find((p) => p.id === bitratePreset)?.kbps ?? 192;

  const { isFFmpegLoaded, acquireEngine, releaseEngine } = useFFmpegEngine();

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
  } = useAudioConverter(
    files,
    updateFile,
    targetFormat ?? sourceFormat,
    bitrateKbps,
    acquireEngine,
    releaseEngine,
    isFFmpegLoaded,
  );

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  const resolvedTarget = targetFormat ?? sourceFormat;
  const acceptTypes = `.${sourceFormat.extension},audio/*`;

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Audio engine ready"
        loadingLabel="Initializing audio engine…"
        sourceLabel={sourceFormat.label}
        targetLabel={resolvedTarget.label}
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

      {/* -- Quality control - only meaningful for lossy targets ----------- */}
      {resolvedTarget.kind === 'lossy' && (
        <BitrateSelector
          value={bitratePreset}
          onChange={setBitratePreset}
          disabled={isConvertingAll}
        />
      )}

      {/* -- Drop zone ----------------------------------------------------- */}
      {files.length < 20 && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={20}
          accept={acceptTypes}
          formatPills={FORMAT_PILLS}
          icon={Music2}
          unitLabel="audio files"
          ariaLabel="Upload audio files"
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
        <ProcessToolbar
          files={files}
          isProcessing={isConvertingAll}
          isZipping={isZipping}
          isEngineLoaded={isFFmpegLoaded}
          onProcessAll={convertAll}
          onDownloadAll={downloadAll}
          onClearAll={clearAll}
          actionVerb="Convert"
          actionVerbIng="Converting"
        />
      )}

      <UnsupportedFormatDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        fileName={invalidFileDetails.name}
        fileExtension={invalidFileDetails.type}
        supportedFormats={FORMAT_PILLS}
        reason="This file type isn't a recognized audio format"
        showConverterCta={false}
        converterHref="/audio/convert"
        onTryAnother={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
