import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { VideoFileItem } from '@/features/video/shared/types/videoFile';
import {
  getFormatByExtension,
  getCompressArgs,
  QualityPreset,
} from '@/features/video/shared/config/formats';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import { formatBytes, toStandaloneBuffer } from '@/features/shared/lib/format';

export const useVideoCompress = (
  files: VideoFileItem[],
  updateFile: (id: string, patch: Partial<VideoFileItem>) => void,
  preset: QualityPreset,
  ffmpeg: FFmpeg | null,
  isFFmpegLoaded: boolean,
) => {
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const compressFile = async (
    item: VideoFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string }> => {
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? 'mp4';
    const format = getFormatByExtension(sourceExt);
    if (!format) throw new Error(`Unrecognized format: .${sourceExt}`);

    const inputPath = `vcompress_input_${item.id}.${sourceExt}`;
    // Compression always outputs MP4 regardless of source format - H.264
    // + faststart MP4 is the safest universally-playable choice, and
    // mixing "compress" with "also convert container" would make the
    // size/quality trade-off harder to reason about for users.
    const outputPath = `vcompress_output_${item.id}.mp4`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const args = ['-i', inputPath, ...getCompressArgs(preset), outputPath];

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
      const blob = new Blob([toStandaloneBuffer(bytes)], { type: 'video/mp4' });

      return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
    } finally {
      await cleanupFFmpegFiles(engine, [inputPath, outputPath]);
    }
  };

  const compressAll = async () => {
    if (!isFFmpegLoaded || !ffmpeg) {
      toast.error('Please wait for the video engine to finish initializing.');
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
          progress: 1,
        });
      } catch (err) {
        console.error(`Compression failed for ${item.file.name}:`, err);
        const message = err instanceof Error ? err.message : 'Compression failed';
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
        const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
        zip.file(`${name}_compressed.mp4`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'compressed_video_batch.zip');
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: VideoFileItem) => {
    if (!item.convertedUrl) return;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_compressed.mp4`;
    link.click();
  };

  return { isProcessingAll, isZipping, compressAll, downloadAll, downloadSingle };
};
