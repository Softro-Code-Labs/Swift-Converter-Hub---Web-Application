export interface ExifField {
  key: string;
  label: string;
  value: string;
}

export interface MetadataCategory {
  id: string;
  title: string;
  icon: string;
  fields: ExifField[];
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface ImageMetadataResult {
  fileName: string;
  fileSize: string;
  dimensions: { width: number; height: number };
  format: string;
  categories: MetadataCategory[];
  gps: GpsCoordinates | null;
  hasExif: boolean;
  rawCount: number;
}

// Formats that commonly carry EXIF data
export const SUPPORTED_METADATA_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'jfif',
  'tiff',
  'tif',
  'png',
  'webp',
  'heic',
  'heif',
]);

const BLOCKED_METADATA_EXTENSIONS = new Set([
  'ico',
  'cur',
  'svg',
  'svgz',
  'pdf',
  'eps',
  'ai',
  'ps',
  'gif',
  'bmp',
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

export const isSupportedForMetadata = (file: File): boolean => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (BLOCKED_METADATA_EXTENSIONS.has(ext)) return false;
  if (SUPPORTED_METADATA_EXTENSIONS.has(ext)) return true;
  const mime = file.type.toLowerCase();
  const allowedMimes = [
    'image/jpeg',
    'image/tiff',
    'image/png',
    'image/webp',
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
