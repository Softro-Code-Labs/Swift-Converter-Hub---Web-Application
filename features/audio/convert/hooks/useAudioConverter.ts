import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { AudioFileItem } from '@/features/audio/convert/types/converter';
import { AudioFormat, getFFmpegArgsForTarget } from '../config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import {
  formatBytes,
  toStandaloneBuffer,
  getFileExtension,
} from '@/features/shared/lib/format';

/**
 * Converts a batch of audio files to a target format using FFmpeg (WASM),
 * with per-file progress, ZIP download of all results, and single-file
 * download.
 */
export const useAudioConverter = (
  files: AudioFileItem[],
  updateFile: (id: string, patch: Partial<AudioFileItem>) => void,
  selectedTarget: AudioFormat,
  bitrateKbps: number,
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const convertFile = async (
    item: AudioFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string }> => {
    const target = item.targetFormat ?? selectedTarget;
    const sourceExt = getFileExtension(item.file.name) || 'bin';

    const inputPath = `input_${item.id}.${sourceExt}`;
    const outputPath = `output_${item.id}.${target.extension}`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const args = [
        '-i',
        inputPath,
        ...getFFmpegArgsForTarget(target.extension, bitrateKbps),
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
      const bytes =
        typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], {
        type: target.mimeType,
      });

      return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
    } finally {
      await cleanupFFmpegFiles(engine, [inputPath, outputPath]);
    }
  };

  const convertAll = async () => {
    if (!isFFmpegLoaded || !ffmpeg) {
      toast.error('Please wait for the audio engine to finish initializing.');
      return;
    }
    setIsConvertingAll(true);

    // Processed one at a time - the shared FFmpeg WASM instance can only
    // run a single job at once.
    for (const item of files) {
      if (item.status !== 'idle') continue;
      updateFile(item.id, { status: 'processing', progress: 0 });
      try {
        const result = await convertFile(item, ffmpeg);
        updateFile(item.id, {
          status: 'success',
          convertedUrl: result.url,
          outputSize: result.size,
          progress: 1,
        });
      } catch (err) {
        console.error(`Conversion failed for ${item.file.name}:`, err);
        const message =
          err instanceof Error ? err.message : 'Conversion failed';
        updateFile(item.id, { status: 'error', errorMessage: message });
      }
    }

    setIsConvertingAll(false);
    toast.success('All conversions complete!');
  };

  const downloadAll = async () => {
    const ready = files.filter((f) => f.status === 'success' && f.convertedUrl);
    if (!ready.length) return;

    setIsZipping(true);
    const zip = new JSZip();
    const ext = selectedTarget.extension;

    try {
      toast.loading('Building ZIP...', { id: 'zip' });
      for (const item of ready) {
        const blob = await fetch(item.convertedUrl!).then((r) => r.blob());
        const name = item.file.name.substring(
          0,
          item.file.name.lastIndexOf('.'),
        );
        zip.file(`${name}_converted.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `converted_${ext}_batch.zip`);
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: AudioFileItem) => {
    if (!item.convertedUrl) return;
    const target = item.targetFormat ?? selectedTarget;
    const ext = target.extension;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_converted.${ext}`;
    link.click();
  };

  return {
    isConvertingAll,
    isZipping,
    convertAll,
    downloadAll,
    downloadSingle,
  };
};
