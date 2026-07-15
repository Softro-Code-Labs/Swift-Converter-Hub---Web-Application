'use client';

import { useRef, useState } from 'react';
import {
  Scissors,
  Download,
  RotateCcw,
  Loader2,
  Film,
  Play,
} from 'lucide-react';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import { useVideoTrim } from '../hooks/useVideoTrim';
import {
  SingleFileDropZone,
  EngineStatusBar,
} from '@/features/shared/components';
import { formatBytes, formatDuration } from '@/features/shared/lib/format';

const FORMAT_PILLS = ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV'];

function TimeField({
  label,
  seconds,
  max,
  onChange,
  onUseCurrent,
}: {
  label: string;
  seconds: number;
  max: number;
  onChange: (seconds: number) => void;
  onUseCurrent: () => void;
}) {
  return (
    <div className="flex-1 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
          {formatDuration(seconds)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={0.1}
        value={seconds}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-purple-600"
      />
      <button
        type="button"
        onClick={onUseCurrent}
        className="flex items-center gap-1 text-[10px] font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer transition-colors"
      >
        <Play className="w-2.5 h-2.5" />
        Use current position
      </button>
    </div>
  );
}

export default function VideoTrimTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { isFFmpegLoaded, ffmpeg } = useFFmpegEngine();
  const { state, loadFile, setRange, trim, reset, downloadResult } =
    useVideoTrim(ffmpeg, isFFmpegLoaded);

  const handleFile = async (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    await loadFile(file);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    reset();
  };

  const selectionPct = {
    start: state.duration ? (state.startTime / state.duration) * 100 : 0,
    end: state.duration ? (state.endTime / state.duration) * 100 : 100,
  };

  return (
    <div className="space-y-4">
      <EngineStatusBar
        isLoaded={isFFmpegLoaded}
        readyLabel="Video engine ready"
        loadingLabel="Initializing video engine…"
      />

      {!state.file ? (
        <SingleFileDropZone
          isReady={isFFmpegLoaded}
          onFile={handleFile}
          inputRef={inputRef}
          accept="video/*"
          icon={Film}
          title="Drag & drop a video file, or"
          subtitle="One file at a time"
          formatPills={FORMAT_PILLS}
          ariaLabel="Upload video file to trim"
          dropLabel="Drop video file here"
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Film className="w-4 h-4 text-slate-400 shrink-0" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {state.file.name}
                </p>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {formatBytes(state.file.size)} ·{' '}
                  {formatDuration(state.duration)}
                </span>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 cursor-pointer transition-colors shrink-0"
              >
                Change file
              </button>
            </div>

            {previewUrl && (
              <video
                ref={videoRef}
                controls
                preload="metadata"
                src={previewUrl}
                className="w-full max-h-64 rounded-lg bg-black"
              />
            )}

            <div className="relative h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="absolute inset-y-0 bg-purple-400 dark:bg-purple-600"
                style={{
                  left: `${selectionPct.start}%`,
                  right: `${100 - selectionPct.end}%`,
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <TimeField
                label="Start"
                seconds={state.startTime}
                max={state.duration}
                onChange={(s) =>
                  setRange(Math.min(s, state.endTime), state.endTime)
                }
                onUseCurrent={() =>
                  setRange(
                    Math.min(videoRef.current?.currentTime ?? 0, state.endTime),
                    state.endTime,
                  )
                }
              />
              <TimeField
                label="End"
                seconds={state.endTime}
                max={state.duration}
                onChange={(s) =>
                  setRange(state.startTime, Math.max(s, state.startTime))
                }
                onUseCurrent={() =>
                  setRange(
                    state.startTime,
                    Math.max(
                      videoRef.current?.currentTime ?? 0,
                      state.startTime,
                    ),
                  )
                }
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Selected: {formatDuration(state.endTime - state.startTime)} of{' '}
              {formatDuration(state.duration)}
            </p>
          </div>

          <button
            disabled={
              state.status === 'processing' ||
              !isFFmpegLoaded ||
              state.endTime <= state.startTime
            }
            onClick={trim}
            className={`w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-3 rounded-xl cursor-pointer transition-all
                ${
                  isFFmpegLoaded && state.status !== 'processing'
                    ? 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white shadow-sm shadow-purple-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
          >
            {state.status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Trimming… {Math.round(state.progress * 100)}%
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4" />
                Trim video
              </>
            )}
          </button>

          {state.status === 'error' && state.errorMessage && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {state.errorMessage}
            </p>
          )}

          {state.status === 'success' && state.outputUrl && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Trimmed - {state.outputSize}
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Trim another
                </button>
              </div>
              <video
                controls
                src={state.outputUrl}
                className="w-full max-h-64 rounded-lg bg-black"
              />
              <button
                onClick={downloadResult}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white cursor-pointer transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
