'use client';

import { useMemo } from 'react';
import type { DiffResult, DiffLine } from '../types/textDiff';

// Myers diff algorithm - pure JS, no deps
// Returns array of { type: 'equal'|'insert'|'delete', value: string }
type Op = { type: 'equal' | 'insert' | 'delete'; value: string };

function myersDiff(oldLines: string[], newLines: string[]): Op[] {
  const m = oldLines.length;
  const n = newLines.length;
  const max = m + n;

  if (max === 0) return [];

  const v: Record<number, number> = { 1: 0 };
  const trace: Record<number, number>[] = [];

  for (let d = 0; d <= max; d++) {
    trace.push({ ...v });
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && (v[k - 1] ?? 0) < (v[k + 1] ?? 0))) {
        x = v[k + 1] ?? 0;
      } else {
        x = (v[k - 1] ?? 0) + 1;
      }
      let y = x - k;
      while (x < m && y < n && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }
      v[k] = x;
      if (x >= m && y >= n) {
        // Backtrack
        return backtrack(trace, oldLines, newLines, d);
      }
    }
  }
  return [];
}

function backtrack(
  trace: Record<number, number>[],
  oldLines: string[],
  newLines: string[],
  d: number,
): Op[] {
  const ops: Op[] = [];
  let x = oldLines.length;
  let y = newLines.length;

  for (let step = d; step >= 0; step--) {
    const v = trace[step];
    const k = x - y;

    let prevK: number;
    if (k === -step || (k !== step && (v[k - 1] ?? 0) < (v[k + 1] ?? 0))) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = v[prevK] ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX + (k > prevK ? 1 : 0) && y > prevY + (k < prevK ? 1 : 0)) {
      x--;
      y--;
      ops.unshift({ type: 'equal', value: oldLines[x] });
    }

    if (step > 0) {
      if (k > prevK) {
        ops.unshift({ type: 'delete', value: oldLines[prevX] });
      } else {
        ops.unshift({ type: 'insert', value: newLines[prevY] });
      }
      x = prevX;
      y = prevY;
    }
  }
  return ops;
}

export function useTextDiff(leftText: string, rightText: string): DiffResult {
  return useMemo(() => {
    const empty: DiffResult = {
      left: { lines: [] },
      right: { lines: [] },
      unified: [],
      addedCount: 0,
      removedCount: 0,
      unchangedCount: 0,
      isEmpty: true,
    };

    if (!leftText && !rightText) return empty;

    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');

    const ops = myersDiff(leftLines, rightLines);

    // Build split view
    const leftView: DiffLine[] = [];
    const rightView: DiffLine[] = [];
    const unified: DiffLine[] = [];

    let leftNum = 1;
    let rightNum = 1;
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    for (const op of ops) {
      if (op.type === 'equal') {
        leftView.push({
          type: 'unchanged',
          content: op.value,
          lineNumber: leftNum++,
        });
        rightView.push({
          type: 'unchanged',
          content: op.value,
          lineNumber: rightNum++,
        });
        unified.push({
          type: 'unchanged',
          content: op.value,
          lineNumber: leftNum - 1,
        });
        unchangedCount++;
      } else if (op.type === 'delete') {
        leftView.push({
          type: 'removed',
          content: op.value,
          lineNumber: leftNum++,
        });
        rightView.push({ type: 'removed', content: '', lineNumber: null }); // placeholder
        unified.push({
          type: 'removed',
          content: op.value,
          lineNumber: leftNum - 1,
        });
        removedCount++;
      } else {
        leftView.push({ type: 'added', content: '', lineNumber: null }); // placeholder
        rightView.push({
          type: 'added',
          content: op.value,
          lineNumber: rightNum++,
        });
        unified.push({
          type: 'added',
          content: op.value,
          lineNumber: rightNum - 1,
        });
        addedCount++;
      }
    }

    return {
      left: { lines: leftView },
      right: { lines: rightView },
      unified,
      addedCount,
      removedCount,
      unchangedCount,
      isEmpty: false,
    };
  }, [leftText, rightText]);
}
