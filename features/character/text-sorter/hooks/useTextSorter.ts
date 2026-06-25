'use client';

import { useMemo } from 'react';
import type {
  OperationId,
  SorterOptions,
  SorterResult,
} from '../types/textSorter';

function seededShuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function parseNumeric(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? Infinity : n;
}

function applyOperation(
  lines: string[],
  op: OperationId,
  caseSensitive: boolean,
): string[] {
  const key = (s: string) => (caseSensitive ? s : s.toLowerCase());

  switch (op) {
    case 'sort-az':
      return [...lines].sort((a, b) => key(a).localeCompare(key(b)));
    case 'sort-za':
      return [...lines].sort((a, b) => key(b).localeCompare(key(a)));
    case 'sort-length-asc':
      return [...lines].sort((a, b) => a.length - b.length);
    case 'sort-length-desc':
      return [...lines].sort((a, b) => b.length - a.length);
    case 'sort-numeric':
      return [...lines].sort((a, b) => parseNumeric(a) - parseNumeric(b));
    case 'shuffle':
      return seededShuffle(lines);
    case 'reverse':
      return [...lines].reverse();
    case 'deduplicate': {
      const seen = new Set<string>();
      return lines.filter((l) => {
        const k = key(l);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    case 'remove-blanks':
      return lines.filter((l) => l.trim().length > 0);
    case 'trim-lines':
      return lines.map((l) => l.trim());
    case 'lowercase':
      return lines.map((l) => l.toLowerCase());
    case 'uppercase':
      return lines.map((l) => l.toUpperCase());
    default:
      return lines;
  }
}

export function useTextSorter(text: string, opts: SorterOptions): SorterResult {
  return useMemo(() => {
    const inputLines = text.split('\n');
    const inputCount = inputLines.length;

    if (!text || opts.operations.length === 0) {
      return {
        lines: inputLines,
        inputCount,
        outputCount: inputCount,
        removedCount: 0,
      };
    }

    let lines = inputLines;
    for (const op of opts.operations) {
      lines = applyOperation(lines, op, opts.caseSensitive);
    }

    return {
      lines,
      inputCount,
      outputCount: lines.length,
      removedCount: inputCount - lines.length,
    };
  }, [text, opts]);
}
