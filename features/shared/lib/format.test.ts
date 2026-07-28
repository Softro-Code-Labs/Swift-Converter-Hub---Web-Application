import { describe, it, expect } from 'vitest';
import {
  getFileExtension,
  formatBytes,
  formatDuration,
  toStandaloneBuffer,
} from './format';

describe('getFileExtension', () => {
  it('lowercases and strips a normal extension', () => {
    expect(getFileExtension('Track.WAV')).toBe('wav');
  });

  it('returns empty string for a name with no extension', () => {
    expect(getFileExtension('README')).toBe('');
  });

  it('returns empty string for a dotfile with no extension', () => {
    expect(getFileExtension('.gitignore')).toBe('');
  });

  it('returns empty string when the dot is the last character', () => {
    expect(getFileExtension('archive.')).toBe('');
  });

  it('uses the last dot for multi-dot filenames', () => {
    expect(getFileExtension('my.file.name.tar.gz')).toBe('gz');
  });
});

describe('formatBytes', () => {
  it('formats zero bytes', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('formats bytes under 1 KB', () => {
    expect(formatBytes(512)).toBe('512 Bytes');
  });

  it('formats exactly 1 KB', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes with up to 2 decimal places', () => {
    expect(formatBytes(1024 * 1024 * 2.5)).toBe('2.5 MB');
  });

  it('formats gigabytes', () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
  });
});

describe('formatDuration', () => {
  it('formats sub-minute durations as m:ss', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('pads seconds under 10', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('switches to h:mm:ss past an hour', () => {
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('returns 0:00 for negative input', () => {
    expect(formatDuration(-5)).toBe('0:00');
  });

  it('returns 0:00 for non-finite input', () => {
    expect(formatDuration(Infinity)).toBe('0:00');
    expect(formatDuration(NaN)).toBe('0:00');
  });
});

describe('toStandaloneBuffer', () => {
  it('copies bytes into an independent ArrayBuffer', () => {
    const original = new Uint8Array([1, 2, 3, 4]);
    const buffer = toStandaloneBuffer(original);

    expect(new Uint8Array(buffer)).toEqual(original);
    expect(buffer).not.toBe(original.buffer);
  });

  it('is unaffected by later mutation of the source array', () => {
    const original = new Uint8Array([10, 20, 30]);
    const buffer = toStandaloneBuffer(original);
    original[0] = 99;

    expect(new Uint8Array(buffer)[0]).toBe(10);
  });
});
