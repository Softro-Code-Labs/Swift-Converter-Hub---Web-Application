import { AudioFormat } from '@/features/audio/shared/config/formats';

export type AudioProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export interface AudioFileItem {
  id: string;
  file: File;
  status: AudioProcessStatus;
  duration?: number; // seconds, read on add via getAudioDuration
  convertedUrl?: string;
  outputSize?: string;
  outputFormat?: AudioFormat;
  progress?: number; // 0-1, only meaningful while status === 'processing'
  errorMessage?: string;
}
