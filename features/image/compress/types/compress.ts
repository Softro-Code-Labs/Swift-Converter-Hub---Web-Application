export interface CompressFileItem {
  id: string;
  file: File;
  status: 'idle' | 'processing' | 'success' | 'error';
  previewUrl?: string;
  resultUrl?: string;
  originalSize: number;
  compressedSize?: number;
  savings?: number; // percentage
  error?: string;
}

export type CompressPreset = 'high' | 'balanced' | 'aggressive' | 'custom';

export interface CompressOptions {
  quality: number; // 1-100
  format: string; // output format extension
  stripMetadata: boolean; // remove EXIF/ICC data
  maxWidth?: number; // optional resize cap
}

export const PRESETS: Record<
  Exclude<CompressPreset, 'custom'>,
  CompressOptions
> = {
  high: {
    quality: 90,
    format: 'keep',
    stripMetadata: true,
  },
  balanced: {
    quality: 75,
    format: 'keep',
    stripMetadata: true,
  },
  aggressive: {
    quality: 50,
    format: 'webp',
    stripMetadata: true,
  },
};

// Formats the compressor can meaningfully process
export const SUPPORTED_COMPRESS_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'jfif',
  'jpe',
  'png',
  'webp',
  'gif',
  'bmp',
  'tiff',
  'tif',
  'avif',
  'heic',
  'heif',
]);

// Formats where compression makes no sense or isn't supported
const BLOCKED_COMPRESS_EXTENSIONS = new Set([
  'ico',
  'cur',
  'svg',
  'svgz',
  'pdf',
  'eps',
  'ai',
  'ps',
  'dcm',
  'exr',
  'hdr',
  'dpx',
  'cin',
  'fits',
  'pbm',
  'pgm',
  'ppm',
  'pnm',
  'xbm',
  'xpm',
  'gray',
  'rgb',
  'rgba',
  'cmyk',
  'yuv',
  'mono',
  'mng',
  'jng',
  'mvg',
  'json',
  'txt',
  'yaml',
]);

export const isSupportedForCompress = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_COMPRESS_EXTENSIONS.has(ext)) return false;
  if (SUPPORTED_COMPRESS_EXTENSIONS.has(ext)) return true;
  const mime = file.type.toLowerCase();
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/heif',
  ];
  return allowedMimes.includes(mime);
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
