export type RegexFlag = 'g' | 'i' | 'm' | 's' | 'u';

export interface RegexFlagMeta {
  flag: RegexFlag;
  label: string;
  title: string;
}

export interface CaptureGroup {
  index: number; // group number (1-based)
  name: string | null; // named group or null
  value: string | null;
}

export interface RegexMatch {
  index: number; // match number (0-based)
  start: number; // char offset in source
  end: number;
  fullMatch: string;
  groups: CaptureGroup[];
}

export interface RegexResult {
  matches: RegexMatch[];
  matchCount: number;
  error: string | null;
  pattern: string;
  flags: string;
}
