import { useState, useCallback } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import toast from 'react-hot-toast';
import {
  AudioFormat,
  getFormatByExtension,
  getFFmpegArgsForTarget,
} from '@/features/audio/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
  getAudioDuration,
} from '@/features/audio/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';
import { MergeFileItem, MergeStatus } from '../types/merge';

const MAX_FILES = 15;

export const useAudioMerge = (ffmpeg: FFmpeg | null, isFFmpegLoaded: boolean) => {
  const [items, setItems] = useState<MergeFileItem[]>([]);
  const [status, setStatus] = useState<MergeStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [invalidFileDetails, setInvalidFileDetails] = useState({
    name: '',
    type: '',
  });

  const addFiles = useCallback(
    (incoming: File[]) => {
      if (!incoming.length) return;
      if (items.length + incoming.length > MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed.`);
        return;
      }

      const accepted: File[] = [];
      let foundInvalid = false;
      for (const file of incoming) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        if (!getFormatByExtension(ext)) {
          if (!foundInvalid) {
            setInvalidFileDetails({ name: file.name, type: ext.toUpperCase() || 'UNKNOWN' });
            foundInvalid = true;
          }
          continue;
        }
        accepted.push(file);
      }
      if (foundInvalid) setIsAlertOpen(true);
      if (!accepted.length) return;

      const newItems: MergeFileItem[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));
      setItems((prev) => [...prev, ...newItems]);

      newItems.forEach((item) => {
        getAudioDuration(item.file)
          .then((duration) => {
            setItems((prev) =>
              prev.map((f) => (f.id === item.id ? { ...f, duration } : f)),
            );
          })
          .catch(() => undefined);
      });
    },
    [items.length],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveItem = useCallback((id: string, direction: -1 | 1) => {
    setItems((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      const newIndex = index + direction;
      if (index === -1 || newIndex < 0 || newIndex >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  }, []);

  const clearAll = useCallback(() => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setItems([]);
    setStatus('idle');
    setOutputUrl(null);
    setOutputSize(null);
    setErrorMessage(null);
  }, [outputUrl]);

  const merge = useCallback(
    async (targetFormat: AudioFormat) => {
      if (!ffmpeg || !isFFmpegLoaded) {
        toast.error('Please wait for the audio engine to finish initializing.');
        return;
      }
      if (items.length < 2) {
        toast.error('Add at least 2 files to merge.');
        return;
      }

      setStatus('processing');
      setProgress(0);
      setErrorMessage(null);

      const inputPaths: string[] = [];
      const outputPath = `merged_output.${targetFormat.extension}`;

      try {
        // Write every input file to the virtual filesystem first.
        for (let i = 0; i < items.length; i++) {
          const ext = items[i].file.name.split('.').pop()?.toLowerCase() ?? 'bin';
          const path = `merge_input_${i}.${ext}`;
          await ffmpeg.writeFile(path, await fetchFile(items[i].file));
          inputPaths.push(path);
        }

        // The concat *filter* (not the concat demuxer) handles inputs with
        // different formats/codecs/sample rates by decoding and
        // re-encoding them into one continuous stream - important since
        // users will often merge files that didn't originally share a
        // format. The concat demuxer is faster but requires identical
        // codecs across all inputs, which we can't guarantee here.
        const inputArgs = inputPaths.flatMap((p) => ['-i', p]);
        const filterInputs = inputPaths.map((_, i) => `[${i}:a]`).join('');
        const filterComplex = `${filterInputs}concat=n=${inputPaths.length}:v=0:a=1[out]`;

        const args = [
          ...inputArgs,
          '-filter_complex',
          filterComplex,
          '-map',
          '[out]',
          ...getFFmpegArgsForTarget(targetFormat.extension),
          outputPath,
        ];

        const exitCode = await runFFmpegWithProgress(ffmpeg, args, setProgress);

        if (exitCode !== 0) {
          throw new Error(`FFmpeg exited with code ${exitCode}.`);
        }

        const data = await ffmpeg.readFile(outputPath);
        const bytes =
          typeof data === 'string' ? new TextEncoder().encode(data) : data;
        const blob = new Blob([toStandaloneBuffer(bytes)], {
          type: targetFormat.mimeType,
        });

        setOutputUrl(URL.createObjectURL(blob));
        setOutputSize(formatBytes(blob.size));
        setStatus('success');
        toast.success('Files merged!');
      } catch (err) {
        console.error('Merge failed:', err);
        const message = err instanceof Error ? err.message : 'Merge failed';
        setErrorMessage(message);
        setStatus('error');
        toast.error(message);
      } finally {
        await cleanupFFmpegFiles(ffmpeg, [...inputPaths, outputPath]);
      }
    },
    [ffmpeg, isFFmpegLoaded, items],
  );

  const downloadResult = useCallback(
    (targetFormat: AudioFormat) => {
      if (!outputUrl) return;
      const link = document.createElement('a');
      link.href = outputUrl;
      link.download = `merged_audio.${targetFormat.extension}`;
      link.click();
    },
    [outputUrl],
  );

  return {
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
  };
};
