export interface AdjustmentValues {
  brightness: number; // -100 to 100 (0 = no change)
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100 (-100 = grayscale)
  hue: number; // -180 to 180 degrees
  sharpen: number; // 0 to 100
  blur: number; // 0 to 20
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
}

export const DEFAULT_ADJUSTMENTS: AdjustmentValues = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  sharpen: 0,
  blur: 0,
  grayscale: false,
  sepia: false,
  invert: false,
};

export type FilterPreset =
  | 'none'
  | 'vivid'
  | 'warm'
  | 'cool'
  | 'bw'
  | 'vintage'
  | 'dramatic'
  | 'fade'
  | 'noir';

export const FILTER_PRESETS: Record<FilterPreset, Partial<AdjustmentValues>> = {
  none: {},
  vivid: { saturation: 40, contrast: 15, brightness: 5 },
  warm: { hue: -10, saturation: 15, brightness: 5 },
  cool: { hue: 15, saturation: -10, brightness: 0 },
  bw: { grayscale: true, contrast: 10 },
  vintage: { sepia: true, contrast: -10, brightness: 5 },
  dramatic: { contrast: 35, saturation: -15, brightness: -5 },
  fade: { contrast: -25, brightness: 10, saturation: -20 },
  noir: { grayscale: true, contrast: 40, brightness: -10 },
};

export interface ProcessedAdjustResult {
  url: string;
  size: string;
  width: number;
  height: number;
}

// Formats the adjust tool can process
export const SUPPORTED_ADJUST_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'jfif',
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

const BLOCKED_ADJUST_EXTENSIONS = new Set([
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

export const isSupportedForAdjust = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_ADJUST_EXTENSIONS.has(ext)) return false;
  if (SUPPORTED_ADJUST_EXTENSIONS.has(ext)) return true;
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
