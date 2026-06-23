'use client';

import { useMemo } from 'react';
import type {
  RegexFlag,
  RegexResult,
  RegexMatch,
  CaptureGroup,
} from '../types/regexTester';

export function useRegexEngine(
  pattern: string,
  activeFlags: Set<RegexFlag>,
  testString: string,
): RegexResult {
  return useMemo(() => {
    const empty: RegexResult = {
      matches: [],
      matchCount: 0,
      error: null,
      pattern,
      flags: [...activeFlags].join(''),
    };

    if (!pattern || !testString) return empty;

    try {
      // Always include 'g' and 'd' internally so we can get indices
      // 'd' flag gives match.indices (node 18+ / modern browsers)
      const flagStr = [...new Set([...activeFlags, 'g' as RegexFlag])].join('');
      const re = new RegExp(pattern, flagStr);

      const matches: RegexMatch[] = [];
      let m: RegExpExecArray | null;
      let safetyCount = 0;

      re.lastIndex = 0;
      while ((m = re.exec(testString)) !== null && safetyCount < 1000) {
        safetyCount++;

        // Build capture groups
        const groups: CaptureGroup[] = [];
        // named groups
        const namedGroups = m.groups ?? {};

        for (let i = 1; i < m.length; i++) {
          // Find name for this group index (if any)
          const name =
            Object.entries(namedGroups).find(
              ([, v]) => v === m![i] && m![i] !== undefined,
            )?.[0] ?? null;
          groups.push({ index: i, name, value: m[i] ?? null });
        }

        matches.push({
          index: matches.length,
          start: m.index,
          end: m.index + m[0].length,
          fullMatch: m[0],
          groups,
        });

        // Guard zero-length match infinite loop
        if (m[0].length === 0) re.lastIndex++;
      }

      return {
        matches,
        matchCount: matches.length,
        error: null,
        pattern,
        flags: flagStr,
      };
    } catch (e) {
      return { ...empty, error: (e as Error).message };
    }
  }, [pattern, activeFlags, testString]);
}
