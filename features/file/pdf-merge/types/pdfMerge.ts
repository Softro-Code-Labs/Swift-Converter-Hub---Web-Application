export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  sizeLabel: string;
  pageCount: number | null;
  thumbUrl: string | null;
  error: string | null;
}

export interface MergeResult {
  url: string;
  pageCount: number;
  sizeLabel: string;
}
