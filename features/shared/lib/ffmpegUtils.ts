import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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

/**
 * Runs `processItem` over every item concurrently, bounded by however many
 * FFmpeg engines the pool can actually hand out - `acquireEngine` blocks
 * until one is free, so this naturally caps concurrency at pool size
 * without a separate limiter. Each item gets its own engine for its
 * duration and releases it when done (success or failure) so the next
 * queued item can pick it up.
 */
export async function runBatchWithEnginePool<T>(
  items: T[],
  acquireEngine: () => Promise<FFmpeg>,
  releaseEngine: (engine: FFmpeg) => void,
  processItem: (item: T, engine: FFmpeg) => Promise<void>,
): Promise<void> {
  await Promise.all(
    items.map(async (item) => {
      const engine = await acquireEngine();
      try {
        await processItem(item, engine);
      } finally {
        releaseEngine(engine);
      }
    }),
  );
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

export interface ProbedMediaInfo {
  duration: number;
  width?: number;
  height?: number;
}

// Fallback for getVideoMetadata/getAudioDuration above, for formats the
// browser's own decoder can't open at all.
export async function probeMediaWithFFmpeg(
  ffmpeg: FFmpeg,
  file: File,
  ext: string,
): Promise<ProbedMediaInfo> {
  const inputPath = `probe_${Math.random().toString(36).slice(2)}.${ext || 'bin'}`;
  await ffmpeg.writeFile(inputPath, await fetchFile(file));

  let log = '';
  const handleLog = ({ message }: { message: string }) => {
    log += message + '\n';
  };

  ffmpeg.on('log', handleLog);
  try {
    await ffmpeg.exec(['-i', inputPath]);
  } finally {
    ffmpeg.off('log', handleLog);
    await cleanupFFmpegFiles(ffmpeg, [inputPath]);
  }

  const durationMatch = log.match(
    /Duration:\s*(\d{2}):(\d{2}):(\d{2})\.(\d{2})/,
  );
  if (!durationMatch) {
    throw new Error("FFmpeg couldn't read this file's duration either.");
  }
  const [, hh, mm, ss, cs] = durationMatch;
  const duration =
    Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(cs) / 100;

  // Only present for video streams - absent (and fine to be absent) for
  // audio-only files.
  const dimsMatch = log.match(/Video:.*?(\d{2,5})x(\d{2,5})/);

  return {
    duration,
    width: dimsMatch ? Number(dimsMatch[1]) : undefined,
    height: dimsMatch ? Number(dimsMatch[2]) : undefined,
  };
}

/**
 * Read the sample rate (Hz) of the first audio stream of a file already
 * written to FFmpeg's virtual file system. Returns null if none is found.
 */
export async function readAudioSampleRate(
  ffmpeg: FFmpeg,
  inputPath: string,
): Promise<number | null> {
  let log = '';
  const handleLog = ({ message }: { message: string }) => {
    log += message + '\n';
  };
  ffmpeg.on('log', handleLog);
  try {
    // Exits non-zero ("no output file") by design - we only want the header.
    await ffmpeg.exec(['-hide_banner', '-i', inputPath]);
  } finally {
    ffmpeg.off('log', handleLog);
  }
  const m = log.match(/Audio:[^\n]*?(\d{4,6}) Hz/);
  return m ? Number(m[1]) : null;
}

export interface StreamCodecs {
  video: string | null;
  audio: string | null;
  /** Number of audio streams, so a remux never silently drops one. */
  audioStreams: number;
}

/**
 * Read the codec names (FFmpeg's names, e.g. "h264", "aac") of the first
 * video and audio streams of a file already in FFmpeg's file system.
 */
export async function readStreamCodecs(
  ffmpeg: FFmpeg,
  inputPath: string,
): Promise<StreamCodecs> {
  let log = '';
  const handleLog = ({ message }: { message: string }) => {
    log += message + '\n';
  };
  ffmpeg.on('log', handleLog);
  try {
    await ffmpeg.exec(['-hide_banner', '-i', inputPath]);
  } finally {
    ffmpeg.off('log', handleLog);
  }
  // Skip attached cover art ("Video: mjpeg ... (attached pic)").
  const videoLine = log
    .split('\n')
    .find((l) => /Stream #.*Video:/.test(l) && !/attached pic/.test(l));
  const audioLines = log.split('\n').filter((l) => /Stream #.*Audio:/.test(l));
  const codecOf = (line?: string) =>
    line?.match(/(?:Video|Audio):\s*([a-z0-9_]+)/i)?.[1]?.toLowerCase() ?? null;
  return {
    video: codecOf(videoLine),
    audio: codecOf(audioLines[0]),
    audioStreams: audioLines.length,
  };
}
