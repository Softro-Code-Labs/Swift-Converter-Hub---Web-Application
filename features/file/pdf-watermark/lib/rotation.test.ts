import { describe, expect, it } from 'vitest';
import { originForCenter } from './rotation';

/** Rotate the box's centre offset back to find where its centre ends up. */
function centreOf(
  o: { x: number; y: number },
  w: number,
  h: number,
  deg: number,
) {
  const t = (deg * Math.PI) / 180;
  return {
    x: o.x + (w / 2) * Math.cos(t) - (h / 2) * Math.sin(t),
    y: o.y + (w / 2) * Math.sin(t) + (h / 2) * Math.cos(t),
  };
}

describe('originForCenter', () => {
  it('is a plain offset when not rotated', () => {
    expect(originForCenter(100, 50, 40, 10, 0)).toEqual({ x: 80, y: 45 });
  });
  it.each([0, 30, 45, 90, -45, 180, 315])(
    'keeps the centre fixed at %i°',
    (deg) => {
      const o = originForCenter(300, 420, 260, 48, deg);
      const c = centreOf(o, 260, 48, deg);
      expect(c.x).toBeCloseTo(300);
      expect(c.y).toBeCloseTo(420);
    },
  );
});
