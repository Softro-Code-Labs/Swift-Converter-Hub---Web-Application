import { describe, it, expect } from 'vitest';
import { getCharName, getCategory, getUtf8Bytes, INVISIBLE_CHARS } from './unicodeData';

describe('getCharName', () => {
  it('names a known control character', () => {
    expect(getCharName(0x0009)).toBe('TAB');
  });

  it('names an uppercase Latin letter by range', () => {
    expect(getCharName(0x0041)).toBe('LATIN CAPITAL LETTER A');
  });

  it('names a lowercase Latin letter by range, preserving its case', () => {
    expect(getCharName(0x007a)).toBe('LATIN SMALL LETTER z');
  });

  it('names a digit by range', () => {
    expect(getCharName(0x0035)).toBe('DIGIT 5');
  });

  it('names a known invisible character', () => {
    expect(getCharName(0x200b)).toBe('ZERO WIDTH SPACE');
  });

  it('falls back to a U+ codepoint label for unknown characters', () => {
    // U+00B5 MICRO SIGN has no explicit entry and falls outside every named range
    expect(getCharName(0x00b5)).toBe('U+00B5');
  });
});

describe('getCategory', () => {
  it('categorizes a known invisible character', () => {
    expect(getCategory(0x200b, '\u200b')).toBe('invisible');
  });

  it('categorizes C0 control characters', () => {
    expect(getCategory(0x0001, '\u0001')).toBe('control');
  });

  it('categorizes a plain space as space', () => {
    expect(getCategory(0x20, ' ')).toBe('space');
  });

  it('categorizes a letter', () => {
    expect(getCategory(0x0041, 'A')).toBe('letter');
  });

  it('categorizes a digit', () => {
    expect(getCategory(0x0035, '5')).toBe('digit');
  });

  it('categorizes punctuation', () => {
    expect(getCategory(0x002e, '.')).toBe('punctuation');
  });

  it('categorizes an emoji by range', () => {
    expect(getCategory(0x1f600, '\u{1f600}')).toBe('emoji');
  });
});

describe('getUtf8Bytes', () => {
  it('encodes a single ASCII character as one byte', () => {
    expect(getUtf8Bytes('A')).toBe('41');
  });

  it('encodes a multi-byte UTF-8 character correctly', () => {
    // '€' (U+20AC) is 3 bytes in UTF-8: E2 82 AC
    expect(getUtf8Bytes('\u20ac')).toBe('E2 82 AC');
  });
});

describe('INVISIBLE_CHARS', () => {
  it('includes the zero-width space', () => {
    expect(INVISIBLE_CHARS[0x200b]).toBe('ZERO WIDTH SPACE');
  });

  it('includes the byte order mark', () => {
    expect(INVISIBLE_CHARS[0xfeff]).toBe('BYTE ORDER MARK (BOM)');
  });
});
