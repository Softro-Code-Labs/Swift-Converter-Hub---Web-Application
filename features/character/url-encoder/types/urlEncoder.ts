export type ToolMode = 'encode-decode' | 'parse';
export type EncodeMode = 'component' | 'full' | 'decode';

export interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: { key: string; value: string }[];
  isValid: boolean;
  error: string | null;
}

export interface EncodeResult {
  input: string;
  output: string;
  mode: EncodeMode;
  changed: boolean;
}
