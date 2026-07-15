import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { MediaFileItem } from '@/features/shared/types/mediaFile';
import {
  AudioFormat,
  getFFmpegArgsForTarget,
} from '@/features/audio/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';

export type ExtractAudioFileItem = MediaFileItem<AudioFormat>;

/**
 * Extracts the audio track from a video file.
 */
export const useExtractAudio = (
  files: ExtractAudioFileItem[],
  updateFile: (id: string, patch: Partial<ExtractAudioFileItem>) => void,
  targetFormat: AudioFormat,
  bitrateKbps: number,
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const extractFile = async (
    item: ExtractAudioFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string }> => {
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const inputPath = `extract_input_${item.id}.${sourceExt}`;
    const outputPath = `extract_output_${item.id}.${targetFormat.extension}`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const args = [
        '-i',
        inputPath,
        ...getFFmpegArgsForTarget(targetFormat.extension, bitrateKbps),
        outputPath,
      ];

      const exitCode = await runFFmpegWithProgress(engine, args, (ratio) => {
        updateFile(item.id, { progress: ratio });
      });

      if (exitCode !== 0) {
        throw new Error(
          `FFmpeg exited with code ${exitCode} - this video may not contain an audio track, or use an unsupported codec.`,
        );
      }

      const data = await engine.readFile(outputPath);
      const bytes =
        typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([toStandaloneBuffer(bytes)], {
        type: targetFormat.mimeType,
      });

      return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
    } finally {
      await cleanupFFmpegFiles(engine, [inputPath, outputPath]);
    }
  };

  const extractAll = async () => {
    if (!isFFmpegLoaded || !ffmpeg) {
      toast.error('Please wait for the audio engine to finish initializing.');
      return;
    }
    setIsProcessingAll(true);

    for (const item of files) {
      if (item.status !== 'idle') continue;
      updateFile(item.id, { status: 'processing', progress: 0 });
      try {
        const result = await extractFile(item, ffmpeg);
        updateFile(item.id, {
          status: 'success',
          convertedUrl: result.url,
          outputSize: result.size,
          progress: 1,
        });
      } catch (err) {
        console.error(`Extraction failed for ${item.file.name}:`, err);
        const message =
          err instanceof Error ? err.message : 'Extraction failed';
        updateFile(item.id, { status: 'error', errorMessage: message });
      }
    }

    setIsProcessingAll(false);
    toast.success('Audio extracted!');
  };

  const downloadAll = async () => {
    const ready = files.filter((f) => f.status === 'success' && f.convertedUrl);
    if (!ready.length) return;

    setIsZipping(true);
    const zip = new JSZip();
    const ext = targetFormat.extension;

    try {
      toast.loading('Building ZIP...', { id: 'zip' });
      for (const item of ready) {
        const blob = await fetch(item.convertedUrl!).then((r) => r.blob());
        const name = item.file.name.substring(
          0,
          item.file.name.lastIndexOf('.'),
        );
        zip.file(`${name}_audio.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `extracted_audio_${ext}_batch.zip`);
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: ExtractAudioFileItem) => {
    if (!item.convertedUrl) return;
    const ext = targetFormat.extension;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_audio.${ext}`;
    link.click();
  };

  return {
    isProcessingAll,
    isZipping,
    extractAll,
    downloadAll,
    downloadSingle,
  };
};
