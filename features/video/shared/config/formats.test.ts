import { describe, it, expect } from 'vitest';
import { getFormatByExtension, isConversionAllowed } from './formats';

describe('getFormatByExtension', () => {
  it('finds a known video format case-insensitively', () => {
    expect(getFormatByExtension('MP4')?.extension).toBe('mp4');
  });

  it('returns undefined for an unknown extension', () => {
    expect(getFormatByExtension('not-a-format')).toBeUndefined();
  });
});

describe('isConversionAllowed', () => {
  it('allows converting between two distinct known formats', () => {
    expect(isConversionAllowed('mp4', 'webm')).toBe(true);
  });

  it('rejects converting a format to itself', () => {
    expect(isConversionAllowed('mp4', 'mp4')).toBe(false);
  });

  it('rejects same-format conversions regardless of casing', () => {
    expect(isConversionAllowed('MP4', 'mp4')).toBe(false);
  });

  it('rejects unknown formats', () => {
    expect(isConversionAllowed('mp4', 'not-a-format')).toBe(false);
    expect(isConversionAllowed('not-a-format', 'mp4')).toBe(false);
  });
});
