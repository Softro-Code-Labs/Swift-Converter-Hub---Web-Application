import { useState, useCallback } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import toast from 'react-hot-toast';
import { getFormatByExtension } from '@/features/audio/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
  getAudioDuration,
} from '@/features/audio/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';
import { TrimState } from '../types/trim';

const INITIAL_STATE: TrimState = {
  file: null,
  status: 'idle',
  duration: 0,
  startTime: 0,
  endTime: 0,
  progress: 0,
};

export const useAudioTrim = (
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [state, setState] = useState<TrimState>(INITIAL_STATE);

  const loadFile = useCallback(async (file: File) => {
    if (state.outputUrl) URL.revokeObjectURL(state.outputUrl);
    try {
      const duration = await getAudioDuration(file);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error('Please wait for the audio engine to finish initializing.');
      return;
    }
    if (state.endTime <= state.startTime) {
      toast.error('End time must be after start time.');
      return;
    }

    const ext = state.file.name.split('.').pop()?.toLowerCase() ?? 'mp3';
    const format = getFormatByExtension(ext);
    if (!format) {
      toast.error('Unrecognized audio format.');
      return;
    }

    setState((prev) => ({ ...prev, status: 'processing', progress: 0 }));

    const inputPath = `trim_input.${ext}`;
    const outputPath = `trim_output.${ext}`;
    const durationSec = state.endTime - state.startTime;

    try {
      await ffmpeg.writeFile(inputPath, await fetchFile(state.file));

      // -c copy: fast, lossless stream copy rather than re-encoding, since
      // we're not changing format - just cutting a range. For compressed
      // formats the cut point can land up to one frame off (a few
      // milliseconds for MP3/AAC); for WAV it's sample-accurate.
      const args = [
        '-i',
        inputPath,
        '-ss',
        state.startTime.toFixed(3),
        '-t',
        durationSec.toFixed(3),
        '-c',
        'copy',
        outputPath,
      ];

      const exitCode = await runFFmpegWithProgress(ffmpeg, args, (ratio) => {
        setState((prev) => ({ ...prev, progress: ratio }));
      });

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with code ${exitCode}.`);
      }

      const data = await ffmpeg.readFile(outputPath);
      const bytes =
        typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], {
        type: format.mimeType,
      });

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
    const ext = state.file.name.split('.').pop() ?? 'mp3';
    const name = state.file.name.substring(0, state.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = state.outputUrl;
    link.download = `${name}_trimmed.${ext}`;
    link.click();
  }, [state.outputUrl, state.file]);

  return { state, loadFile, setRange, trim, reset, downloadResult };
};
