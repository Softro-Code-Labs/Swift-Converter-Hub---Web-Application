import type { FFmpeg } from '@ffmpeg/ffmpeg';

/**
 * Reads an audio file's duration using the browser's native decoder
 * (HTMLAudioElement) rather than spinning up FFmpeg for it - much
 * lighter weight, and works even before the FFmpeg engine has loaded.
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio();

    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.removeAttribute('src');
    };

    audio.preload = 'metadata';
    audio.onloadedmetadata = () => {
      const { duration } = audio;
      cleanup();
      if (!Number.isFinite(duration)) {
        reject(new Error('Could not read audio duration'));
        return;
      }
      resolve(duration);
    };
    audio.onerror = () => {
      cleanup();
      reject(
        new Error(
          'Could not read this audio file - it may be corrupted or in an unsupported format.',
        ),
      );
    };
    audio.src = url;
  });
}

/**
 * Runs an ffmpeg.exec() call while reporting progress through a callback,
 * and always unregisters its progress listener afterward - the FFmpeg
 * instance is a shared, long-lived singleton (see FFmpegEngineProvider),
 * so listeners that outlive a single operation would keep firing (and
 * referencing stale closures) for every subsequent operation on any tool.
 *
 * @returns the ffmpeg exit code (0 = success)
 */
export async function runFFmpegWithProgress(
  ffmpeg: FFmpeg,
  args: string[],
  onProgress?: (ratio: number) => void,
): Promise<number> {
  const handleProgress = ({ progress }: { progress: number }) => {
    // FFmpeg can report progress slightly outside [0, 1] (and NaN before
    // it has enough data), so clamp defensively for a sane progress bar.
    if (Number.isFinite(progress)) {
      onProgress?.(Math.min(1, Math.max(0, progress)));
    }
  };

  ffmpeg.on('progress', handleProgress);
  try {
    return await ffmpeg.exec(args);
  } finally {
    ffmpeg.off('progress', handleProgress);
  }
}

/**
 * Best-effort cleanup of ffmpeg's in-memory virtual filesystem after an
 * operation. The FFmpeg instance is shared across the whole session, so
 * files written by one operation would otherwise sit in memory for the
 * lifetime of the tab.
 */
export async function cleanupFFmpegFiles(
  ffmpeg: FFmpeg,
  paths: string[],
): Promise<void> {
  await Promise.all(
    paths.map((path) => ffmpeg.deleteFile(path).catch(() => undefined)),
  );
}
