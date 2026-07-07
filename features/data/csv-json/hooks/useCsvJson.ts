'use client';

import { useMemo } from 'react';
import type { CsvJsonOptions, ConvertResult } from '../types/csvJson';

// --- Pure JS CSV parser --------------------------------------------------------
// Handles quoted fields, escaped quotes, multiline values
function parseCsv(raw: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];

    if (inQuotes) {
      if (ch === '"') {
        if (raw[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (raw.slice(i, i + delimiter.length) === delimiter) {
        row.push(field);
        field = '';
        i += delimiter.length;
      } else if (ch === '\n') {
        row.push(field);
        field = '';
        if (row.some((c) => c.trim() !== '')) rows.push(row);
        row = [];
        i++;
      } else if (ch === '\r') {
        i++; // skip CR in CRLF
      } else {
        field += ch;
        i++;
      }
    }
  }

  // Last field / row
  row.push(field);
  if (row.some((c) => c.trim() !== '')) rows.push(row);

  return rows;
}

// Auto-coerce string values to number/boolean/null
function coerce(val: string): string | number | boolean | null {
  if (val === '') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (val === 'null' || val === 'NULL') return null;
  const n = Number(val);
  if (!isNaN(n) && val.trim() !== '') return n;
  return val;
}

function csvToJson(raw: string, opts: CsvJsonOptions): ConvertResult {
  try {
    const rows = parseCsv(raw.trim(), opts.delimiter);
    if (rows.length === 0)
      return { output: '', rowCount: 0, colCount: 0, error: null };

    const headers = opts.hasHeader
      ? rows[0].map((h) => h.trim() || `col_${rows[0].indexOf(h)}`)
      : rows[0].map((_, i) => `col_${i}`);

    const dataRows = opts.hasHeader ? rows.slice(1) : rows;
    const colCount = headers.length;

    const records = dataRows.map((row) => {
      const obj: Record<string, string | number | boolean | null> = {};
      headers.forEach((h, i) => {
        obj[h] = coerce(row[i] ?? '');
      });
      return obj;
    });

    const indent = opts.prettyJson ? 2 : undefined;
    const output = JSON.stringify(records, null, indent);

    return { output, rowCount: dataRows.length, colCount, error: null };
  } catch (e) {
    return {
      output: '',
      rowCount: 0,
      colCount: 0,
      error: (e as Error).message,
    };
  }
}

function jsonToCsv(raw: string, opts: CsvJsonOptions): ConvertResult {
  try {
    const parsed = JSON.parse(raw.trim());

    const records: Record<string, unknown>[] = Array.isArray(parsed)
      ? parsed
      : typeof parsed === 'object' && parsed !== null
        ? [parsed]
        : (() => {
            throw new Error('Input must be a JSON array or object');
          })();

    if (records.length === 0)
      return { output: '', rowCount: 0, colCount: 0, error: null };

    // Collect all unique keys
    const keySet = new Set<string>();
    records.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
    const headers = [...keySet];
    const colCount = headers.length;

    const escapeField = (val: unknown): string => {
      const str = val === null || val === undefined ? '' : String(val);
      const needsQuote =
        str.includes(opts.delimiter) || str.includes('"') || str.includes('\n');
      return needsQuote ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const lines: string[] = [];
    if (opts.hasHeader)
      lines.push(headers.map(escapeField).join(opts.delimiter));
    records.forEach((r) => {
      lines.push(headers.map((h) => escapeField(r[h])).join(opts.delimiter));
    });

    return {
      output: lines.join('\n'),
      rowCount: records.length,
      colCount,
      error: null,
    };
  } catch (e) {
    return {
      output: '',
      rowCount: 0,
      colCount: 0,
      error: (e as Error).message,
    };
  }
}

export function useCsvJson(input: string, opts: CsvJsonOptions): ConvertResult {
  return useMemo(() => {
    if (!input.trim())
      return { output: '', rowCount: 0, colCount: 0, error: null };
    return opts.direction === 'csv-to-json'
      ? csvToJson(input, opts)
      : jsonToCsv(input, opts);
  }, [input, opts]);
}
