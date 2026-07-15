export interface MergeFileItem {
  id: string;
  file: File;
  duration?: number;
}

export type MergeStatus = 'idle' | 'processing' | 'success' | 'error';
