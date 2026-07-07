export type FormatMode = 'beautify' | 'minify' | 'validate';
export type IndentStyle = 2 | 4 | 'tab';

export interface FormatterOptions {
  mode: FormatMode;
  indent: IndentStyle;
  sortKeys: boolean;
  ensureAscii: boolean;
}

export interface JsonStats {
  isValid: boolean;
  keys: number;
  values: number;
  arrays: number;
  objects: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  maxDepth: number;
  size: number;
  minifiedSize: number;
}

export interface FormatterResult {
  output: string;
  error: string | null;
  errorLine: number | null;
  errorCol: number | null;
  stats: JsonStats | null;
}
