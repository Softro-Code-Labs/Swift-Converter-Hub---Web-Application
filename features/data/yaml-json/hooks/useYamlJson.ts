'use client';

import { useMemo } from 'react';
import * as yaml from 'js-yaml';
import type { YamlJsonOptions, ConvertResult } from '../types/yamlJson';

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((s, v) => s + countKeys(v), 0);
  const keys = Object.keys(obj as Record<string, unknown>);
  return (
    keys.length +
    keys.reduce((s, k) => s + countKeys((obj as Record<string, unknown>)[k]), 0)
  );
}

function yamlToJson(raw: string, opts: YamlJsonOptions): ConvertResult {
  try {
    const docs = opts.multiDoc ? yaml.loadAll(raw) : [yaml.load(raw)];

    const validDocs = docs.filter((d) => d !== null && d !== undefined);
    if (validDocs.length === 0) {
      return {
        output: '',
        docCount: 0,
        keyCount: 0,
        error: null,
        errorLine: null,
      };
    }

    const indent = opts.prettyJson ? 2 : undefined;
    const output =
      validDocs.length === 1
        ? JSON.stringify(validDocs[0], null, indent)
        : JSON.stringify(validDocs, null, indent);

    return {
      output,
      docCount: validDocs.length,
      keyCount: countKeys(validDocs.length === 1 ? validDocs[0] : validDocs),
      error: null,
      errorLine: null,
    };
  } catch (e) {
    const err = e as yaml.YAMLException;
    const line = err.mark?.line != null ? err.mark.line + 1 : null;
    return {
      output: '',
      docCount: 0,
      keyCount: 0,
      error: err.reason ?? err.message,
      errorLine: line,
    };
  }
}

function jsonToYaml(raw: string, opts: YamlJsonOptions): ConvertResult {
  try {
    const parsed = JSON.parse(raw.trim());
    const docs = Array.isArray(parsed) && opts.multiDoc ? parsed : [parsed];

    const parts = docs.map((doc) =>
      yaml.dump(doc, {
        indent: opts.yamlIndent,
        lineWidth: opts.lineWidth === -1 ? Infinity : opts.lineWidth,
        sortKeys: opts.sortKeys,
        noRefs: true,
      }),
    );

    const output =
      opts.multiDoc && parts.length > 1
        ? parts.map((p) => `---\n${p}`).join('\n')
        : parts[0];

    return {
      output: output.trimEnd(),
      docCount: docs.length,
      keyCount: countKeys(parsed),
      error: null,
      errorLine: null,
    };
  } catch (e) {
    return {
      output: '',
      docCount: 0,
      keyCount: 0,
      error: (e as Error).message,
      errorLine: null,
    };
  }
}

export function useYamlJson(
  input: string,
  opts: YamlJsonOptions,
): ConvertResult {
  return useMemo(() => {
    if (!input.trim()) {
      return {
        output: '',
        docCount: 0,
        keyCount: 0,
        error: null,
        errorLine: null,
      };
    }
    return opts.direction === 'yaml-to-json'
      ? yamlToJson(input, opts)
      : jsonToYaml(input, opts);
  }, [input, opts]);
}
