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
  'gif',
  'bmp',
  'tiff',
  'tif',
  'avif',
  'jxl',
  'heic',
  'heif',
  'psd',
  'tga',
  'svg',
] as const;

export type SupportedCropFormat = (typeof SUPPORTED_CROP_FORMATS)[number];

export const isSupportedForCrop = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const mime = file.type.toLowerCase();
  // Check by extension first, then MIME
  if (SUPPORTED_CROP_FORMATS.includes(ext as SupportedCropFormat)) return true;
  // Fallback: any image/* MIME except formats we know are problematic
  const blockedMimes = [
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/cur',
  ];
  return mime.startsWith('image/') && !blockedMimes.includes(mime);
};

export const UNSUPPORTED_FORMATS_FOR_CROP = [
  'ico',
  'cur',
  'dcm',
  'exr',
  'hdr',
  'dpx',
  'cin',
  'pbm',
  'pgm',
  'ppm',
  'pnm',
  'pfm',
  'xbm',
  'xpm',
  'gray',
  'rgb',
  'rgba',
  'yuv',
  'mono',
  'cmyk',
  'mng',
  'jng',
  'mvg',
  'vicar',
  'viff',
  'miff',
  'palm',
  'pdb',
  'tim',
  'hrz',
  'sgi',
  'sun',
  'ras',
] as const;
