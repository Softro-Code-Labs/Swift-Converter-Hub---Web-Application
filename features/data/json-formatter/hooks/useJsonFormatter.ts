'use client';

import { useMemo } from 'react';
import type {
  FormatterOptions,
  FormatterResult,
  JsonStats,
  IndentStyle,
} from '../types/jsonFormatter';

function getIndent(style: IndentStyle): string | number {
  return style === 'tab' ? '\t' : style;
}

function computeStats(parsed: unknown): JsonStats {
  let keys = 0,
    values = 0,
    arrays = 0,
    objects = 0;
  let strings = 0,
    numbers = 0,
    booleans = 0,
    nulls = 0;
  let maxDepth = 0;

  function walk(node: unknown, depth: number) {
    maxDepth = Math.max(maxDepth, depth);

    if (node === null) {
      nulls++;
      values++;
      return;
    }
    if (typeof node === 'string') {
      strings++;
      values++;
      return;
    }
    if (typeof node === 'number') {
      numbers++;
      values++;
      return;
    }
    if (typeof node === 'boolean') {
      booleans++;
      values++;
      return;
    }

    if (Array.isArray(node)) {
      arrays++;
      node.forEach((item) => walk(item, depth + 1));
      return;
    }

    if (typeof node === 'object') {
      objects++;
      const entries = Object.entries(node as Record<string, unknown>);
      keys += entries.length;
      entries.forEach(([, v]) => walk(v, depth + 1));
    }
  }

  walk(parsed, 0);
  return {
    isValid: true,
    keys,
    values,
    arrays,
    objects,
    strings,
    numbers,
    booleans,
    nulls,
    maxDepth,
    size: 0, // filled after
    minifiedSize: 0, // filled after
  };
}

function sortKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (typeof obj === 'object' && obj !== null) {
    const sorted: Record<string, unknown> = {};
    Object.keys(obj as Record<string, unknown>)
      .sort()
      .forEach((k) => {
        sorted[k] = sortKeys((obj as Record<string, unknown>)[k]);
      });
    return sorted;
  }
  return obj;
}

function ensureAscii(str: string): string {
  return str.replace(/[^\x00-\x7F]/g, (c) => {
    const code = c.codePointAt(0)!;
    if (code > 0xffff) {
      const high = Math.floor((code - 0x10000) / 0x400) + 0xd800;
      const low = ((code - 0x10000) % 0x400) + 0xdc00;
      return `\\u${high.toString(16).padStart(4, '0')}\\u${low.toString(16).padStart(4, '0')}`;
    }
    return `\\u${code.toString(16).padStart(4, '0')}`;
  });
}

function extractErrorLocation(msg: string): {
  line: number | null;
  col: number | null;
} {
  // Chrome: "at position N", Firefox: "at line N column M"
  const posMatch = msg.match(/at position (\d+)/);
  const lineMatch = msg.match(/line (\d+)/);
  const colMatch = msg.match(/column (\d+)/);

  if (posMatch) {
    return { line: null, col: parseInt(posMatch[1]) };
  }
  return {
    line: lineMatch ? parseInt(lineMatch[1]) : null,
    col: colMatch ? parseInt(colMatch[1]) : null,
  };
}

export function useJsonFormatter(
  input: string,
  opts: FormatterOptions,
): FormatterResult {
  return useMemo(() => {
    const empty: FormatterResult = {
      output: '',
      error: null,
      errorLine: null,
      errorCol: null,
      stats: null,
    };

    if (!input.trim()) return empty;

    try {
      let parsed = JSON.parse(input);
      if (opts.sortKeys) parsed = sortKeys(parsed);

      const stats = computeStats(parsed);
      const minified = JSON.stringify(parsed);
      stats.minifiedSize = new TextEncoder().encode(minified).length;

      let output: string;
      if (opts.mode === 'minify') {
        output = minified;
      } else {
        output = JSON.stringify(parsed, null, getIndent(opts.indent));
      }

      if (opts.ensureAscii) output = ensureAscii(output);

      stats.size = new TextEncoder().encode(output).length;

      return {
        output: opts.mode === 'validate' ? output : output,
        error: null,
        errorLine: null,
        errorCol: null,
        stats,
      };
    } catch (e) {
      const msg = (e as Error).message;
      const { line, col } = extractErrorLocation(msg);

      // Try to compute line number from position if we only have position
      let errorLine = line;
      if (!errorLine) {
        const posMatch = msg.match(/at position (\d+)/);
        if (posMatch) {
          const pos = parseInt(posMatch[1]);
          errorLine = input.slice(0, pos).split('\n').length;
        }
      }

      return {
        output: '',
        error: msg,
        errorLine,
        errorCol: col,
        stats: null,
      };
    }
  }, [input, opts]);
}
