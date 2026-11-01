import { describe, expect, it } from 'vitest';
import { layoutPage } from './layout';
import { DEFAULT_OPTIONS } from '../types/imageToPdf';

describe('layoutPage', () => {
  it('sizes the page to the image in fit mode, with margins', () => {
    const l = layoutPage(960, 480, {
      ...DEFAULT_OPTIONS,
      pageSize: 'fit',
      margin: 'small',
    });
    expect(l.width).toBeCloseTo(720);
    expect(l.height).toBeCloseTo(360);
    expect(l.pageWidth).toBeCloseTo(756);
    expect(l.pageHeight).toBeCloseTo(396);
    expect(l.x).toBe(18);
  });

  it('turns A4 landscape automatically for wide images', () => {
    const l = layoutPage(4000, 3000, {
      ...DEFAULT_OPTIONS,
      pageSize: 'a4',
      orientation: 'auto',
    });
    expect(l.pageWidth).toBeGreaterThan(l.pageHeight);
  });

  it('respects a forced portrait orientation', () => {
    const l = layoutPage(4000, 3000, {
      ...DEFAULT_OPTIONS,
      pageSize: 'a4',
      orientation: 'portrait',
    });
    expect(l.pageWidth).toBeLessThan(l.pageHeight);
  });

  it('scales large images down to fit inside the margins and centres them', () => {
    const l = layoutPage(4000, 3000, {
      ...DEFAULT_OPTIONS,
      pageSize: 'letter',
      margin: 'large',
      orientation: 'landscape',
    });
    expect(l.width).toBeLessThanOrEqual(792 - 72 + 0.01);
    expect(l.height).toBeLessThanOrEqual(612 - 72 + 0.01);
    expect(l.x).toBeCloseTo((792 - l.width) / 2);
    expect(l.y).toBeCloseTo((612 - l.height) / 2);
  });

  it('does not enlarge small images', () => {
    const l = layoutPage(200, 100, { ...DEFAULT_OPTIONS, pageSize: 'a4' });
    expect(l.width).toBeCloseTo(150);
    expect(l.height).toBeCloseTo(75);
  });
});
