'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import type {
  ParseOptions,
  ParseResult,
  SheetData,
  SheetMeta,
} from '../types/excelJson';

function cellValue(
  cell: XLSX.CellObject | undefined,
  dateFormat: ParseOptions['dateFormat'],
): unknown {
  if (!cell || cell.v === undefined || cell.v === null) return null;

  if (
    cell.t === 'd' ||
    (cell.t === 'n' &&
      cell.z &&
      typeof cell.z === 'string' &&
      cell.z.includes('/'))
  ) {
    // Date cell
    const date =
      cell.t === 'd'
        ? (cell.v as Date)
        : XLSX.SSF.parse_date_code(cell.v as number);
    if (dateFormat === 'serial') return cell.v;
    if (dateFormat === 'string') return cell.w ?? String(cell.v);
    // ISO
    try {
      const d =
        cell.t === 'd'
          ? (cell.v as Date)
          : new Date(
              (date as { y: number; m: number; d: number }).y,
              (date as { y: number; m: number; d: number }).m - 1,
              (date as { y: number; m: number; d: number }).d,
            );
      return d.toISOString().split('T')[0];
    } catch {
      return cell.w ?? String(cell.v);
    }
  }

  if (cell.t === 'b') return cell.v as boolean;
  if (cell.t === 'n') return cell.v as number;
  if (cell.t === 'e') return null; // error cell
  return cell.v as string;
}

function parseSheet(
  ws: XLSX.WorkSheet,
  name: string,
  opts: ParseOptions,
): SheetData {
  const range = XLSX.utils.decode_range(ws['!ref'] ?? 'A1');
  const numCols = range.e.c - range.s.c + 1;

  // Build raw rows first
  const rawRows: unknown[][] = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: unknown[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      row.push(cellValue(ws[addr], opts.dateFormat));
    }
    rawRows.push(row);
  }

  // Headers
  const headers: string[] =
    opts.hasHeader && rawRows.length > 0
      ? rawRows[0].map((h, i) =>
          h !== null && h !== undefined && String(h).trim() !== ''
            ? String(h).trim()
            : `col_${i + 1}`,
        )
      : Array.from({ length: numCols }, (_, i) => `col_${i + 1}`);

  const dataRows = opts.hasHeader ? rawRows.slice(1) : rawRows;

  const rows = dataRows
    .map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((h, i) => {
        const val = row[i] ?? null;
        if (!opts.includeEmpty && (val === null || val === '')) return;
        obj[h] = val;
      });
      return obj;
    })
    .filter((obj) => Object.keys(obj).length > 0);

  return { name, headers, rows, rawRows: rawRows.slice(0, 6) };
}

export function useExcelParser() {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState('');

  const parseFile = useCallback(async (file: File, opts: ParseOptions) => {
    setIsParsing(true);
    setResult(null);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, {
        type: 'array',
        cellDates: true,
        cellNF: true,
        cellStyles: false,
      });

      const meta: SheetMeta[] = wb.SheetNames.map((name) => {
        const ws = wb.Sheets[name];
        const ref = ws['!ref'];
        if (!ref) return { name, rowCount: 0, colCount: 0 };
        const range = XLSX.utils.decode_range(ref);
        return {
          name,
          rowCount: range.e.r - range.s.r + 1,
          colCount: range.e.c - range.s.c + 1,
        };
      });

      const sheets: SheetData[] = wb.SheetNames.map((name) =>
        parseSheet(wb.Sheets[name], name, opts),
      );

      setResult({ sheets, meta, error: null });
    } catch (e) {
      setResult({ sheets: [], meta: [], error: (e as Error).message });
    } finally {
      setIsParsing(false);
    }
  }, []);

  const reparse = useCallback(
    async (file: File, opts: ParseOptions) => {
      await parseFile(file, opts);
    },
    [parseFile],
  );

  const clear = useCallback(() => {
    setResult(null);
    setFileName('');
  }, []);

  return { result, isParsing, fileName, parseFile, reparse, clear };
}
