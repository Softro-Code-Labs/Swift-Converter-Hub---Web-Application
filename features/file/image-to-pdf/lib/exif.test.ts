import { describe, expect, it } from 'vitest';
import { readJpegOrientation } from './exif';

function jpegWithOrientation(o: number, little = true): Uint8Array {
  const tiff = little
    ? [
        0x49,
        0x49,
        0x2a,
        0x00,
        0x08,
        0,
        0,
        0,
        1,
        0,
        0x12,
        0x01,
        3,
        0,
        1,
        0,
        0,
        0,
        o,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ]
    : [
        0x4d,
        0x4d,
        0x00,
        0x2a,
        0,
        0,
        0,
        0x08,
        0,
        1,
        0x01,
        0x12,
        0,
        3,
        0,
        0,
        0,
        1,
        0,
        o,
        0,
        0,
        0,
        0,
        0,
        0,
      ];
  const exif = [0x45, 0x78, 0x69, 0x66, 0, 0, ...tiff];
  const len = exif.length + 2;
  return new Uint8Array([
    0xff,
    0xd8,
    0xff,
    0xe1,
    len >> 8,
    len & 0xff,
    ...exif,
    0xff,
    0xd9,
  ]);
}

describe('readJpegOrientation', () => {
  it('reads little-endian orientation', () =>
    expect(readJpegOrientation(jpegWithOrientation(6))).toBe(6));
  it('reads big-endian orientation', () =>
    expect(readJpegOrientation(jpegWithOrientation(8, false))).toBe(8));
  it('returns 1 for non-JPEG data', () =>
    expect(readJpegOrientation(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe(
      1,
    ));
  it('returns 1 when there is no EXIF block', () =>
    expect(
      readJpegOrientation(
        new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0, 4, 0, 0, 0xff, 0xd9]),
      ),
    ).toBe(1));
});
