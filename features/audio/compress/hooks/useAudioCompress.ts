import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { AudioFileItem } from '@/features/audio/shared/types/audioFile';
import {
  AudioFormat,
  getFormatByExtension,
  getFFmpegArgsForTarget,
} from '@/features/audio/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';

/**
 * Compressing lossless audio (WAV/FLAC) inherently means converting to a
 * lossy format - there's no such thing as "a smaller WAV at the same
 * fidelity" beyond FLAC's own lossless compression.
 */
export function getCompressOutputFormat(sourceExt: string): AudioFormat {
  const source = getFormatByExtension(sourceExt);
  if (!source) throw new Error(`Unknown source format: ${sourceExt}`);
  if (source.kind === 'lossless') {
    return getFormatByExtension('mp3')!;
  }
  return source;
}

export const useAudioCompress = (
  files: AudioFileItem[],
  updateFile: (id: string, patch: Partial<AudioFileItem>) => void,
  bitrateKbps: number,
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const compressFile = async (
    item: AudioFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string; format: AudioFormat }> => {
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? 'bin';
    const outputFormat = getCompressOutputFormat(sourceExt);
    const inputPath = `input_${item.id}.${sourceExt}`;
    const outputPath = `output_${item.id}.${outputFormat.extension}`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const args = [
        '-i',
        inputPath,
        ...getFFmpegArgsForTarget(outputFormat.extension, bitrateKbps),
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
        type: outputFormat.mimeType,
      });

      return {
        url: URL.createObjectURL(blob),
        size: formatBytes(blob.size),
        format: outputFormat,
      };
    } finally {
      await cleanupFFmpegFiles(engine, [inputPath, outputPath]);
    }
  };

  const compressAll = async () => {
    if (!isFFmpegLoaded || !ffmpeg) {
      toast.error('Please wait for the audio engine to finish initializing.');
      return;
    }
    setIsProcessingAll(true);

    for (const item of files) {
      if (item.status !== 'idle') continue;
      updateFile(item.id, { status: 'processing', progress: 0 });
      try {
        const result = await compressFile(item, ffmpeg);
        updateFile(item.id, {
          status: 'success',
          convertedUrl: result.url,
          outputSize: result.size,
          outputFormat: result.format,
          progress: 1,
        });
      } catch (err) {
        console.error(`Compression failed for ${item.file.name}:`, err);
        const message =
          err instanceof Error ? err.message : 'Compression failed';
        updateFile(item.id, { status: 'error', errorMessage: message });
      }
    }

    setIsProcessingAll(false);
    toast.success('All files compressed!');
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
        const ext = item.outputFormat?.extension ?? 'mp3';
        zip.file(`${name}_compressed.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'compressed_audio_batch.zip');
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: AudioFileItem) => {
    if (!item.convertedUrl) return;
    const ext = item.outputFormat?.extension ?? 'mp3';
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_compressed.${ext}`;
    link.click();
  };

  return {
    isProcessingAll,
    isZipping,
    compressAll,
    downloadAll,
    downloadSingle,
  };
};
