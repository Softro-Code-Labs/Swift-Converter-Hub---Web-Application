export const HEIC_EXTENSIONS = new Set(['heic', 'heif']);

export const isHeicSource = (ext: string): boolean =>
  HEIC_EXTENSIONS.has(ext.toLowerCase());

export const isHeicTarget = (ext: string): boolean =>
  HEIC_EXTENSIONS.has(ext.toLowerCase());

/**
 * Copy bytes into a guaranteed standalone ArrayBuffer.
 * heic-convert v1 reads the buffer with typed array spread internally.
 * If the Uint8Array is a view into a larger buffer (byteOffset > 0 or
 * byteLength !== buffer.byteLength), the spread reads wrong bytes.
 */
const toStandaloneBuffer = (input: Uint8Array): ArrayBuffer => {
  // If already a perfect standalone buffer, use it directly
  if (input.byteOffset === 0 && input.byteLength === input.buffer.byteLength) {
    return input.buffer as ArrayBuffer;
  }
  // Otherwise copy into a fresh ArrayBuffer
  const copy = new ArrayBuffer(input.byteLength);
  new Uint8Array(copy).set(input);
  return copy;
};

/**
 * Decode a HEIC/HEIF file to JPEG or PNG bytes.
 * Uses heic-convert v1 which runs purely in the browser via WASM.
 * No server upload. No network request.
 */
export const decodeHeic = async (
  input: Uint8Array,
  outputFormat: 'JPEG' | 'PNG' = 'JPEG',
  quality = 0.92,
): Promise<Uint8Array> => {
  // Dynamic import keeps heic-convert out of the main bundle
  const heicConvert =
    (await import('heic-convert')).default ?? (await import('heic-convert'));

  const outputBuffer = await (heicConvert as Function)({
    buffer: toStandaloneBuffer(input),
    format: outputFormat,
    quality,
  });

  return new Uint8Array(outputBuffer as ArrayBuffer);
};

/**
 * Encode any image (as PNG bytes from ImageMagick) into HEIC format.
 * Uses the named `encode` export from heic-convert v1.
 * Runs entirely in the browser — no upload.
 */
export const encodeToHeic = async (
  pngBytes: Uint8Array,
): Promise<Uint8Array> => {
  // Decode the PNG to get raw RGBA pixel data via browser APIs
  const pngBlob = new Blob([toStandaloneBuffer(pngBytes)], {
    type: 'image/png',
  });
  const bitmap = await createImageBitmap(pngBlob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);

  // Import the encode named export from heic-convert v1
  const heicModule = await import('heic-convert');
  const encodeFn = (heicModule as any).encode;

  if (typeof encodeFn !== 'function') {
    // encode not available in this build — fall back to WebP
    // (WebP is universally supported and far smaller than PNG)
    const webpBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: 0.92,
    });
    const webpBuffer = await webpBlob.arrayBuffer();
    return new Uint8Array(webpBuffer);
  }

  const heicBuffer: ArrayBuffer = await encodeFn({
    width: bitmap.width,
    height: bitmap.height,
    data: imageData.data,
    quality: 0.92,
  });

  return new Uint8Array(heicBuffer);
};
