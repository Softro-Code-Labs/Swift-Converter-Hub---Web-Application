'use client';

import { BatchSummary } from '@/features/shared/components/BatchSummary';

import { useState } from 'react';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useExtractAudioFileQueue } from '../hooks/useExtractAudioFileQueue';
import { useExtractAudio } from '../hooks/useExtractAudio';
import {
  AUDIO_FORMATS,
  getFormatByExtension,
} from '@/features/audio/shared/config/formats';
import {
  BITRATE_PRESETS,
  BitratePresetId,
} from '@/features/audio/convert/types/converter';
import { BitrateSelector } from '@/features/audio/shared/components/BitrateSelector';
import {
  EngineStatusBar,
  MultiFileDropZone,
  OutputFormatSelector,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { FileListItem } from '@/features/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { Film } from 'lucide-react';

const VIDEO_FORMAT_PILLS = ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV'];

export default function ExtractAudioTool() {
  const [targetExt, setTargetExt] = useState('mp3');
  const targetFormat = getFormatByExtension(targetExt) ?? AUDIO_FORMATS[0];

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
    maxFiles,
  } = useExtractAudioFileQueue();

  const {
    isProcessingAll,
    isZipping,
    extractAll,
    downloadAll,
    downloadSingle,
  } = useExtractAudio(
    files,
    updateFile,
    targetFormat,
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
        readyLabel="Engine ready"
        loadingLabel="Initializing engine…"
      />

      {files.length > 0 && (
        <BatchSummary
          waiting={idleCount}
          done={successCount}
          failed={errorCount}
          doneLabel="extracted"
        />
      )}

      <OutputFormatSelector
        formats={AUDIO_FORMATS.map((f) => f.extension)}
        selected={targetExt}
        onChange={setTargetExt}
      />

      {targetFormat.kind === 'lossy' && (
        <BitrateSelector
          value={bitratePreset}
          onChange={setBitratePreset}
          disabled={isProcessingAll}
        />
      )}

      {files.length < maxFiles && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={maxFiles}
          accept="video/*"
          formatPills={VIDEO_FORMAT_PILLS}
          icon={Film}
          unitLabel="video files"
          ariaLabel="Upload video files to extract audio from"
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
              icon={Film}
              mediaType="audio"
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
          onProcessAll={extractAll}
          onDownloadAll={downloadAll}
          onClearAll={clearAll}
          actionVerb="Extract"
          actionVerbIng="Extracting"
        />
      )}

      <UnsupportedFormatDialog
        open={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        fileName={invalidFileDetails.name}
        fileExtension={invalidFileDetails.type}
        supportedFormats={VIDEO_FORMAT_PILLS}
        reason="This file type isn't a recognized video format"
        showConverterCta={false}
        converterHref="/video/convert"
        onTryAnother={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
