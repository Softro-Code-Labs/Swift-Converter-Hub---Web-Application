'use client';

import { useMemo } from 'react';
import type {
  FindReplaceOptions,
  FindReplaceResult,
  MatchRange,
} from '../types/findReplace';

export function useFindReplace(
  text: string,
  opts: FindReplaceOptions,
): FindReplaceResult {
  return useMemo(() => {
    const empty: FindReplaceResult = {
      matches: [],
      matchCount: 0,
      output: text,
      error: null,
    };

    if (!text || !opts.find) return empty;

    try {
      let pattern: RegExp;

      if (opts.useRegex) {
        const flags = ['g', opts.caseSensitive ? '' : 'i'].join('');
        pattern = new RegExp(opts.find, flags);
      } else {
        // Escape special regex chars for plain text mode
        let escaped = opts.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (opts.wholeWord) escaped = `\\b${escaped}\\b`;
        const flags = ['g', opts.caseSensitive ? '' : 'i'].join('');
        pattern = new RegExp(escaped, flags);
      }

      // Collect match ranges
      const matches: MatchRange[] = [];
      let m: RegExpExecArray | null;
      // Guard against zero-length matches causing infinite loops
      pattern.lastIndex = 0;
      while ((m = pattern.exec(text)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length });
        if (m[0].length === 0) pattern.lastIndex++;
      }

      // Build replaced output
      pattern.lastIndex = 0;
      const output = text.replace(pattern, opts.replace);

      return { matches, matchCount: matches.length, output, error: null };
    } catch (e) {
      return { ...empty, error: (e as Error).message };
    }
  }, [text, opts]);
}
