/**
 * Extracts a lowercase file extension from a filename, e.g. "Track.WAV" -> "wav".
 * Returns '' for names with no extension (e.g. "README") rather than the
 * whole filename, which `.pop()` alone would do.
 *
 * Centralizing this avoids each converter/queue hook re-implementing its own
 * slightly-different `file.name.split('.').pop()?.toLowerCase() ?? ''`.
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

/** Converts a file size in bytes to a human-readable string. */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/** Formats seconds as "m:ss", or "h:mm:ss" once past an hour. */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Creates an independent ArrayBuffer copy of a Uint8Array. */
export function toStandaloneBuffer(input: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(input.byteLength);
  new Uint8Array(copy).set(input);
  return copy;
}
