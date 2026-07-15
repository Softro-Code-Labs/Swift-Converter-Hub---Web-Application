export type TrimStatus = 'idle' | 'ready' | 'processing' | 'success' | 'error';

export interface VideoTrimState {
  file: File | null;
  status: TrimStatus;
  duration: number; // seconds, of the original file
  startTime: number; // seconds
  endTime: number; // seconds
  progress: number; // 0-1
  outputUrl?: string;
  outputSize?: string;
  errorMessage?: string;
}
