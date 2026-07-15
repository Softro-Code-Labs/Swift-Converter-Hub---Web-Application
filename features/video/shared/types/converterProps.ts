import { VideoFormat } from '@/features/video/shared/config/formats';

export interface BaseConverterProps {
  sourceFormat: VideoFormat;
  targetFormat?: VideoFormat;
}
