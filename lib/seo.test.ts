import { describe, it, expect } from 'vitest';
import { ogImageUrl } from './seo';

const params = (url: string) =>
  Object.fromEntries(new URLSearchParams(url.split('?')[1]));

describe('ogImageUrl', () => {
  it('marks a studio hub', () => {
    expect(params(ogImageUrl('Free Online Video Tools', '/video'))).toEqual({
      title: 'Free Online Video Tools',
      studio: 'video',
      kind: 'hub',
    });
  });

  it("uses the tool's own description on tool pages", () => {
    const p = params(ogImageUrl('Compress Images Online', '/image/compress'));
    expect(p.studio).toBe('image');
    expect(p.kind).toBeUndefined();
    expect(p.sub).toMatch(/\w/);
  });

  it('passes both formats on a format-pair page', () => {
    const p = params(ogImageUrl('MOV to MP4', '/video/convert/mov-to-mp4'));
    expect(p).toMatchObject({ studio: 'video', from: 'mov', to: 'mp4' });
  });

  it('has no studio outside the studios', () => {
    expect(params(ogImageUrl('About', '/about'))).toEqual({ title: 'About' });
  });
});
