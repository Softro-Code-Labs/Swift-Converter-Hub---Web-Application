'use client';

import { useState } from 'react';
import {
  Combine,
  ChevronUp,
  ChevronDown,
  Trash2,
  Download,
  Loader2,
  Music2,
  RotateCcw,
} from 'lucide-react';
import { useFFmpegEngine } from '@/features/audio/shared/hooks/useFFmpegEngine';
import { useAudioMerge } from '../hooks/useAudioMerge';
import {
  AUDIO_FORMATS,
  getFormatByExtension,
} from '@/features/audio/shared/config/formats';
import {
  EngineStatusBar,
  MultiFileDropZone,
  OutputFormatSelector,
  UnsupportedFormatDialog,
} from '@/features/shared/components';
import { formatBytes, formatDuration } from '@/features/shared/lib/format';

const FORMAT_PILLS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A', 'OPUS'];

export default function AudioMergeTool() {
  const [targetExt, setTargetExt] = useState('mp3');
  const targetFormat = getFormatByExtension(targetExt) ?? AUDIO_FORMATS[0];

  const { isFFmpegLoaded, ffmpeg } = useFFmpegEngine();
  const {
    items,
    status,
    progress,
    outputUrl,
    outputSize,
    errorMessage,
    isAlertOpen,
    invalidFileDetails,
    setIsAlertOpen,
    addFiles,
    removeItem,
    moveItem,
    clearAll,
    merge,
    downloadResult,
  } = useAudioMerge(ffmpeg, isFFmpegLoaded);

  const totalDuration = items.reduce((sum, i) => sum + (i.duration ?? 0), 0);

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Audio engine ready"
        loadingLabel="Initializing audio engine…"
      />

      {status !== 'success' && items.length < 15 && (
        <MultiFileDropZone
          isReady={isFFmpegLoaded}
          onFiles={addFiles}
          currentCount={items.length}
          maxFiles={15}
          accept="audio/*"
          formatPills={FORMAT_PILLS}
          icon={Music2}
          unitLabel="audio files"
          ariaLabel="Upload audio files to merge"
        />
      )}

      {items.length > 0 && status !== 'success' && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Merge order ({items.length} files · {formatDuration(totalDuration)} total)
              </p>
              <button
                onClick={clearAll}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            </div>
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {index + 1}
                </span>
                <Music2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatBytes(item.file.size)}
                    {item.duration !== undefined &&
                      ` · ${formatDuration(item.duration)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    disabled={index === 0}
                    onClick={() => moveItem(item.id, -1)}
                    aria-label="Move up"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={index === items.length - 1}
                    onClick={() => moveItem(item.id, 1)}
                    aria-label="Move down"
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                    className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <OutputFormatSelector
            formats={AUDIO_FORMATS.map((f) => f.extension)}
            selected={targetExt}
            onChange={setTargetExt}
          />

          <button
            disabled={status === 'processing' || !isFFmpegLoaded || items.length < 2}
            onClick={() => merge(targetFormat)}
            className={`w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl cursor-pointer transition-all
              ${
                isFFmpegLoaded && status !== 'processing' && items.length >= 2
                  ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              }`}
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Merging… {Math.round(progress * 100)}%
              </>
            ) : (
              <>
                <Combine className="w-4 h-4" />
                {items.length < 2
                  ? 'Add at least 2 files to merge'
                  : `Merge ${items.length} files into ${targetFormat.label}`}
              </>
            )}
          </button>

          {status === 'error' && errorMessage && (
            <p className="text-xs text-red-500 dark:text-red-400">{errorMessage}</p>
          )}
        </>
      )}

      {status === 'success' && outputUrl && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              Merged {items.length} files - {outputSize}
            </p>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Start over
            </button>
          </div>
          <audio controls src={outputUrl} className="w-full h-9" />
          <button
            onClick={() => downloadResult(targetFormat)}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download {targetFormat.label}
          </button>
        </div>
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
