export type ToGifStatus =
  | 'idle'
  | 'ready'
  | 'palette'
  | 'encoding'
  | 'success'
  | 'error';

export const GIF_MAX_DURATION_SEC = 15;
export const FPS_OPTIONS = [10, 15, 20] as const;
export const WIDTH_OPTIONS = [320, 480, 640] as const;

export interface ToGifState {
  file: File | null;
  status: ToGifStatus;
  duration: number; // seconds, of the original file
  startTime: number;
  endTime: number;
  fps: (typeof FPS_OPTIONS)[number];
  width: (typeof WIDTH_OPTIONS)[number];
  progress: number; // 0-1
  outputUrl?: string;
  outputSize?: string;
  errorMessage?: string;
}
