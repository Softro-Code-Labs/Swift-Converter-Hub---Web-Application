'use client';

import { BaseConverterProps } from '@/features/video/shared/types/converterProps';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useVideoFileQueue } from '@/features/video/shared/hooks/useVideoFileQueue';
import { useVideoConverter } from '../hooks/useVideoConverter';
import {
  EngineStatusBar,
  MultiFileDropZone,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { FileListItem } from '@/features/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { Film } from 'lucide-react';

const FORMAT_PILLS = ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV'];

export default function BaseVideoConverter({
  sourceFormat,
  targetFormat,
}: BaseConverterProps) {
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

  const { isConvertingAll, isZipping, convertAll, downloadAll, downloadSingle } =
    useVideoConverter(
      files,
      updateFile,
      targetFormat ?? sourceFormat,
      ffmpeg,
      isFFmpegLoaded,
    );

  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const idleCount = files.filter((f) => f.status === 'idle').length;

  const resolvedTarget = targetFormat ?? sourceFormat;
  const acceptTypes = `.${sourceFormat.extension},video/*`;

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Video engine ready"
        loadingLabel="Initializing video engine…"
        sourceLabel={sourceFormat.label}
        targetLabel={resolvedTarget.label}
      />

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
            <div key={label} className={`${bg} border rounded-xl px-3 py-2 text-center`}>
              <p className={`text-lg font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
        Video encoding is heavier than audio or image processing - larger
        or longer files take longer, and up to {maxFiles} files can be
        queued at once to keep things responsive.
      </p>

      {files.length < maxFiles && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={handleFiles}
          currentCount={files.length}
          maxFiles={maxFiles}
          accept={acceptTypes}
          formatPills={FORMAT_PILLS}
          icon={Film}
          unitLabel="video files"
          ariaLabel="Upload video files"
        />
      )}

      {files.length > 0 && (
        <div className="space-y-2 max-h-[480px] overflow-y-auto -mr-1 pr-1">
          {files.map((item) => (
            <FileListItem
              key={item.id}
              item={item}
              isConvertingAll={isConvertingAll}
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
        reason="This file type isn't a recognized video format"
        showConverterCta={false}
        converterHref="/video/convert"
        onTryAnother={() => setIsAlertOpen(false)}
      />
    </div>
  );
}
