// RAW camera formats magick-wasm can't demosaic - falls back to reading
// them as plain TIFF and grabbing the tiny IFD0 thumbnail instead.
export const RAW_EXTENSIONS = new Set([
  'cr2',
  'cr3',
  'nef',
  'arw',
  'dng',
  'orf',
  'rw2',
  'pef',
  'srw',
  'x3f',
  'mrw',
  'dcr',
  'mdc',
  'srf',
  'sr2',
  'raf',
  'crw',
  'mef',
  'iiq',
]);

export const isRawSource = (ext: string): boolean =>
  RAW_EXTENSIONS.has(ext.toLowerCase());

// Real previews live near the start of the file; bounding the scan avoids
// false matches inside the compressed sensor data further in.
const MAX_SCAN_BYTES = 8 * 1024 * 1024;

// Sanity cap on parsed width/height, well above any real camera.
const MAX_PLAUSIBLE_DIMENSION = 12000;

interface JpegCandidate {
  start: number;
  end: number; // exclusive
  width: number;
  height: number;
}

const findEoiFrom = (bytes: Uint8Array, from: number): number => {
  for (let i = from; i < bytes.length - 1; i++) {
    if (bytes[i] === 0xff && bytes[i + 1] === 0xd9) return i;
  }
  return -1;
};

// Walks a JPEG's segments from a candidate SOI to find its dimensions and
// true end. Returns null on anything that isn't a well-formed JPEG.
const parseJpegSegments = (
  bytes: Uint8Array,
  view: DataView,
  start: number,
): JpegCandidate | null => {
  let i = start + 2;
  let width: number | null = null;
  let height: number | null = null;

  while (i < bytes.length - 1) {
    if (bytes[i] !== 0xff) return null;
    const marker = bytes[i + 1];

    if (marker === 0xd9) {
      return width && height ? { start, end: i + 2, width, height } : null;
    }

    // Markers with no payload
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }

    if (i + 4 > bytes.length) return null;
    const segLen = view.getUint16(i + 2, false);
    if (segLen < 2) return null;

    const isSOF =
      (marker >= 0xc0 && marker <= 0xc3) ||
      (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) ||
      (marker >= 0xcd && marker <= 0xcf);

    if (isSOF) {
      if (i + 9 > bytes.length) return null;
      height = view.getUint16(i + 5, false);
      width = view.getUint16(i + 7, false);
      if (
        width <= 0 ||
        height <= 0 ||
        width > MAX_PLAUSIBLE_DIMENSION ||
        height > MAX_PLAUSIBLE_DIMENSION
      ) {
        return null;
      }
    }

    if (marker === 0xda) {
      // Scan data follows and isn't length-prefixed - jump to the real EOI
      const eoi = findEoiFrom(bytes, i + 2 + segLen);
      if (eoi === -1) return null;
      return width && height ? { start, end: eoi + 2, width, height } : null;
    }

    i += 2 + segLen;
  }

  return null;
};

const findJpegCandidates = (bytes: Uint8Array): JpegCandidate[] => {
  const scanEnd = Math.min(bytes.length, MAX_SCAN_BYTES);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const candidates: JpegCandidate[] = [];

  for (let i = 0; i < scanEnd - 3; i++) {
    if (bytes[i] !== 0xff || bytes[i + 1] !== 0xd8 || bytes[i + 2] !== 0xff)
      continue;
    const parsed = parseJpegSegments(bytes, view, i);
    if (parsed) candidates.push(parsed);
  }

  return candidates;
};

/** Largest genuine embedded JPEG preview in a RAW file, or null if none found. */
export const extractLargestEmbeddedPreview = (
  bytes: Uint8Array,
): Uint8Array | null => {
  const candidates = findJpegCandidates(bytes);
  if (candidates.length === 0) return null;

  const best = candidates.reduce((a, b) =>
    a.width * a.height >= b.width * b.height ? a : b,
  );

  return bytes.slice(best.start, best.end);
};

// The extracted preview has no EXIF of its own, so orientation has to be
// read from the RAW file's own TIFF structure instead.

/**
 * Reads the TIFF Orientation tag (0x0112) from a RAW file's IFD0.
 * Returns 1-8, or null if absent / not a TIFF-based RAW format.
 */
export const getTiffOrientation = (bytes: Uint8Array): number | null => {
  if (bytes.length < 8) return null;

  const isLittleEndian = bytes[0] === 0x49 && bytes[1] === 0x49; // 'II'
  const isBigEndian = bytes[0] === 0x4d && bytes[1] === 0x4d; // 'MM'
  if (!isLittleEndian && !isBigEndian) return null;

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const le = isLittleEndian;

  if (view.getUint16(2, le) !== 42) return null;

  const ifd0Offset = view.getUint32(4, le);
  if (ifd0Offset + 2 > bytes.length) return null;

  const numEntries = view.getUint16(ifd0Offset, le);
  if (ifd0Offset + 2 + numEntries * 12 > bytes.length) return null;

  for (let i = 0; i < numEntries; i++) {
    const entryOffset = ifd0Offset + 2 + i * 12;
    const tag = view.getUint16(entryOffset, le);
    if (tag === 0x0112) {
      const value = view.getUint16(entryOffset + 8, le);
      return value >= 1 && value <= 8 ? value : null;
    }
  }

  return null;
};
