export type CharCategory =
  | 'letter'
  | 'digit'
  | 'punctuation'
  | 'symbol'
  | 'space'
  | 'invisible'
  | 'emoji'
  | 'control'
  | 'other';

export interface CharInfo {
  char: string;
  codePoint: number;
  hex: string; // U+XXXX
  htmlEntity: string; // &#xXXXX;
  utf8Bytes: string; // hex bytes
  category: CharCategory;
  name: string;
  isInvisible: boolean;
  isAscii: boolean;
  index: number; // position in original string
}

export interface InspectorStats {
  total: number;
  unique: number;
  invisible: number;
  nonAscii: number;
  emoji: number;
}
