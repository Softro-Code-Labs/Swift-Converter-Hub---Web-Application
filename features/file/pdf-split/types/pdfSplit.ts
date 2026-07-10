export type SplitMode = 'extract' | 'ranges' | 'every';

export interface PageThumb {
  pageIndex: number;
  thumbUrl: string | null;
  loaded: boolean;
}

export interface RangeGroup {
  id: string;
  label: string;
  pages: number[];
}

export interface SplitResult {
  files: { name: string; url: string; pageCount: number; sizeLabel: string }[];
}
