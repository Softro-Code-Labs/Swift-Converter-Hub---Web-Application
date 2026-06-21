export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeDimensions {
  width: number;
  height: number;
  lockAspect: boolean;
}

export type CropMode = 'crop' | 'resize' | 'both';

export type AspectRatioPreset =
  | 'free'
  | '1:1'
  | '4:3'
  | '16:9'
  | '3:2'
  | '9:16'
  | '2:3';

export interface ProcessedResult {
  url: string;
  width: number;
  height: number;
  size: string;
  originalWidth: number;
  originalHeight: number;
}

// Formats the crop tool can actually handle
export const SUPPORTED_CROP_FORMATS = [
  'jpg',
  'jpeg',
  'png',
  'webp',
  'bmp',
  'avif',
] as const;

export type SupportedCropFormat = (typeof SUPPORTED_CROP_FORMATS)[number];

export const isSupportedForCrop = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  return SUPPORTED_CROP_FORMATS.includes(ext as SupportedCropFormat);
};
