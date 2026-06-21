import { useState, useCallback } from 'react';
import {
  EncodeResult,
  DecodeResult,
  formatBytes,
  detectMimeFromBase64,
} from '../types/base64';
import toast from 'react-hot-toast';

export const useBase64Engine = () => {
  const [isEncoding, setIsEncoding] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [encodeResult, setEncodeResult] = useState<EncodeResult | null>(null);
  const [decodeResult, setDecodeResult] = useState<DecodeResult | null>(null);

  const encodeFile = useCallback(async (file: File) => {
    setIsEncoding(true);
    setEncodeResult(null);

    try {
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Raw = dataUri.split(',')[1] ?? '';

      // Get image dimensions if it's a renderable format
      const dimensions = await new Promise<{
        width: number;
        height: number;
      } | null>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = dataUri;
      });

      setEncodeResult({
        base64Raw,
        dataUri,
        mimeType: file.type || 'application/octet-stream',
        fileName: file.name,
        originalSize: formatBytes(file.size),
        encodedSize: formatBytes(base64Raw.length),
        dimensions,
      });

      toast.success('Encoded to Base64!');
    } catch (err) {
      console.error('Encode failed:', err);
      toast.error('Failed to encode file.');
    } finally {
      setIsEncoding(false);
    }
  }, []);

  const decodeBase64 = useCallback(async (input: string) => {
    setIsDecoding(true);
    setDecodeResult(null);

    try {
      let dataUri = input.trim();
      let mimeType: string;

      if (dataUri.startsWith('data:')) {
        mimeType = dataUri.split(';')[0].replace('data:', '') || 'image/png';
      } else {
        // Raw base64 without prefix - detect MIME from magic bytes
        mimeType = detectMimeFromBase64(dataUri);
        dataUri = `data:${mimeType};base64,${dataUri}`;
      }

      // Convert to blob
      const res = await fetch(dataUri);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const dimensions = await new Promise<{
        width: number;
        height: number;
      } | null>((resolve) => {
        const img = new Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve(null);
        img.src = blobUrl;
      });

      setDecodeResult({
        blobUrl,
        mimeType,
        size: formatBytes(blob.size),
        dimensions,
      });

      toast.success('Decoded successfully!');
    } catch (err) {
      console.error('Decode failed:', err);
      toast.error('Invalid Base64 string - could not decode.');
    } finally {
      setIsDecoding(false);
    }
  }, []);

  const clearEncode = useCallback(() => setEncodeResult(null), []);
  const clearDecode = useCallback(() => {
    if (decodeResult?.blobUrl) URL.revokeObjectURL(decodeResult.blobUrl);
    setDecodeResult(null);
  }, [decodeResult]);

  return {
    isEncoding,
    isDecoding,
    encodeResult,
    decodeResult,
    encodeFile,
    decodeBase64,
    clearEncode,
    clearDecode,
  };
};
