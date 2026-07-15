export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

/**
 * Reads a video file's duration and dimensions using the browser's native decoder.
 */
export function getVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.removeAttribute('src');
      video.load();
    };

    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      const { duration, videoWidth, videoHeight } = video;
      cleanup();
      if (!Number.isFinite(duration)) {
        reject(new Error('Could not read video duration'));
        return;
      }
      resolve({ duration, width: videoWidth, height: videoHeight });
    };
    video.onerror = () => {
      cleanup();
      reject(
        new Error(
          'Could not read this video file - it may be corrupted or in an unsupported format.',
        ),
      );
    };
    video.src = url;
  });
}
