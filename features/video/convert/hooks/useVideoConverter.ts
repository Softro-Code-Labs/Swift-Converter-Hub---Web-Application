import { uniqueZipName } from '@/features/shared/lib/zipName';
import { useState } from 'react';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { VideoFileItem } from '@/features/video/shared/types/videoFile';
import { VideoFormat, getFFmpegArgsForTarget } from '../config/formats';
import { canRemux, getRemuxArgs } from '@/features/video/shared/config/formats';
import {
  FAST_TARGETS,
  tryFastVideo,
  type FastTarget,
} from '@/features/video/shared/lib/fastVideo';
import {
  runFFmpegWithProgress,
  runBatchWithEnginePool,
  cleanupFFmpegFiles,
  readStreamCodecs,
} from '@/features/shared/lib/ffmpegUtils';
import {
  formatBytes,
  toStandaloneBuffer,
  getFileExtension,
} from '@/features/shared/lib/format';

/**
 * Converts a batch of video files to a target format, with per-file
 * progress, ZIP download of all results, and single-file download.
 *
 * Fastest route first:
 *  1. Hardware path (WebCodecs) for MP4/M4V/MOV/MKV/WebM - uses the
 *     device's GPU/media engine, and copies streams when they already fit.
 *  2. FFmpeg stream copy (remux) when the codecs fit the target container.
 *  3. FFmpeg full re-encode (WASM, CPU) - always works.
 */
export const useVideoConverter = (
  files: VideoFileItem[],
  updateFile: (id: string, patch: Partial<VideoFileItem>) => void,
  selectedTarget: VideoFormat,
  acquireEngine: () => Promise<FFmpeg>,
  releaseEngine: (engine: FFmpeg) => void,
  isFFmpegLoaded: boolean,
) => {
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const convertFile = async (
    item: VideoFileItem,
    engine: FFmpeg,
  ): Promise<{ url: string; size: string; accelerated?: boolean }> => {
    const target = item.outputFormat ?? selectedTarget;
    const ext = target.extension;

    if (FAST_TARGETS.has(ext)) {
      const fast = await tryFastVideo(item.file, {
        target: ext as FastTarget,
        onProgress: (ratio) => updateFile(item.id, { progress: ratio }),
      });
      if (fast) {
        return {
          url: URL.createObjectURL(fast),
          size: formatBytes(fast.size),
          accelerated: true,
        };
      }
      updateFile(item.id, { progress: 0 });
    }

    const sourceExt = getFileExtension(item.file.name) || 'bin';
    const inputPath = `vinput_${item.id}.${sourceExt}`;
    const outputPath = `voutput_${item.id}.${ext}`;

    try {
      await engine.writeFile(inputPath, await fetchFile(item.file));

      const onProgress = (ratio: number) =>
        updateFile(item.id, { progress: ratio });

      // Stream copy when the codecs already fit: seconds, and lossless.
      let exitCode = 1;
      const codecs = await readStreamCodecs(engine, inputPath);
      if (canRemux(ext, codecs)) {
        exitCode = await runFFmpegWithProgress(
          engine,
          ['-i', inputPath, ...getRemuxArgs(ext, codecs.video), outputPath],
          onProgress,
        );
      }

      if (exitCode !== 0) {
        exitCode = await runFFmpegWithProgress(
          engine,
          ['-i', inputPath, ...getFFmpegArgsForTarget(ext), '-y', outputPath],
          onProgress,
        );
      }

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
    if (!isFFmpegLoaded) {
      toast.error('Please wait for the video engine to finish initializing.');
      return;
    }
    setIsConvertingAll(true);

    const pending = files.filter((f) => f.status === 'idle');

    await runBatchWithEnginePool(
      pending,
      acquireEngine,
      releaseEngine,
      async (item, engine) => {
        updateFile(item.id, {
          status: 'processing',
          progress: 0,
          accelerated: undefined,
        });
        try {
          const result = await convertFile(item, engine);
          updateFile(item.id, {
            status: 'success',
            convertedUrl: result.url,
            outputSize: result.size,
            accelerated: result.accelerated,
            progress: 1,
          });
        } catch (err) {
          console.error(`Conversion failed for ${item.file.name}:`, err);
          const message =
            err instanceof Error ? err.message : 'Conversion failed';
          updateFile(item.id, { status: 'error', errorMessage: message });
        }
      },
    );

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
        zip.file(uniqueZipName(zip, `${name}_converted.${ext}`), blob);
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

  const downloadSingle = (item: VideoFileItem) => {
    if (!item.convertedUrl) return;
    const target = item.outputFormat ?? selectedTarget;
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
