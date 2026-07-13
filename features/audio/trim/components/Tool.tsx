'use client';

import { useRef, useState } from 'react';
import {
  Scissors,
  Download,
  RotateCcw,
  Loader2,
  Music2,
  Play,
} from 'lucide-react';
import { useFFmpegEngine } from '@/features/audio/shared/hooks/useFFmpegEngine';
import { useAudioTrim } from '../hooks/useAudioTrim';
import { SingleFileDropZone, EngineStatusBar } from '@/features/shared/components';
import { formatBytes, formatDuration } from '@/features/shared/lib/format';

const FORMAT_PILLS = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'M4A', 'OPUS'];

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
        className="w-full accent-blue-600"
      />
      <button
        type="button"
        onClick={onUseCurrent}
        className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        <Play className="w-2.5 h-2.5" />
        Use current position
      </button>
    </div>
  );
}

export default function AudioTrimTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { isFFmpegLoaded, ffmpeg } = useFFmpegEngine();
  const { state, loadFile, setRange, trim, reset, downloadResult } =
    useAudioTrim(ffmpeg, isFFmpegLoaded);

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
        readyLabel="Audio engine ready"
        loadingLabel="Initializing audio engine…"
      />

      {!state.file ? (
        <SingleFileDropZone
          isReady={isFFmpegLoaded}
          onFile={handleFile}
          inputRef={inputRef}
          accept="audio/*"
          icon={Music2}
          title="Drag & drop an audio file, or"
          subtitle="One file at a time"
          formatPills={FORMAT_PILLS}
          ariaLabel="Upload audio file to trim"
          dropLabel="Drop audio file here"
        />
      ) : (
        <div className="space-y-4">
          {/* File + preview player */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Music2 className="w-4 h-4 text-slate-400 shrink-0" />
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
                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors shrink-0"
              >
                Change file
              </button>
            </div>

            {previewUrl && (
              <audio
                ref={audioRef}
                controls
                src={previewUrl}
                className="w-full h-9"
              />
            )}

            {/* Visual trim region indicator */}
            <div className="relative h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="absolute inset-y-0 bg-blue-400 dark:bg-blue-600"
                style={{
                  left: `${selectionPct.start}%`,
                  right: `${100 - selectionPct.end}%`,
                }}
              />
            </div>

            {/* Start/end controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <TimeField
                label="Start"
                seconds={state.startTime}
                max={state.duration}
                onChange={(s) => setRange(Math.min(s, state.endTime), state.endTime)}
                onUseCurrent={() =>
                  setRange(
                    Math.min(audioRef.current?.currentTime ?? 0, state.endTime),
                    state.endTime,
                  )
                }
              />
              <TimeField
                label="End"
                seconds={state.endTime}
                max={state.duration}
                onChange={(s) => setRange(state.startTime, Math.max(s, state.startTime))}
                onUseCurrent={() =>
                  setRange(
                    state.startTime,
                    Math.max(audioRef.current?.currentTime ?? 0, state.startTime),
                  )
                }
              />
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Selected: {formatDuration(state.endTime - state.startTime)} of{' '}
              {formatDuration(state.duration)}
            </p>
          </div>

          {/* Trim action */}
          {state.status !== 'success' && (
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
                    ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-sm shadow-blue-500/20'
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
                  Trim audio
                </>
              )}
            </button>
          )}

          {state.status === 'error' && state.errorMessage && (
            <p className="text-xs text-red-500 dark:text-red-400">
              {state.errorMessage}
            </p>
          )}

          {/* Result */}
          {state.status === 'success' && state.outputUrl && (
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Trimmed - {state.outputSize}
                </p>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Trim another
                </button>
              </div>
              <audio controls src={state.outputUrl} className="w-full h-9" />
              <button
                onClick={downloadResult}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white transition-all cursor-pointer"
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
