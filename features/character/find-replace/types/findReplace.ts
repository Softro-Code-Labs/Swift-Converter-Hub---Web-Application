export interface FindReplaceOptions {
  find: string;
  replace: string;
  useRegex: boolean;
  caseSensitive: boolean;
  wholeWord: boolean;
}

export interface MatchRange {
  start: number;
  end: number;
}

export interface FindReplaceResult {
  matches: MatchRange[];
  matchCount: number;
  output: string;
  error: string | null;
}
