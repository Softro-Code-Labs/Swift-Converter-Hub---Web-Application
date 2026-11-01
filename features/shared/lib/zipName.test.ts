import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { uniqueZipName } from './zipName';

describe('uniqueZipName', () => {
  it('keeps a name that is free', () => {
    expect(uniqueZipName(new JSZip(), 'a.jpg')).toBe('a.jpg');
  });
  it('numbers duplicates instead of overwriting', () => {
    const zip = new JSZip();
    zip.file(uniqueZipName(zip, 'photo_converted.jpg'), 'x');
    zip.file(uniqueZipName(zip, 'photo_converted.jpg'), 'y');
    zip.file(uniqueZipName(zip, 'photo_converted.jpg'), 'z');
    expect(Object.keys(zip.files).sort()).toEqual([
      'photo_converted (2).jpg',
      'photo_converted (3).jpg',
      'photo_converted.jpg',
    ]);
  });
  it('handles names without an extension', () => {
    const zip = new JSZip();
    zip.file('README', 'x');
    expect(uniqueZipName(zip, 'README')).toBe('README (2)');
  });
});
