/* ---------------------------------------------------------------------------
   Getting an image ready for Tesseract.

   Tesseract reads best when letters are roughly 20-40 px tall. Screenshots
   and small crops are often well below that, so they're scaled up (at most
   2x); very large photos are scaled down to keep memory in check.
--------------------------------------------------------------------------- */

import { decodeHeic } from '@/features/image/convert/hooks/useHeicConverter';

/** Images whose longer side is below this are enlarged. */
const UPSCALE_BELOW = 1600;
const MAX_UPSCALE = 2;
/** Above this many pixels, images are reduced. */
const MAX_PIXELS = 16_000_000;

export function ocrScale(width: number, height: number): number {
  const pixels = width * height;
  if (pixels > MAX_PIXELS) return Math.sqrt(MAX_PIXELS / pixels);
  const longest = Math.max(width, height);
  if (longest < UPSCALE_BELOW) {
    return Math.min(MAX_UPSCALE, UPSCALE_BELOW / longest);
  }
  return 1;
}

export const isHeic = (f: File) =>
  /\.(heic|heif)$/i.test(f.name) || /image\/hei[cf]/i.test(f.type);

/** A browser-displayable version of the file (HEIC is converted to JPG). */
export async function displayable(file: File): Promise<Blob> {
  if (!isHeic(file)) return file;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const jpeg = await decodeHeic(bytes, 'JPEG', 0.92);
  return new Blob([jpeg.slice().buffer], { type: 'image/jpeg' });
}

export interface PreparedImage {
  /** Lossless PNG for Tesseract, upright and at the reading scale. */
  blob: Blob;
  width: number;
  height: number;
}

/** Decode (EXIF orientation applied, so phone photos come out upright) and
 *  scale for reading. */
export async function prepareImage(source: Blob): Promise<PreparedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('This image couldn’t be opened.');
  }
  try {
    const scale = ocrScale(bitmap.width, bitmap.height);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    // Transparent PNGs (logos, screenshots of dark text) would otherwise
    // read as black on black.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return { blob, width, height };
  } finally {
    bitmap.close();
  }
}
