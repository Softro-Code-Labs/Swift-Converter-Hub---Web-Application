export type PageSize = 'fit' | 'a4' | 'letter';
export type Orientation = 'auto' | 'portrait' | 'landscape';
export type Margin = 'none' | 'small' | 'large';
export type Quality = 'original' | 'compact';

export interface PdfOptions {
  pageSize: PageSize;
  orientation: Orientation;
  margin: Margin;
  quality: Quality;
}

export const DEFAULT_OPTIONS: PdfOptions = {
  pageSize: 'a4',
  orientation: 'auto',
  margin: 'small',
  quality: 'original',
};

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  size: number;
  /** Preview URL (object URL), null while a HEIC preview is decoding. */
  previewUrl: string | null;
  /** Clockwise rotation in degrees. */
  rotation: 0 | 90 | 180 | 270;
  width: number | null;
  height: number | null;
  error: string | null;
}

export interface PdfResult {
  url: string;
  size: number;
  pageCount: number;
  fileName: string;
}

/** PDF points (1/72 inch). */
export const PAGE_SIZES: Record<Exclude<PageSize, 'fit'>, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

export const MARGINS: Record<Margin, number> = {
  none: 0,
  small: 18, // 0.25 in
  large: 36, // 0.5 in
};

export const ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif,image/heic,image/heif,.heic,.heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif';

export const SUPPORTED_LABELS = [
  'JPG',
  'PNG',
  'WebP',
  'HEIC',
  'GIF',
  'BMP',
  'AVIF',
];

export const MAX_IMAGES = 50;
