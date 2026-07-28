import { describe, it, expect } from 'vitest';
import {
  isHeicSource,
  isHeicTarget,
  detectActualFormat,
  toStandaloneBuffer,
} from './useHeicConverter';

describe('isHeicSource / isHeicTarget', () => {
  it('recognizes heic and heif, case-insensitively', () => {
    expect(isHeicSource('heic')).toBe(true);
    expect(isHeicSource('HEIC')).toBe(true);
    expect(isHeicSource('heif')).toBe(true);
    expect(isHeicTarget('HEIF')).toBe(true);
  });

  it('rejects unrelated extensions', () => {
    expect(isHeicSource('png')).toBe(false);
    expect(isHeicTarget('jpg')).toBe(false);
  });
});

describe('toStandaloneBuffer', () => {
  it('creates an independent copy of the bytes', () => {
    const input = new Uint8Array([1, 2, 3]);
    const buffer = toStandaloneBuffer(input);
    expect(new Uint8Array(buffer)).toEqual(input);
    input[0] = 99;
    expect(new Uint8Array(buffer)[0]).toBe(1);
  });
});

describe('detectActualFormat', () => {
  function bytesFrom(values: number[], totalLength = 16): Uint8Array {
    const arr = new Uint8Array(totalLength);
    arr.set(values.slice(0, totalLength));
    return arr;
  }

  it('detects JPEG from its magic bytes', () => {
    const bytes = bytesFrom([0xff, 0xd8, 0xff, 0xe0]);
    expect(detectActualFormat(bytes)).toBe('jpeg');
  });

  it('detects PNG from its magic bytes', () => {
    const bytes = bytesFrom([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(detectActualFormat(bytes)).toBe('png');
  });

  it('detects WebP from the RIFF/WEBP container', () => {
    // RIFF....WEBP
    const bytes = bytesFrom([
      0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
    ]);
    expect(detectActualFormat(bytes)).toBe('webp');
  });

  it('detects HEIC from an ISOBMFF ftyp brand', () => {
    // box size (4 bytes, arbitrary), 'ftyp', brand 'heic'
    const bytes = new Uint8Array(16);
    bytes.set([0, 0, 0, 0x18], 0);
    bytes.set([0x66, 0x74, 0x79, 0x70], 4); // 'ftyp'
    bytes.set([0x68, 0x65, 0x69, 0x63], 8); // 'heic'
    expect(detectActualFormat(bytes)).toBe('heic');
  });

  it('detects AVIF from an ISOBMFF ftyp brand', () => {
    const bytes = new Uint8Array(16);
    bytes.set([0, 0, 0, 0x18], 0);
    bytes.set([0x66, 0x74, 0x79, 0x70], 4);
    bytes.set([0x61, 0x76, 0x69, 0x66], 8); // 'avif'
    expect(detectActualFormat(bytes)).toBe('avif');
  });

  it('returns "other" for unrecognized bytes', () => {
    expect(detectActualFormat(bytesFrom([0, 1, 2, 3]))).toBe('other');
  });

  it('returns "other" for input shorter than 12 bytes', () => {
    expect(detectActualFormat(new Uint8Array([0xff, 0xd8, 0xff]))).toBe(
      'other',
    );
  });
});
