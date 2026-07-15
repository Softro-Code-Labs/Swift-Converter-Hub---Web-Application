import { useState, useCallback } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import toast from 'react-hot-toast';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import { getVideoMetadata } from '@/features/video/shared/lib/videoUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';
import { ToGifState, GIF_MAX_DURATION_SEC } from '../types/toGif';

const INITIAL_STATE: ToGifState = {
  file: null,
  status: 'idle',
  duration: 0,
  startTime: 0,
  endTime: 0,
  fps: 15,
  width: 480,
  progress: 0,
};

export const useVideoToGif = (
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [state, setState] = useState<ToGifState>(INITIAL_STATE);

  const loadFile = useCallback(async (file: File) => {
    try {
      const { duration } = await getVideoMetadata(file);
      const cappedEnd = Math.min(duration, GIF_MAX_DURATION_SEC);
      setState({
        ...INITIAL_STATE,
        file,
        status: 'ready',
        duration,
        startTime: 0,
        endTime: cappedEnd,
      });
    } catch {
      toast.error(
        "Couldn't read this file - it may be corrupted or an unsupported format.",
      );
    }
  }, []);

  const setRange = useCallback((startTime: number, endTime: number) => {
    setState((prev) => {
      const clampedEnd = Math.min(endTime, startTime + GIF_MAX_DURATION_SEC);
      return { ...prev, startTime, endTime: clampedEnd };
    });
  }, []);

  const setFps = useCallback((fps: ToGifState['fps']) => {
    setState((prev) => ({ ...prev, fps }));
  }, []);

  const setWidth = useCallback((width: ToGifState['width']) => {
    setState((prev) => ({ ...prev, width }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => {
      if (prev.outputUrl) URL.revokeObjectURL(prev.outputUrl);
      return INITIAL_STATE;
    });
  }, []);

  const convert = useCallback(async () => {
    if (!state.file || !ffmpeg || !isFFmpegLoaded) {
      toast.error('Please wait for the video engine to finish initializing.');
      return;
    }
    if (state.endTime <= state.startTime) {
      toast.error('End time must be after start time.');
      return;
    }

    const ext = state.file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const inputPath = 'gif_input.' + ext;
    const palettePath = 'gif_palette.png';
    const outputPath = 'gif_output.gif';
    const startArg = state.startTime.toFixed(3);
    const durationArg = (state.endTime - state.startTime).toFixed(3);
    const scaleFilter = `scale=${state.width}:-1:flags=lanczos`;

    setState((prev) => ({ ...prev, status: 'palette', progress: 0 }));

    try {
      await ffmpeg.writeFile(inputPath, await fetchFile(state.file));

      // Pass 1: generate an optimized color palette for this specific clip.
      await runFFmpegWithProgress(
        ffmpeg,
        [
          '-ss',
          startArg,
          '-t',
          durationArg,
          '-i',
          inputPath,
          '-vf',
          `fps=${state.fps},${scaleFilter},palettegen`,
          palettePath,
        ],
        (ratio) => setState((prev) => ({ ...prev, progress: ratio * 0.4 })),
      );

      setState((prev) => ({ ...prev, status: 'encoding' }));

      // Pass 2: encode the GIF using that palette.
      const exitCode = await runFFmpegWithProgress(
        ffmpeg,
        [
          '-ss',
          startArg,
          '-t',
          durationArg,
          '-i',
          inputPath,
          '-i',
          palettePath,
          '-filter_complex',
          `fps=${state.fps},${scaleFilter}[x];[x][1:v]paletteuse`,
          outputPath,
        ],
        (ratio) =>
          setState((prev) => ({ ...prev, progress: 0.4 + ratio * 0.6 })),
      );

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with code ${exitCode}.`);
      }

      const data = await ffmpeg.readFile(outputPath);
      const bytes =
        typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], { type: 'image/gif' });

      setState((prev) => ({
        ...prev,
        status: 'success',
        outputUrl: URL.createObjectURL(blob),
        outputSize: formatBytes(blob.size),
        progress: 1,
      }));
      toast.success('GIF ready!');
    } catch (err) {
      console.error('GIF conversion failed:', err);
      const message =
        err instanceof Error ? err.message : 'GIF conversion failed';
      setState((prev) => ({ ...prev, status: 'error', errorMessage: message }));
      toast.error(message);
    } finally {
      await cleanupFFmpegFiles(ffmpeg, [inputPath, palettePath, outputPath]);
    }
  }, [
    ffmpeg,
    isFFmpegLoaded,
    state.file,
    state.startTime,
    state.endTime,
    state.fps,
    state.width,
  ]);

  const downloadResult = useCallback(() => {
    if (!state.outputUrl || !state.file) return;
    const name = state.file.name.substring(0, state.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = state.outputUrl;
    link.download = `${name}.gif`;
    link.click();
  }, [state.outputUrl, state.file]);

  return {
    state,
    loadFile,
    setRange,
    setFps,
    setWidth,
    convert,
    reset,
    downloadResult,
  };
};
