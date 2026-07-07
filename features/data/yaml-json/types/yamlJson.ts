export type ConvertDirection = 'yaml-to-json' | 'json-to-yaml';

export interface YamlJsonOptions {
  direction: ConvertDirection;
  prettyJson: boolean;
  yamlIndent: number;
  lineWidth: number;
  sortKeys: boolean;
  multiDoc: boolean;
}

export interface ConvertResult {
  output: string;
  docCount: number;
  keyCount: number;
  error: string | null;
  errorLine: number | null;
}
