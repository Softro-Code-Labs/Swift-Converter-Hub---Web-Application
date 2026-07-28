'use client';

import { useMemo } from 'react';
import type { JsonXmlOptions, ConvertResult } from '../types/jsonXml';

// --- JSON → XML ---------------------------------------------------------------

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toSafeTag(key: string, attrPrefix: string): string {
  // Strip attribute prefix and array indicator suffix, sanitise for XML tag
  let tag = key;
  if (tag.startsWith(attrPrefix)) tag = tag.slice(attrPrefix.length);
  if (tag.endsWith('[]')) tag = tag.slice(0, -2);
  // Replace invalid tag-start chars
  tag = tag.replace(/[^a-zA-Z0-9_\-.]/g, '_');
  if (/^[0-9\-.]/.test(tag)) tag = `_${tag}`;
  return tag || '_';
}

function valueToXml(
  key: string,
  value: unknown,
  opts: JsonXmlOptions,
  indent: string,
  depth: number,
): string {
  const pad = opts.prettyXml ? indent.repeat(depth) : '';
  const nl = opts.prettyXml ? '\n' : '';
  const tag = toSafeTag(key, opts.attributePrefix);

  if (value === null || value === undefined) {
    return `${pad}<${tag}/>${nl}`;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => valueToXml(key, item, opts, indent, depth))
      .join('');
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    // Collect attributes (keys starting with attributePrefix)
    const attrEntries = Object.entries(obj).filter(
      ([k]) => k.startsWith(opts.attributePrefix) && k !== opts.textKey,
    );
    const childEntries = Object.entries(obj).filter(
      ([k]) => !k.startsWith(opts.attributePrefix),
    );

    const attrs = attrEntries
      .map(
        ([k, v]) =>
          ` ${toSafeTag(k, opts.attributePrefix)}="${escapeXml(String(v))}"`,
      )
      .join('');

    // Text-only node with attributes
    if (childEntries.length === 1 && childEntries[0][0] === opts.textKey) {
      return `${pad}<${tag}${attrs}>${escapeXml(String(childEntries[0][1]))}</${tag}>${nl}`;
    }

    if (childEntries.length === 0) {
      return `${pad}<${tag}${attrs}/>${nl}`;
    }

    const children = childEntries
      .map(([k, v]) => valueToXml(k, v, opts, indent, depth + 1))
      .join('');

    return `${pad}<${tag}${attrs}>${nl}${children}${pad}</${tag}>${nl}`;
  }

  // Primitive
  return `${pad}<${tag}>${escapeXml(String(value))}</${tag}>${nl}`;
}

function jsonToXml(raw: string, opts: JsonXmlOptions): ConvertResult {
  try {
    const parsed = JSON.parse(raw.trim());
    const indent = '  ';
    const nl = opts.prettyXml ? '\n' : '';
    const declaration = `<?xml version="1.0" encoding="UTF-8"?>${nl}`;

    let body: string;
    let nodeCount = 0;

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      // Object - wrap each key as child of root
      const children = Object.entries(parsed)
        .map(([k, v]) => {
          nodeCount++;
          return valueToXml(k, v, opts, indent, 1);
        })
        .join('');
      body = `<${opts.rootElement}>${nl}${children}</${opts.rootElement}>${nl}`;
    } else if (Array.isArray(parsed)) {
      const children = parsed
        .map((item) => {
          nodeCount++;
          return valueToXml('item', item, opts, indent, 1);
        })
        .join('');
      body = `<${opts.rootElement}>${nl}${children}</${opts.rootElement}>${nl}`;
    } else {
      body = `<${opts.rootElement}>${escapeXml(String(parsed))}</${opts.rootElement}>${nl}`;
      nodeCount = 1;
    }

    return { output: declaration + body, nodeCount, error: null };
  } catch (e) {
    return { output: '', nodeCount: 0, error: (e as Error).message };
  }
}

// --- XML → JSON ---------------------------------------------------------------

function parseXmlToNode(xml: string): Document {
  if (typeof window === 'undefined')
    throw new Error('XML parsing requires a browser');
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml.trim(), 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent ?? 'XML parse error');
  return doc;
}

function nodeToJson(
  node: Element,
  opts: JsonXmlOptions,
): Record<string, unknown> | string | number | boolean | null {
  const result: Record<string, unknown> = {};

  // Attributes → prefixed keys
  for (const attr of Array.from(node.attributes)) {
    result[`${opts.attributePrefix}${attr.name}`] = attr.value;
  }

  const children = Array.from(node.childNodes);
  const elementChildren = children.filter((n) => n.nodeType === 1) as Element[];
  const textContent = children
    .filter((n) => n.nodeType === 3)
    .map((n) => n.textContent ?? '')
    .join('')
    .trim();

  if (elementChildren.length === 0) {
    if (Object.keys(result).length === 0) {
      // Plain text node - auto coerce
      return coerceXmlValue(textContent);
    }
    if (textContent) result[opts.textKey] = textContent;
    return result;
  }

  // Group repeated tags into arrays
  const tagCounts: Record<string, number> = {};
  elementChildren.forEach((c) => {
    tagCounts[c.tagName] = (tagCounts[c.tagName] ?? 0) + 1;
  });

  elementChildren.forEach((child) => {
    const childJson = nodeToJson(child, opts);
    if (tagCounts[child.tagName] > 1) {
      if (!result[child.tagName]) result[child.tagName] = [];
      (result[child.tagName] as unknown[]).push(childJson);
    } else {
      result[child.tagName] = childJson;
    }
  });

  if (textContent && Object.keys(result).length > 0) {
    result[opts.textKey] = textContent;
  }

  return result;
}

function coerceXmlValue(val: string): string | number | boolean | null {
  if (val === '') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null') return null;
  const n = Number(val);
  if (!isNaN(n) && val.trim() !== '') return n;
  return val;
}

function countNodes(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 1;
  return Object.values(obj as Record<string, unknown>).reduce(
    (sum: number, v) => sum + countNodes(v),
    1,
  );
}

function xmlToJson(raw: string, opts: JsonXmlOptions): ConvertResult {
  try {
    const doc = parseXmlToNode(raw.trim());
    const root = doc.documentElement;
    const result: Record<string, unknown> = {};
    result[root.tagName] = nodeToJson(root, opts);

    const nodeCount = countNodes(result);
    const indent = opts.prettyJson ? 2 : undefined;
    return {
      output: JSON.stringify(result, null, indent),
      nodeCount,
      error: null,
    };
  } catch (e) {
    return { output: '', nodeCount: 0, error: (e as Error).message };
  }
}

// --- Hook ---------------------------------------------------------------------

export function useJsonXml(input: string, opts: JsonXmlOptions): ConvertResult {
  return useMemo(() => {
    if (!input.trim()) return { output: '', nodeCount: 0, error: null };
    return opts.direction === 'json-to-xml'
      ? jsonToXml(input, opts)
      : xmlToJson(input, opts);
  }, [input, opts]);
}
