'use client';

import { BatchSummary } from '@/features/shared/components/BatchSummary';

import { useState } from 'react';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useAudioFileQueue } from '@/features/audio/shared/hooks/useAudioFileQueue';
import { useAudioCompress } from '../hooks/useAudioCompress';
import { BITRATE_PRESETS } from '@/features/audio/convert/types/converter';
import {
  BitratePresetSelector,
  CompressBitratePresetId,
} from '@/features/audio/compress/components/BitratePresetSelector';
import { CustomBitrateControls } from '@/features/audio/compress/components/CustomBitrateControls';
import { CUSTOM_BITRATE_DEFAULT } from '@/features/audio/shared/config/formats';
import {
  EngineStatusBar,
  MultiFileDropZone,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { FileListItem } from '@/features/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { Music2 } from 'lucide-react';

const FORMAT_PILLS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A', 'OPUS'];

export default function AudioCompressTool() {
  const [presetId, setPresetId] = useState<CompressBitratePresetId>('standard');
  const [customKbps, setCustomKbps] = useState(CUSTOM_BITRATE_DEFAULT);
  const bitrateKbps =
    presetId === 'custom'
      ? customKbps
      : (BITRATE_PRESETS.find((p) => p.id === presetId)?.kbps ?? 192);

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
  } = useAudioFileQueue();

  const {
    isProcessingAll,
    isZipping,
    compressAll,
    downloadAll,
    downloadSingle,
  } = useAudioCompress(
    files,
    updateFile,
    bitrateKbps,
    acquireEngine,
    releaseEngine,
    isFFmpegLoaded,
  );

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Audio engine ready"
        loadingLabel="Initializing audio engine…"
      />

      {files.length > 0 && (
        <BatchSummary
          waiting={idleCount}
          done={successCount}
          failed={errorCount}
          doneLabel="compressed"
        />
      )}

      <BitratePresetSelector
        value={presetId}
        onChange={setPresetId}
        disabled={isProcessingAll}
      />

      {presetId === 'custom' && (
        <CustomBitrateControls
          kbps={customKbps}
          onKbpsChange={setCustomKbps}
          disabled={isProcessingAll}
        />
      )}

      <p className="text-[13px] text-slate-400 dark:text-slate-500 -mt-2 leading-relaxed">
        Already-compressed formats (MP3, OGG, AAC, M4A, OPUS) are re-encoded at
        your chosen bitrate. Lossless sources (WAV, FLAC) are converted to MP3,
        since compressing lossless audio means becoming lossy - there&apos;s no
        smaller-but-still-lossless option beyond FLAC&apos;s own compression.
      </p>

      {files.length < 20 && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={20}
          accept="audio/*"
          formatPills={FORMAT_PILLS}
          icon={Music2}
          unitLabel="audio files"
          ariaLabel="Upload audio files to compress"
        />
      )}

      {files.length > 0 && (
        <div className="space-y-2 max-h-[440px] overflow-y-auto -mr-1 pr-1">
          {files.map((item) => (
            <FileListItem
              key={item.id}
              item={item}
              isConvertingAll={isProcessingAll}
              onDownload={downloadSingle}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <ProcessToolbar
          files={files}
          isProcessing={isProcessingAll}
          isZipping={isZipping}
          isEngineLoaded={isFFmpegLoaded}
          onProcessAll={compressAll}
          onDownloadAll={downloadAll}
          onClearAll={clearAll}
          actionVerb="Compress"
          actionVerbIng="Compressing"
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
