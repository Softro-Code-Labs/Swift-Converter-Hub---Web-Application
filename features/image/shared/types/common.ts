export type ToolFileStatus = 'idle' | 'processing' | 'success' | 'error';

export interface BaseProcessedResult {
  url: string;
  size: string;
  width?: number;
  height?: number;
}

// Generic single-file tool state - used by crop, adjust, metadata, base64-encode
export interface SingleFileState {
  file: File | null;
  previewUrl: string;
}
