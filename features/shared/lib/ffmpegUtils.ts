import type { FFmpeg } from '@ffmpeg/ffmpeg';

// Gets audio duration using the fast native browser decoder instead of FFmpeg.
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

// Runs FFmpeg and safely handles/cleans up the progress listener to avoid memory leaks.
export async function runFFmpegWithProgress(
  ffmpeg: FFmpeg,
  args: string[],
  onProgress?: (ratio: number) => void,
): Promise<number> {
  const handleProgress = ({ progress }: { progress: number }) => {
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

// Deletes temporary files from FFmpeg's virtual memory to prevent browser tab bloat.
export async function cleanupFFmpegFiles(
  ffmpeg: FFmpeg,
  paths: string[],
): Promise<void> {
  await Promise.all(
    paths.map((path) => ffmpeg.deleteFile(path).catch(() => undefined)),
  );
}
