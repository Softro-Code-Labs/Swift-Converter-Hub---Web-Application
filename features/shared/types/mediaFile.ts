export type MediaProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export interface MediaFormatLike {
  label: string;
  extension: string;
}

export interface MediaFileItem<
  TFormat extends MediaFormatLike = MediaFormatLike,
> {
  id: string;
  file: File;
  status: MediaProcessStatus;
  duration?: number; // seconds, read on add via getAudioDuration/getVideoDuration
  convertedUrl?: string;
  outputSize?: string;
  outputFormat?: TFormat;
  progress?: number; // 0-1, only meaningful while status === 'processing'
  errorMessage?: string;
}
