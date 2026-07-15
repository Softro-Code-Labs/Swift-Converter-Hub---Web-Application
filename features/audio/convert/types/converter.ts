import { AudioFormat } from '@/features/audio/convert/config/formats';

export type ConversionStatus = 'idle' | 'processing' | 'success' | 'error';

export interface AudioFileItem {
  id: string;
  file: File;
  status: ConversionStatus;
  duration?: number; // seconds, read on add via getAudioDuration
  convertedUrl?: string;
  outputSize?: string;
  targetFormat?: AudioFormat;
  progress?: number; // 0-1, only meaningful while status === 'processing'
  errorMessage?: string;
}

export interface BaseConverterProps {
  sourceFormat: AudioFormat;
  targetFormat?: AudioFormat;
}

export const BITRATE_PRESETS = [
  { id: 'low', label: 'Low', kbps: 96, hint: 'Smallest file' },
  { id: 'standard', label: 'Standard', kbps: 192, hint: 'Good balance' },
  { id: 'high', label: 'High', kbps: 320, hint: 'Best quality' },
] as const;

export type BitratePresetId = (typeof BITRATE_PRESETS)[number]['id'];
