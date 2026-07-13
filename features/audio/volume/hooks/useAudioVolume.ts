import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { AudioFileItem } from '@/features/audio/shared/types/audioFile';
import {
  getFormatByExtension,
  getFFmpegArgsForTarget,
} from '@/features/audio/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/audio/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';

export interface VolumeSettings {
  mode: 'manual' | 'normalize';
  /** Percentage, 100 = unchanged. Only used when mode === 'manual'. */
  percent: number;
}

export const useAudioVolume = (
  files: AudioFileItem[],
  updateFile: (id: string, patch: Partial<AudioFileItem>) => void,
  settings: VolumeSettings,
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const processFile = async (
    item: AudioFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string }> => {
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const format = getFormatByExtension(sourceExt);
    if (!format) throw new Error(`Unrecognized format: .${sourceExt}`);

    const inputPath = `input_${item.id}.${sourceExt}`;
    const outputPath = `output_${item.id}.${format.extension}`;

    const filter =
      settings.mode === 'normalize'
        ? 'loudnorm'
        : `volume=${(settings.percent / 100).toFixed(2)}`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const args = [
        '-i',
        inputPath,
        '-af',
        filter,
        ...getFFmpegArgsForTarget(format.extension),
        outputPath,
      ];

      const exitCode = await runFFmpegWithProgress(engine, args, (ratio) => {
        updateFile(item.id, { progress: ratio });
      });

      if (exitCode !== 0) {
        throw new Error(
          `FFmpeg exited with code ${exitCode} - the file may be corrupted or use an unsupported codec internally.`,
        );
      }

      const data = await engine.readFile(outputPath);
      const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], {
        type: format.mimeType,
      });

      return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
    } finally {
      await cleanupFFmpegFiles(engine, [inputPath, outputPath]);
    }
  };

  const processAll = async () => {
    if (!isFFmpegLoaded || !ffmpeg) {
      toast.error('Please wait for the audio engine to finish initializing.');
      return;
    }
    setIsProcessingAll(true);

    for (const item of files) {
      if (item.status !== 'idle') continue;
      updateFile(item.id, { status: 'processing', progress: 0 });
      try {
        const result = await processFile(item, ffmpeg);
        updateFile(item.id, {
          status: 'success',
          convertedUrl: result.url,
          outputSize: result.size,
          progress: 1,
        });
      } catch (err) {
        console.error(`Volume adjustment failed for ${item.file.name}:`, err);
        const message =
          err instanceof Error ? err.message : 'Volume adjustment failed';
        updateFile(item.id, { status: 'error', errorMessage: message });
      }
    }

    setIsProcessingAll(false);
    toast.success('Done!');
  };

  const downloadAll = async () => {
    const ready = files.filter((f) => f.status === 'success' && f.convertedUrl);
    if (!ready.length) return;

    setIsZipping(true);
    const zip = new JSZip();

    try {
      toast.loading('Building ZIP...', { id: 'zip' });
      for (const item of ready) {
        const blob = await fetch(item.convertedUrl!).then((r) => r.blob());
        const name = item.file.name.substring(
          0,
          item.file.name.lastIndexOf('.'),
        );
        const ext = item.file.name.split('.').pop() ?? 'mp3';
        zip.file(`${name}_volume.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'volume_adjusted_batch.zip');
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: AudioFileItem) => {
    if (!item.convertedUrl) return;
    const ext = item.file.name.split('.').pop() ?? 'mp3';
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_volume.${ext}`;
    link.click();
  };

  return {
    isProcessingAll,
    isZipping,
    processAll,
    downloadAll,
    downloadSingle,
  };
};
