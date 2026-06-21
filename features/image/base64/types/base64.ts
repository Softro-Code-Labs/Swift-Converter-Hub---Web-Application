export type Base64Mode = 'encode' | 'decode';

export type Base64OutputStyle = 'raw' | 'dataUri' | 'cssBackground' | 'htmlImg';

export interface EncodeResult {
  base64Raw: string;
  dataUri: string;
  mimeType: string;
  fileName: string;
  originalSize: string;
  encodedSize: string;
  dimensions: { width: number; height: number } | null;
}

export interface DecodeResult {
  blobUrl: string;
  mimeType: string;
  size: string;
  dimensions: { width: number; height: number } | null;
}

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Detect MIME type from a base64 string's magic bytes (when no data: prefix present)
export const detectMimeFromBase64 = (base64: string): string => {
  const cleaned = base64.replace(/^data:.*?;base64,/, '').trim();
  const binaryStart = atob(cleaned.slice(0, 16));
  const bytes = Array.from(binaryStart, (c) => c.charCodeAt(0));

  if (bytes[0] === 0xff && bytes[1] === 0xd8) return 'image/jpeg';
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  )
    return 'image/png';
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46)
    return 'image/gif';
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46
  )
    return 'image/webp';
  if (bytes[0] === 0x42 && bytes[1] === 0x4d) return 'image/bmp';
  if (
    (bytes[0] === 0x49 && bytes[1] === 0x49) ||
    (bytes[0] === 0x4d && bytes[1] === 0x4d)
  )
    return 'image/tiff';

  return 'image/png'; // fallback
};

export const isValidBase64 = (str: string): boolean => {
  const cleaned = str.replace(/^data:.*?;base64,/, '').trim();
  if (!cleaned) return false;
  // Basic base64 charset check
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  if (!base64Regex.test(cleaned.replace(/\s/g, ''))) return false;
  try {
    atob(cleaned.slice(0, 100)); // test decode a chunk
    return true;
  } catch {
    return false;
  }
};
