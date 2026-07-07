export type ConvertDirection = 'csv-to-json' | 'json-to-csv';
export type Delimiter = ',' | '\t' | ';' | '|';

export interface CsvJsonOptions {
  direction: ConvertDirection;
  delimiter: Delimiter;
  hasHeader: boolean;
  prettyJson: boolean;
  arrayOutput: boolean;
}

export interface ConvertResult {
  output: string;
  rowCount: number;
  colCount: number;
  error: string | null;
}

export const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: ',', label: 'Comma (,)' },
  { value: '\t', label: 'Tab (⇥)' },
  { value: ';', label: 'Semicolon (;)' },
  { value: '|', label: 'Pipe (|)' },
];
