export const HEIC_EXTENSIONS = new Set(['heic', 'heif']);

export const isHeicSource = (ext: string): boolean =>
  HEIC_EXTENSIONS.has(ext.toLowerCase());

export const isHeicTarget = (ext: string): boolean =>
  HEIC_EXTENSIONS.has(ext.toLowerCase());

export const toStandaloneBuffer = (input: Uint8Array): ArrayBuffer => {
  const copy = new ArrayBuffer(input.byteLength);
  new Uint8Array(copy).set(input);
  return copy;
};

// Detect actual format from magic bytes
export const detectActualFormat = (bytes: Uint8Array): string => {
  if (bytes.byteLength < 12) return 'other';

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return 'jpeg';

  // PNG: 89 50 4E 47
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return 'png';

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  )
    return 'webp';

  // ISOBMFF - read ftyp brand at byte 8
  const brand = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
    .toLowerCase()
    .trim();

  const heicBrands = [
    'heic',
    'heis',
    'heim',
    'heix',
    'hevc',
    'hevx',
    'mif1',
    'msf1',
  ];
  if (heicBrands.includes(brand)) return 'heic';
  if (['avif', 'avis'].includes(brand)) return 'avif';

  return 'other';
};

// Decode a genuine HEIC/HEIF file → JPEG or PNG
export const decodeHeic = async (
  input: Uint8Array,
  outputFormat: 'JPEG' | 'PNG' = 'JPEG',
  quality = 0.92,
): Promise<Uint8Array> => {
  const { default: heic2any } = await import('heic2any');

  const toMime = outputFormat === 'PNG' ? 'image/png' : 'image/jpeg';

  // Try both HEIC and HEIF MIME types
  const mimes: string[] = ['image/heic', 'image/heif'];
  let lastErr: unknown;

  for (const mime of mimes) {
    try {
      const inputBlob = new Blob([toStandaloneBuffer(input)], { type: mime });
      const result = await heic2any({
        blob: inputBlob,
        toType: toMime,
        quality: outputFormat === 'PNG' ? 1 : quality,
      });
      const outBlob = Array.isArray(result) ? result[0] : result;
      const arrayBuffer = await outBlob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (err) {
      lastErr = err;
    }
  }

  throw new Error(
    `Could not decode HEIC file: ${(lastErr as any)?.message ?? String(lastErr)}. ` +
      `This file may be corrupted or use an unsupported HEIC variant.`,
  );
};
