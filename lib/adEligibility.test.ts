import { describe, expect, it } from 'vitest';
import { isAdEligiblePath } from './adEligibility';

describe('isAdEligiblePath', () => {
  it('allows ads on curated format-pair pages', () => {
    expect(isAdEligiblePath('/image/convert/jpg-to-png')).toBe(true);
    expect(isAdEligiblePath('/image/convert/heic-to-jpg')).toBe(true);
    expect(isAdEligiblePath('/audio/convert/mp3-to-wav')).toBe(true);
    expect(isAdEligiblePath('/video/convert/mov-to-mp4')).toBe(true);
  });

  it('blocks ads on templated (noindex) format-pair pages', () => {
    expect(isAdEligiblePath('/image/convert/xcf-to-pcx')).toBe(false);
    expect(isAdEligiblePath('/image/convert/dpx-to-sgi')).toBe(false);
    expect(isAdEligiblePath('/audio/convert/ac3-to-au')).toBe(false);
    expect(isAdEligiblePath('/video/convert/flv-to-ogv')).toBe(false);
  });

  it('ignores case and a trailing slash', () => {
    expect(isAdEligiblePath('/Image/Convert/JPG-to-PNG/')).toBe(true);
    expect(isAdEligiblePath('/image/convert/xcf-to-pcx/')).toBe(false);
  });

  it('allows ads on ordinary tool, hub and converter pages', () => {
    expect(isAdEligiblePath('/image')).toBe(true);
    expect(isAdEligiblePath('/image/convert')).toBe(true);
    expect(isAdEligiblePath('/image/compress')).toBe(true);
    expect(isAdEligiblePath('/character/word-counter')).toBe(true);
    expect(isAdEligiblePath('/file/pdf-merge')).toBe(true);
  });

  it('shows no ads before the path is known', () => {
    expect(isAdEligiblePath(null)).toBe(false);
    expect(isAdEligiblePath('')).toBe(false);
  });
});
