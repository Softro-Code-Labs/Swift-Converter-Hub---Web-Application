export type CompressionLevel = 'light' | 'balanced' | 'maximum';

export interface CompressionPreset {
  id: CompressionLevel;
  label: string;
  desc: string;
  removeMetadata: boolean;
  removeAnnotations: boolean;
  removeBookmarks: boolean;
  removeAttachments: boolean;
  useObjectStreams: boolean;
  /** JPEG re-encode quality for embedded images, 0-1. */
  imageQuality: number;
  /** Downsample any embedded image whose longest edge exceeds this, in pixels. */
  maxImageDimension: number;
}

export const PRESETS: CompressionPreset[] = [
  {
    id: 'light',
    label: 'Light',
    desc: 'Visually lossless - gentle image re-encode, safest for photos and scans',
    removeMetadata: false,
    removeAnnotations: false,
    removeBookmarks: false,
    removeAttachments: false,
    useObjectStreams: true,
    imageQuality: 0.85,
    maxImageDimension: 2000,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    desc: 'Recompresses images and strips metadata - good for most documents',
    removeMetadata: true,
    removeAnnotations: false,
    removeBookmarks: false,
    removeAttachments: false,
    useObjectStreams: true,
    imageQuality: 0.72,
    maxImageDimension: 1600,
  },
  {
    id: 'maximum',
    label: 'Maximum',
    desc: 'Smallest file - aggressive image compression, strips everything non-visual',
    removeMetadata: true,
    removeAnnotations: true,
    removeBookmarks: true,
    removeAttachments: true,
    useObjectStreams: true,
    imageQuality: 0.5,
    maxImageDimension: 1200,
  },
];

export interface CompressResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPct: number;
  sizeLabel: string;
  originalLabel: string;
  /** How many embedded raster images were found / actually recompressed. */
  imagesFound: number;
  imagesRecompressed: number;
}

export interface CompressProgress {
  stage: 'loading' | 'images' | 'saving' | 'done';
  current: number;
  total: number;
}
