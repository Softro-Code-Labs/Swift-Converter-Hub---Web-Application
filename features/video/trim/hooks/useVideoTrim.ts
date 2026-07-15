import { useState, useCallback } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import toast from 'react-hot-toast';
import { getFormatByExtension } from '@/features/video/shared/config/formats';
import { getVideoMetadata } from '@/features/video/shared/lib/videoUtils';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';
import { VideoTrimState } from '../types/trim';

const INITIAL_STATE: VideoTrimState = {
  file: null,
  status: 'idle',
  duration: 0,
  startTime: 0,
  endTime: 0,
  progress: 0,
};

export const useVideoTrim = (ffmpeg: FFmpeg | null, isFFmpegLoaded: boolean) => {
  const [state, setState] = useState<VideoTrimState>(INITIAL_STATE);

  const loadFile = useCallback(async (file: File) => {
    try {
      const { duration } = await getVideoMetadata(file);
      setState({
        file,
        status: 'ready',
        duration,
        startTime: 0,
        endTime: duration,
        progress: 0,
      });
    } catch {
      toast.error(
        "Couldn't read this file - it may be corrupted or an unsupported format.",
      );
    }
  }, []);

  const setRange = useCallback((startTime: number, endTime: number) => {
    setState((prev) => ({ ...prev, startTime, endTime }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.outputUrl) URL.revokeObjectURL(prev.outputUrl);
      return INITIAL_STATE;
    });
  }, []);

  const trim = useCallback(async () => {
    if (!state.file || !ffmpeg || !isFFmpegLoaded) {
      toast.error('Please wait for the video engine to finish initializing.');
      return;
    }
    if (state.endTime <= state.startTime) {
      toast.error('End time must be after start time.');
      return;
    }

    const ext = state.file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const format = getFormatByExtension(ext);
    if (!format) {
      toast.error('Unrecognized video format.');
      return;
    }

    setState((prev) => ({ ...prev, status: 'processing', progress: 0 }));

    const inputPath = `vtrim_input.${ext}`;
    const outputPath = `vtrim_output.${ext}`;
    const durationSec = state.endTime - state.startTime;

    try {
      await ffmpeg.writeFile(inputPath, await fetchFile(state.file));

      // -c copy: fast, lossless stream copy. Unlike audio, video streams
      // are structured around keyframes (GOPs), so the actual cut point
      // can snap to the nearest preceding keyframe rather than landing
      // exactly on the requested start time - typically within a couple
      // of seconds depending on the source's keyframe interval. Trading
      // that imprecision for speed is deliberate here, same as Trim Audio.
      const args = [
        '-i', inputPath,
        '-ss', state.startTime.toFixed(3),
        '-t', durationSec.toFixed(3),
        '-c', 'copy',
        outputPath,
      ];

      const exitCode = await runFFmpegWithProgress(ffmpeg, args, (ratio) => {
        setState((prev) => ({ ...prev, progress: ratio }));
      });

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with code ${exitCode}.`);
      }

      const data = await ffmpeg.readFile(outputPath);
      const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], { type: format.mimeType });

      setState((prev) => ({
        ...prev,
        status: 'success',
        outputUrl: URL.createObjectURL(blob),
        outputSize: formatBytes(blob.size),
        progress: 1,
      }));
      toast.success('Trimmed!');
    } catch (err) {
      console.error('Trim failed:', err);
      const message = err instanceof Error ? err.message : 'Trim failed';
      setState((prev) => ({ ...prev, status: 'error', errorMessage: message }));
      toast.error(message);
    } finally {
      await cleanupFFmpegFiles(ffmpeg, [inputPath, outputPath]);
    }
  }, [ffmpeg, isFFmpegLoaded, state.file, state.startTime, state.endTime]);

  const downloadResult = useCallback(() => {
    if (!state.outputUrl || !state.file) return;
    const ext = state.file.name.split('.').pop() ?? 'mp4';
    const name = state.file.name.substring(0, state.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = state.outputUrl;
    link.download = `${name}_trimmed.${ext}`;
    link.click();
  }, [state.outputUrl, state.file]);

  return { state, loadFile, setRange, trim, reset, downloadResult };
};
