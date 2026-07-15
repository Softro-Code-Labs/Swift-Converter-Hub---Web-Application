'use client';

import { useState } from 'react';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useVideoFileQueue } from '@/features/video/shared/hooks/useVideoFileQueue';
import { useVideoCompress } from '../hooks/useVideoCompress';
import { QUALITY_PRESETS, QualityPreset } from '@/features/video/shared/config/formats';
import { QualityPresetSelector } from '@/features/video/shared/components/QualityPresetSelector';
import {
  EngineStatusBar,
  MultiFileDropZone,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { FileListItem } from '@/features/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { Film } from 'lucide-react';

const FORMAT_PILLS = ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV'];

export default function VideoCompressTool() {
  const [presetId, setPresetId] = useState<QualityPreset['id']>('balanced');
  const preset = QUALITY_PRESETS.find((p) => p.id === presetId) ?? QUALITY_PRESETS[1];

  const { isFFmpegLoaded, ffmpeg } = useFFmpegEngine();

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
  } = useVideoFileQueue();

  const { isProcessingAll, isZipping, compressAll, downloadAll, downloadSingle } =
    useVideoCompress(files, updateFile, preset, ffmpeg, isFFmpegLoaded);

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Video engine ready"
        loadingLabel="Initializing video engine…"
      />

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Queued', value: idleCount, color: 'text-slate-600 dark:text-slate-300', bg: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' },
            { label: 'Compressed', value: successCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' },
            { label: 'Failed', value: errorCount, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border rounded-xl px-3 py-2 text-center`}>
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      )}

      <QualityPresetSelector value={presetId} onChange={setPresetId} disabled={isProcessingAll} />

      <p className="text-[11px] text-slate-400 dark:text-slate-500 -mt-2 leading-relaxed">
        Output is always MP4 (the most broadly compatible container) with
        the resolution capped as shown above - a video already smaller than
        the cap is left at its original size, never scaled up.
      </p>

      {files.length < maxFiles && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={maxFiles}
          accept="video/*"
          formatPills={FORMAT_PILLS}
          icon={Film}
          unitLabel="video files"
          ariaLabel="Upload video files to compress"
        />
      )}

      {files.length > 0 && (
        <div className="space-y-2 max-h-[480px] overflow-y-auto -mr-1 pr-1">
          {files.map((item) => (
            <FileListItem
              key={item.id}
              item={item}
              isConvertingAll={isProcessingAll}
              onDownload={downloadSingle}
              onRemove={removeFile}
              icon={Film}
              mediaType="video"
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
        reason="This file type isn't a recognized video format"
        showConverterCta={false}
        converterHref="/video/convert"
        onTryAnother={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
