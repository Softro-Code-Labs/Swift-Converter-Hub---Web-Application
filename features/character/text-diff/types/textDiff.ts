export type DiffMode = 'split' | 'unified';

export type LineType = 'added' | 'removed' | 'unchanged' | 'modified';

export interface DiffLine {
  type: LineType;
  content: string;
  lineNumber: number | null; // null for placeholder empty lines in split view
}

export interface DiffSide {
  lines: DiffLine[];
}

export interface DiffResult {
  left: DiffSide;
  right: DiffSide;
  unified: DiffLine[];
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
  isEmpty: boolean;
}

export interface DiffStats {
  addedCount: number;
  removedCount: number;
  unchangedCount: number;
}
