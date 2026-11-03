import { describe, expect, it } from 'vitest';
import { isHeic, ocrScale } from './image';

describe('ocrScale', () => {
  it('enlarges small screenshots, at most 2x', () => {
    expect(ocrScale(1000, 600)).toBeCloseTo(1.6);
    expect(ocrScale(400, 300)).toBe(2);
  });

  it('leaves normal photos and scans alone', () => {
    expect(ocrScale(1600, 1200)).toBe(1);
    expect(ocrScale(2480, 3508)).toBe(1); // A4 at 300 dpi
  });

  it('reduces very large photos to 16 megapixels', () => {
    const s = ocrScale(8000, 6000);
    expect(8000 * s * 6000 * s).toBeCloseTo(16_000_000, -3);
  });
});

describe('isHeic', () => {
  it('recognises HEIC by name or type', () => {
    expect(isHeic(new File([], 'IMG_0001.HEIC'))).toBe(true);
    expect(isHeic(new File([], 'photo', { type: 'image/heif' }))).toBe(true);
    expect(isHeic(new File([], 'scan.jpg', { type: 'image/jpeg' }))).toBe(
      false,
    );
  });
});
