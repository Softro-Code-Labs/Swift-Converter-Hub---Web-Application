import { describe, it, expect } from 'vitest';
import { getFormatByExtension, isConversionAllowed } from './formats';

describe('getFormatByExtension', () => {
  it('finds a known audio format case-insensitively', () => {
    expect(getFormatByExtension('MP3')?.extension).toBe('mp3');
  });

  it('returns undefined for an unknown extension', () => {
    expect(getFormatByExtension('not-a-format')).toBeUndefined();
  });
});

describe('isConversionAllowed', () => {
  it('allows converting between two distinct known formats', () => {
    expect(isConversionAllowed('mp3', 'wav')).toBe(true);
  });

  it('rejects converting a format to itself', () => {
    expect(isConversionAllowed('mp3', 'mp3')).toBe(false);
  });

  it('rejects same-format conversions regardless of casing', () => {
    expect(isConversionAllowed('MP3', 'mp3')).toBe(false);
  });

  it('rejects unknown formats', () => {
    expect(isConversionAllowed('mp3', 'not-a-format')).toBe(false);
    expect(isConversionAllowed('not-a-format', 'mp3')).toBe(false);
  });
});
