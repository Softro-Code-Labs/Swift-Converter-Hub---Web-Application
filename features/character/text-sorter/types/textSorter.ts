export type OperationId =
  | 'sort-az'
  | 'sort-za'
  | 'sort-length-asc'
  | 'sort-length-desc'
  | 'sort-numeric'
  | 'shuffle'
  | 'reverse'
  | 'deduplicate'
  | 'remove-blanks'
  | 'trim-lines'
  | 'lowercase'
  | 'uppercase';

export interface Operation {
  id: OperationId;
  label: string;
  desc: string;
  group: 'sort' | 'filter' | 'transform';
  icon: string; // emoji for compact display
}

export interface SorterOptions {
  operations: OperationId[];
  caseSensitive: boolean;
}

export interface SorterResult {
  lines: string[];
  inputCount: number;
  outputCount: number;
  removedCount: number;
}
