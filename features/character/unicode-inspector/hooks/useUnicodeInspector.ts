'use client';

import { useMemo } from 'react';
import {
  getCharName,
  getCategory,
  getUtf8Bytes,
  INVISIBLE_CHARS,
} from '../lib/unicodeData';
import type { CharInfo, InspectorStats } from '../types/unicodeInspector';

export function useUnicodeInspector(text: string): {
  chars: CharInfo[];
  stats: InspectorStats;
} {
  return useMemo(() => {
    if (!text) {
      return {
        chars: [],
        stats: { total: 0, unique: 0, invisible: 0, nonAscii: 0, emoji: 0 },
      };
    }

    // Use Array.from to correctly handle surrogate pairs / multi-code-point emoji
    const graphemes = Array.from(text);
    const chars: CharInfo[] = [];
    let index = 0;

    for (const char of graphemes) {
      const codePoint = char.codePointAt(0) ?? 0;
      const hex = `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
      const htmlEntity = `&#x${codePoint.toString(16).toUpperCase()};`;
      const utf8Bytes = getUtf8Bytes(char);
      const category = getCategory(codePoint, char);
      const name = getCharName(codePoint);
      const isInvisible =
        INVISIBLE_CHARS[codePoint] !== undefined ||
        category === 'control' ||
        category === 'invisible';
      const isAscii = codePoint < 128;

      chars.push({
        char,
        codePoint,
        hex,
        htmlEntity,
        utf8Bytes,
        category,
        name,
        isInvisible,
        isAscii,
        index,
      });
      index++;
    }

    const unique = new Set(chars.map((c) => c.codePoint)).size;
    const invisible = chars.filter((c) => c.isInvisible).length;
    const nonAscii = chars.filter((c) => !c.isAscii).length;
    const emoji = chars.filter((c) => c.category === 'emoji').length;

    return {
      chars,
      stats: { total: chars.length, unique, invisible, nonAscii, emoji },
    };
  }, [text]);
}
