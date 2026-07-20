'use client';

import { useState, useCallback } from 'react';
import {
  PDFDocument,
  PDFRawStream,
  PDFName,
  PDFNumber,
  PDFDict,
  PDFRef,
} from 'pdf-lib';
import type {
  CompressionLevel,
  CompressResult,
  CompressProgress,
} from '../types/pdfCompress';
import { PRESETS } from '../types/pdfCompress';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// --- Image recompression -----------------------------------------------------
//
// Metadata/annotation/bookmark stripping (kept below) only ever saves a few
// KB - the actual size of most real-world PDFs comes from embedded raster
// images (scans, photos, screenshots). This walks every indirect object in
// the document, finds image XObjects that are already JPEG-encoded
// (Filter = DCTDecode - by far the most common case for photos/scans), and
// replaces each one in place with a smaller re-encode: downsampled to the
// preset's max dimension and re-compressed at the preset's JPEG quality.
//
// Deliberately left untouched:
//  - Images with an SMask (alpha channel) - JPEG has no alpha channel, so
//    recompressing would silently destroy transparency. Safety over savings.
//  - Non-JPEG filters (FlateDecode raw bitmaps, CCITTFaxDecode fax scans,
//    JPXDecode/JBIG2Decode) - decoding these correctly needs filter-specific
//    logic beyond what a browser's native image decoder handles for free.
//    Left as-is rather than risking a corrupted image.
//  - Chained/multiple filters - rare for images, skipped for safety.
//  - Any image that errors out while decoding/re-encoding, or where the
//    "recompressed" result would end up *larger* than the original.

interface ImageWorkItem {
  ref: PDFRef;
  stream: PDFRawStream;
}

function findRecompressibleImages(pdfDoc: PDFDocument): ImageWorkItem[] {
  const items: ImageWorkItem[] = [];

  for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
    if (!(obj instanceof PDFRawStream)) continue;

    const dict = obj.dict;
    const subtype = dict.get(PDFName.of('Subtype'));
    if (!(subtype instanceof PDFName) || subtype !== PDFName.of('Image')) {
      continue;
    }

    const filter = dict.get(PDFName.of('Filter'));
    if (!(filter instanceof PDFName) || filter !== PDFName.of('DCTDecode')) {
      continue; // not already JPEG, or uses a filter chain - skip
    }

    if (dict.get(PDFName.of('SMask')) || dict.get(PDFName.of('Mask'))) {
      continue; // has transparency - skip to avoid breaking it
    }

    items.push({ ref, stream: obj });
  }

  return items;
}

async function recompressJpegBytes(
  originalBytes: Uint8Array,
  maxDimension: number,
  quality: number,
): Promise<{ bytes: Uint8Array; width: number; height: number } | null> {
  try {
    const blob = new Blob([originalBytes.slice().buffer as ArrayBuffer], {
      type: 'image/jpeg',
    });
    const bitmap = await createImageBitmap(blob);

    if (!bitmap.width || !bitmap.height) {
      bitmap.close();
      return null;
    }

    const scale = Math.min(
      1,
      maxDimension / Math.max(bitmap.width, bitmap.height),
    );
    const newWidth = Math.max(1, Math.round(bitmap.width * scale));
    const newHeight = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return null;
    }
    ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
    bitmap.close();

    const newBlob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (!newBlob) return null;

    const newBytes = new Uint8Array(await newBlob.arrayBuffer());
    return { bytes: newBytes, width: newWidth, height: newHeight };
  } catch {
    return null;
  }
}

async function recompressImages(
  pdfDoc: PDFDocument,
  maxDimension: number,
  quality: number,
  onProgress?: (current: number, total: number) => void,
): Promise<{ found: number; recompressed: number }> {
  const items = findRecompressibleImages(pdfDoc);
  let recompressed = 0;

  for (let i = 0; i < items.length; i++) {
    onProgress?.(i + 1, items.length);
    const { ref, stream } = items[i];

    try {
      const result = await recompressJpegBytes(
        stream.contents,
        maxDimension,
        quality,
      );
      if (!result) continue;
      if (result.bytes.length >= stream.contents.length) continue; // never make it bigger

      const newDict = stream.dict.clone(pdfDoc.context) as PDFDict;
      newDict.set(PDFName.of('Width'), PDFNumber.of(result.width));
      newDict.set(PDFName.of('Height'), PDFNumber.of(result.height));
      newDict.set(PDFName.of('BitsPerComponent'), PDFNumber.of(8));
      newDict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
      newDict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
      newDict.set(PDFName.of('Length'), PDFNumber.of(result.bytes.length));
      newDict.delete(PDFName.of('DecodeParms'));
      newDict.delete(PDFName.of('Decode'));
      newDict.delete(PDFName.of('Intent'));

      const newStream = PDFRawStream.of(newDict, result.bytes);
      pdfDoc.context.assign(ref, newStream);
      recompressed++;
    } catch {
      // Skip this image, keep going - one bad image shouldn't sink the job.
      continue;
    }
  }

  return { found: items.length, recompressed };
}

export function usePdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('balanced');
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressProgress | null>(null);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setProgress(null);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setIsCompressing(true);
    setError(null);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setProgress({ stage: 'loading', current: 0, total: 0 });

    try {
      const preset = PRESETS.find((p) => p.id === level)!;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      // The expensive part - recompress embedded JPEG images.
      setProgress({ stage: 'images', current: 0, total: 0 });
      const { found, recompressed } = await recompressImages(
        pdfDoc,
        preset.maxImageDimension,
        preset.imageQuality,
        (current, total) => setProgress({ stage: 'images', current, total }),
      );

      // Cheap structural wins - metadata/annotations/bookmarks/attachments.
      if (preset.removeMetadata) {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('');
        pdfDoc.setCreator('');
      }

      if (preset.removeAnnotations) {
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          try {
            const annots = page.node.get(page.node.context.obj('Annots'));
            if (annots) page.node.delete(page.node.context.obj('Annots'));
          } catch {
            /* skip pages without annots */
          }
        });
      }

      if (preset.removeBookmarks) {
        try {
          const catalog = pdfDoc.catalog;
          catalog.delete(catalog.context.obj('Outlines'));
        } catch {
          /* no bookmarks */
        }
      }

      if (preset.removeAttachments) {
        try {
          const catalog = pdfDoc.catalog;
          catalog.delete(catalog.context.obj('Names'));
          catalog.delete(catalog.context.obj('EmbeddedFiles'));
        } catch {
          /* no attachments */
        }
      }

      setProgress({ stage: 'saving', current: 0, total: 0 });
      const bytes = await pdfDoc.save({
        useObjectStreams: preset.useObjectStreams,
        addDefaultPage: false,
        objectsPerTick: 50,
      });

      const originalSize = file.size;
      const compressedSize = bytes.byteLength;
      const savedBytes = originalSize - compressedSize;
      const savedPct = Math.max(
        0,
        Math.round((savedBytes / originalSize) * 100),
      );

      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });

      setProgress({ stage: 'done', current: 0, total: 0 });
      setResult({
        url: URL.createObjectURL(blob),
        originalSize,
        compressedSize,
        savedBytes,
        savedPct,
        sizeLabel: formatBytes(compressedSize),
        originalLabel: formatBytes(originalSize),
        imagesFound: found,
        imagesRecompressed: recompressed,
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsCompressing(false);
      setProgress(null);
    }
  }, [file, level, result]);

  const clear = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [result]);

  return {
    file,
    level,
    setLevel,
    isCompressing,
    progress,
    result,
    error,
    loadFile,
    compress,
    clear,
  };
}
