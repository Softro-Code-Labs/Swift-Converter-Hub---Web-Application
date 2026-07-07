'use client';

import { useMemo } from 'react';
import TOML from '@iarna/toml';
import type { TomlJsonOptions, ConvertResult } from '../types/tomlJson';

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj))
    return obj.reduce((s: number, v) => s + countKeys(v), 0);
  const keys = Object.keys(obj as Record<string, unknown>);
  return (
    keys.length +
    keys.reduce((s, k) => s + countKeys((obj as Record<string, unknown>)[k]), 0)
  );
}

// TOML stringify doesn't exist in @iarna/toml under the name stringify
// - it's TOML.stringify
function sortObjKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjKeys);
  if (typeof obj === 'object' && obj !== null) {
    const sorted: Record<string, unknown> = {};
    Object.keys(obj as Record<string, unknown>)
      .sort()
      .forEach((k) => {
        sorted[k] = sortObjKeys((obj as Record<string, unknown>)[k]);
      });
    return sorted;
  }
  return obj;
}

// Convert JSON-parsed value back to TOML-compatible
// (Date objects from TOML survive JSON round-trip as strings - convert back)
function prepareForToml(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(prepareForToml);
  if (obj instanceof Date) return obj;
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[k] = prepareForToml(v);
    }
    return result;
  }
  // Try parsing ISO date strings back to Date
  if (typeof obj === 'string') {
    const isoRe =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
    if (isoRe.test(obj)) {
      const d = new Date(obj);
      if (!isNaN(d.getTime())) return d;
    }
  }
  return obj;
}

function tomlToJson(raw: string, opts: TomlJsonOptions): ConvertResult {
  try {
    const parsed = TOML.parse(raw);
    let data: unknown = parsed;
    if (opts.sortKeys) data = sortObjKeys(data);
    const indent = opts.prettyJson ? 2 : undefined;
    const output = JSON.stringify(data, null, indent);
    return { output, keyCount: countKeys(data), error: null, errorLine: null };
  } catch (e) {
    const err = e as Error & { line?: number; col?: number };
    const line = typeof err.line === 'number' ? err.line : null;
    // @iarna/toml error messages include "at row X col Y"
    const lineMatch = err.message?.match(/at row (\d+)/);
    const errorLine = line ?? (lineMatch ? parseInt(lineMatch[1]) : null);
    return { output: '', keyCount: 0, error: err.message, errorLine };
  }
}

function jsonToToml(raw: string, opts: TomlJsonOptions): ConvertResult {
  try {
    let parsed: unknown = JSON.parse(raw.trim());

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new Error(
        'TOML requires a top-level object (table). Arrays and primitives cannot be the root.',
      );
    }

    if (opts.sortKeys) parsed = sortObjKeys(parsed);
    parsed = prepareForToml(parsed);

    const output = TOML.stringify(
      parsed as Parameters<typeof TOML.stringify>[0],
    );
    return {
      output: output.trimEnd(),
      keyCount: countKeys(parsed),
      error: null,
      errorLine: null,
    };
  } catch (e) {
    return {
      output: '',
      keyCount: 0,
      error: (e as Error).message,
      errorLine: null,
    };
  }
}

export function useTomlJson(
  input: string,
  opts: TomlJsonOptions,
): ConvertResult {
  return useMemo(() => {
    if (!input.trim()) {
      return { output: '', keyCount: 0, error: null, errorLine: null };
    }
    return opts.direction === 'toml-to-json'
      ? tomlToJson(input, opts)
      : jsonToToml(input, opts);
  }, [input, opts]);
}
