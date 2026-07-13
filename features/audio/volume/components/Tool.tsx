'use client';

import { useState } from 'react';
import { Volume2, Wand2 } from 'lucide-react';
import { useFFmpegEngine } from '@/features/audio/shared/hooks/useFFmpegEngine';
import { useAudioFileQueue } from '@/features/audio/shared/hooks/useAudioFileQueue';
import { useAudioVolume, VolumeSettings } from '../hooks/useAudioVolume';
import {
  EngineStatusBar,
  MultiFileDropZone,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { FileListItem } from '@/features/audio/shared/components/FileListItem';
import { ProcessToolbar } from '@/features/audio/shared/components/ProcessToolbar';
import { Music2 } from 'lucide-react';

const FORMAT_PILLS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A', 'OPUS'];

function VolumeControl({
  settings,
  onChange,
  disabled,
}: {
  settings: VolumeSettings;
  onChange: (s: VolumeSettings) => void;
  disabled?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        Volume adjustment
      </p>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange({ ...settings, mode: 'normalize' })}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-40
            ${
              settings.mode === 'normalize'
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          Normalize (recommended)
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange({ ...settings, mode: 'manual' })}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all disabled:opacity-40
            ${
              settings.mode === 'manual'
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          Manual gain
        </button>
      </div>

      {settings.mode === 'normalize' ? (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          Automatically brings audio to a consistent, broadcast-standard
          loudness level (EBU R128) - good for uneven recordings or
          preparing audio for podcasts/video.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Gain</span>
            <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">
              {settings.percent}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={300}
            step={5}
            value={settings.percent}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...settings, percent: Number(e.target.value) })
            }
            className="w-full accent-blue-600 disabled:opacity-40"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
            <span>Mute</span>
            <span>100% (original)</span>
            <span>300%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AudioVolumeTool() {
  const [settings, setSettings] = useState<VolumeSettings>({
    mode: 'normalize',
    percent: 100,
  });

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
  } = useAudioFileQueue();

  const { isProcessingAll, isZipping, processAll, downloadAll, downloadSingle } =
    useAudioVolume(files, updateFile, settings, ffmpeg, isFFmpegLoaded);

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Audio engine ready"
        loadingLabel="Initializing audio engine…"
      />

      <VolumeControl
        settings={settings}
        onChange={setSettings}
        disabled={isProcessingAll}
      />

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
          ariaLabel="Upload audio files to adjust volume"
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
          onProcessAll={processAll}
          onDownloadAll={downloadAll}
          onClearAll={clearAll}
          actionVerb="Adjust"
          actionVerbIng="Adjusting"
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
