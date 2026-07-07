export interface SheetMeta {
  name: string;
  rowCount: number;
  colCount: number;
}

export interface ParseOptions {
  hasHeader: boolean;
  prettyJson: boolean;
  includeEmpty: boolean;
  dateFormat: 'iso' | 'serial' | 'string';
}

export interface SheetData {
  name: string;
  headers: string[];
  rows: Record<string, unknown>[];
  rawRows: unknown[][];
}

export interface ParseResult {
  sheets: SheetData[];
  meta: SheetMeta[];
  error: string | null;
}

export const DEFAULT_OPTIONS: ParseOptions = {
  hasHeader: true,
  prettyJson: true,
  includeEmpty: false,
  dateFormat: 'iso',
};
