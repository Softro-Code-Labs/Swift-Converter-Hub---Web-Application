export type ConvertDirection = 'toml-to-json' | 'json-to-toml';

export interface TomlJsonOptions {
  direction: ConvertDirection;
  prettyJson: boolean;
  sortKeys: boolean;
}

export interface ConvertResult {
  output: string;
  keyCount: number;
  error: string | null;
  errorLine: number | null;
}
