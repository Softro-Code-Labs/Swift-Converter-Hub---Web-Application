export type WatermarkType = 'text' | 'image';
export type WatermarkPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'tiled';

export interface TextWatermarkConfig {
  type: 'text';
  text: string;
  fontSize: number;
  color: string; // hex
  opacity: number; // 0-1
  angle: number; // degrees
  position: WatermarkPosition;
}

export interface ImageWatermarkConfig {
  type: 'image';
  imageFile: File | null;
  imageDataUrl: string | null;
  scale: number; // 0.1 - 1.0
  opacity: number; // 0-1
  angle: number; // degrees
  position: WatermarkPosition;
}

export type WatermarkConfig = TextWatermarkConfig | ImageWatermarkConfig;

export interface WatermarkResult {
  url: string;
  pageCount: number;
  sizeLabel: string;
}

export const POSITION_OPTIONS: { id: WatermarkPosition; label: string }[] = [
  { id: 'center', label: 'Center' },
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'tiled', label: 'Tiled' },
];

export const TEXT_PRESETS = [
  'CONFIDENTIAL',
  'DRAFT',
  'DO NOT COPY',
  'SAMPLE',
  'APPROVED',
  'WATERMARK',
];

export const DEFAULT_TEXT_CONFIG: TextWatermarkConfig = {
  type: 'text',
  text: 'CONFIDENTIAL',
  fontSize: 48,
  color: '#ff0000',
  opacity: 0.25,
  angle: -45,
  position: 'center',
};

export const DEFAULT_IMAGE_CONFIG: ImageWatermarkConfig = {
  type: 'image',
  imageFile: null,
  imageDataUrl: null,
  scale: 0.3,
  opacity: 0.3,
  angle: 0,
  position: 'center',
};
