import { ImageFormat } from '@/features/image/converter/config/formats';

export type ConversionStatus = 'idle' | 'processing' | 'success' | 'error';

export interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  status: ConversionStatus;
  convertedUrl?: string;
  outputSize?: string;
  targetFormat?: ImageFormat;
}

export interface BaseConverterProps {
  sourceFormat: ImageFormat;
  targetFormat?: ImageFormat;
}
