import type JSZip from 'jszip';

/**
 * Return a file name that is not already used in `zip`.
 * Two inputs called "photo.png" would otherwise both become
 * "photo_converted.jpg" and the second would silently replace the first.
 */
export function uniqueZipName(zip: Pick<JSZip, 'file'>, name: string): string {
  if (!zip.file(name)) return name;
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : '';
  let n = 2;
  while (zip.file(`${base} (${n})${ext}`)) n++;
  return `${base} (${n})${ext}`;
}
