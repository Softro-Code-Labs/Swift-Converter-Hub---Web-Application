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
}

export const PRESETS: CompressionPreset[] = [
  {
    id: 'light',
    label: 'Light',
    desc: 'Re-save with object streams only - safest, minimal size change',
    removeMetadata: false,
    removeAnnotations: false,
    removeBookmarks: false,
    removeAttachments: false,
    useObjectStreams: true,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    desc: 'Remove metadata and re-optimise - good for most documents',
    removeMetadata: true,
    removeAnnotations: false,
    removeBookmarks: false,
    removeAttachments: false,
    useObjectStreams: true,
  },
  {
    id: 'maximum',
    label: 'Maximum',
    desc: 'Strip metadata, annotations, bookmarks, and attachments',
    removeMetadata: true,
    removeAnnotations: true,
    removeBookmarks: true,
    removeAttachments: true,
    useObjectStreams: true,
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
}
