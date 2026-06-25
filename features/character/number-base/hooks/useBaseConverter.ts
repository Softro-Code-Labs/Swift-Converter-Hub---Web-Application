'use client';

import { useMemo } from 'react';
import type { Base, ConversionResult } from '../types/numberBase';

function bitLength(n: bigint): number {
  if (n === BigInt(0)) return 1;
  const abs = n < BigInt(0) ? -n : n;
  return abs.toString(2).length;
}

function groupString(str: string, size: number): string {
  // Insert spaces every `size` chars from the right
  const result: string[] = [];
  const len = str.length;
  for (let i = 0; i < len; i++) {
    if (i > 0 && (len - i) % size === 0) result.push(' ');
    result.push(str[i]);
  }
  return result.join('');
}

export function useBaseConverter(
  rawInput: string,
  activeBase: Base,
  grouped: boolean,
): ConversionResult {
  return useMemo(() => {
    const empty: ConversionResult = {
      binary: '',
      octal: '',
      decimal: '',
      hex: '',
      value: null,
      bits: 0,
      isNegative: false,
      error: null,
    };

    const input = rawInput.replace(/[\s_]/g, '').trim();
    if (!input || input === '-') return empty;

    try {
      const isNegative = input.startsWith('-');
      const absStr = isNegative ? input.slice(1) : input;
      if (!absStr) return empty;

      const value = BigInt(
        isNegative
          ? `-${parseInt(absStr, activeBase)}`
          : parseInt(absStr, activeBase).toString(),
      );

      // Validate: parseInt may silently truncate invalid chars
      const reparsed = parseInt(absStr, activeBase)
        .toString(activeBase)
        .toUpperCase();
      const inputUpper = absStr.toUpperCase();
      if (reparsed !== inputUpper && activeBase !== 10) {
        // Contains invalid characters for this base
        return { ...empty, error: `Invalid character for base ${activeBase}` };
      }

      if (isNaN(Number(value))) return { ...empty, error: 'Invalid number' };

      const abs = isNegative ? -value : value;
      const prefix = isNegative ? '-' : '';

      const binStr = abs.toString(2);
      const octStr = abs.toString(8);
      const decStr = abs.toString(10);
      const hexStr = abs.toString(16).toUpperCase();

      const bits = bitLength(value);

      const fmt = (s: string, size: number) =>
        grouped ? groupString(s, size) : s;

      return {
        binary: prefix + fmt(binStr, 4),
        octal: prefix + fmt(octStr, 3),
        decimal: prefix + fmt(decStr, 3),
        hex: prefix + fmt(hexStr, 2),
        value,
        bits,
        isNegative,
        error: null,
      };
    } catch {
      return { ...empty, error: 'Invalid input' };
    }
  }, [rawInput, activeBase, grouped]);
}
