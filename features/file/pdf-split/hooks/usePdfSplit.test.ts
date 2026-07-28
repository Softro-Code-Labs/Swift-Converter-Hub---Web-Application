import { describe, it, expect } from 'vitest';
import { parseRangeString, validateRangeString } from './usePdfSplit';

describe('parseRangeString', () => {
  it('parses a simple comma-separated list into 0-based indices', () => {
    expect(parseRangeString('1, 3, 5', 10)).toEqual([0, 2, 4]);
  });

  it('parses a dash range into consecutive 0-based indices', () => {
    expect(parseRangeString('1-3', 10)).toEqual([0, 1, 2]);
  });

  it('parses a mix of single pages and ranges', () => {
    expect(parseRangeString('1-3, 5, 7-9', 10)).toEqual([
      0, 1, 2, 4, 6, 7, 8,
    ]);
  });

  it('handles a reversed range (e.g. "5-3")', () => {
    expect(parseRangeString('5-3', 10)).toEqual([2, 3, 4]);
  });

  it('de-duplicates overlapping entries', () => {
    expect(parseRangeString('1-3, 2, 3-4', 10)).toEqual([0, 1, 2, 3]);
  });

  it('returns results sorted ascending regardless of input order', () => {
    expect(parseRangeString('5, 1, 3', 10)).toEqual([0, 2, 4]);
  });

  it('rejects a single page number above maxPage rather than clamping it', () => {
    expect(parseRangeString('999', 5)).toEqual([]);
  });

  it('clamps range endpoints above maxPage', () => {
    expect(parseRangeString('3-999', 5)).toEqual([2, 3, 4]);
  });

  it('ignores page 0 and negative page numbers', () => {
    expect(parseRangeString('0, -1, 2', 10)).toEqual([1]);
  });

  it('ignores non-numeric garbage', () => {
    expect(parseRangeString('abc, 2, xyz', 10)).toEqual([1]);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseRangeString('', 10)).toEqual([]);
  });

  it('returns an empty array when nothing valid is found', () => {
    expect(parseRangeString('abc, def', 10)).toEqual([]);
  });
});

describe('validateRangeString', () => {
  it('returns null for an empty/blank string (no error shown yet)', () => {
    expect(validateRangeString('', 10)).toBeNull();
    expect(validateRangeString('   ', 10)).toBeNull();
  });

  it('returns null for a valid range', () => {
    expect(validateRangeString('1-3, 5', 10)).toBeNull();
  });

  it('returns an error message when no valid pages are found', () => {
    expect(validateRangeString('abc', 10)).toBe(
      'No valid pages found in range',
    );
  });

  it('returns an error for a range entirely out of bounds', () => {
    // maxPage is 5, so "0" and negative-only input resolve to nothing
    expect(validateRangeString('0', 5)).toBe('No valid pages found in range');
  });
});
