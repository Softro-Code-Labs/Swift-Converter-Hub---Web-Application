/**
 * Copies a Uint8Array into a guaranteed standalone ArrayBuffer.
 * Fixes the TS5 strict Blob type error where Uint8Array<ArrayBufferLike>
 * is not assignable to BlobPart, and fixes cases where the source buffer
 * is a SharedArrayBuffer or a view into a larger buffer.
 */
export const toBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return buf;
};

/** Reads a File into a clean standalone Uint8Array, ready for ImageMagick.read */
export const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer.slice(0));
};
