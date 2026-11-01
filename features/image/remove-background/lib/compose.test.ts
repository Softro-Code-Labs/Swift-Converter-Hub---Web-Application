import { describe, it, expect } from 'vitest';
import { fitWithin, refineMask, subjectBounds } from './compose';

describe('fitWithin', () => {
  it('leaves normal photos alone', () => {
    expect(fitWithin(4000, 3000)).toEqual({
      width: 4000,
      height: 3000,
      scaled: false,
    });
  });
  it('scales huge photos under the canvas limit, keeping the shape', () => {
    const r = fitWithin(8000, 6000);
    expect(r.scaled).toBe(true);
    expect(r.width * r.height).toBeLessThanOrEqual(16_000_000);
    expect(r.width / r.height).toBeCloseTo(4 / 3, 2);
  });
});

describe('refineMask', () => {
  const m = new Uint8Array([0, 64, 128, 192, 255]);
  it('keeps the mask as-is at 0', () => {
    expect(Array.from(refineMask(m, 0))).toEqual([0, 64, 128, 192, 255]);
  });
  it('pushes values apart when crisp, keeping the ends', () => {
    const r = Array.from(refineMask(m, 100));
    expect(r[0]).toBe(0);
    expect(r[4]).toBe(255);
    expect(r[1]).toBe(0);
    expect(r[3]).toBe(255);
  });
});

describe('subjectBounds', () => {
  it('finds the box around the subject', () => {
    const size = 10;
    const mask = new Uint8Array(size * size);
    for (let y = 2; y <= 5; y++)
      for (let x = 3; x <= 8; x++) mask[y * size + x] = 255;
    expect(subjectBounds(mask, size)).toEqual({
      x: 0.3,
      y: 0.2,
      w: 0.6,
      h: 0.4,
    });
  });
  it('returns null for an empty mask', () => {
    expect(subjectBounds(new Uint8Array(16), 4)).toBeNull();
  });
});
