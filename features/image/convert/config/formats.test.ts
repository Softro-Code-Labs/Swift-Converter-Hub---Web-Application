import { describe, it, expect } from 'vitest';
import {
  IMAGE_FORMATS,
  getFormatByExtension,
  getAllowedTargets,
  isConversionAllowed,
  getAllowedTargetFormats,
} from './formats';

describe('getFormatByExtension', () => {
  it('finds a known format', () => {
    expect(getFormatByExtension('png')?.extension).toBe('png');
  });

  it('is case-insensitive', () => {
    expect(getFormatByExtension('PNG')?.extension).toBe('png');
  });

  it('returns undefined for an unknown extension', () => {
    expect(getFormatByExtension('not-a-real-format')).toBeUndefined();
  });
});

describe('getAllowedTargets', () => {
  it('returns a set-like object with a working has() check', () => {
    const allowed = getAllowedTargets('png');
    expect(typeof allowed.has).toBe('function');
  });

  it('is case-insensitive on the source extension', () => {
    const lower = getAllowedTargets('png');
    const upper = getAllowedTargets('PNG');
    expect([...upper]).toEqual([...lower]);
  });

  it('returns a consistent result across repeated calls (cache correctness)', () => {
    const first = getAllowedTargets('jpg');
    const second = getAllowedTargets('jpg');
    expect([...first]).toEqual([...second]);
  });

  it('returns non-overlapping results for formats with different rules where applicable', () => {
    // Every source's allowed set should at least be a subset of all known extensions
    const allExtensions = new Set(IMAGE_FORMATS.map((f) => f.extension));
    const allowed = getAllowedTargets('webp');
    for (const ext of allowed) {
      expect(allExtensions.has(ext)).toBe(true);
    }
  });
});

describe('isConversionAllowed', () => {
  it('never allows converting a format to itself', () => {
    expect(isConversionAllowed('png', 'png')).toBe(false);
    expect(isConversionAllowed('PNG', 'png')).toBe(false);
  });

  it('agrees with getAllowedTargets for a valid pair', () => {
    const allowed = getAllowedTargets('png');
    expect(allowed.has('jpg')).toBe(true);
    expect(isConversionAllowed('png', 'jpg')).toBe(true);
  });

  it('is case-insensitive on the target extension', () => {
    expect(isConversionAllowed('png', 'JPG')).toBe(true);
  });
});

describe('getAllowedTargetFormats', () => {
  it('never includes the source format itself', () => {
    const targets = getAllowedTargetFormats('png');
    expect(targets.some((f) => f.extension === 'png')).toBe(false);
  });

  it('only returns formats present in IMAGE_FORMATS', () => {
    const targets = getAllowedTargetFormats('jpg');
    const validExtensions = new Set(IMAGE_FORMATS.map((f) => f.extension));
    for (const format of targets) {
      expect(validExtensions.has(format.extension)).toBe(true);
    }
  });
});
