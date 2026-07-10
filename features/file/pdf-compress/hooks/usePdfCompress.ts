'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import type { CompressionLevel, CompressResult } from '../types/pdfCompress';
import { PRESETS } from '../types/pdfCompress';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function usePdfCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('balanced');
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<CompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const compress = useCallback(async () => {
    if (!file) return;
    setIsCompressing(true);
    setError(null);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const preset = PRESETS.find((p) => p.id === level)!;
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      // Apply preset options
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

      setResult({
        url: URL.createObjectURL(blob),
        originalSize,
        compressedSize,
        savedBytes,
        savedPct,
        sizeLabel: formatBytes(compressedSize),
        originalLabel: formatBytes(originalSize),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsCompressing(false);
    }
  }, [file, level, result]);

  const clear = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError(null);
  }, [result]);

  return {
    file,
    level,
    setLevel,
    isCompressing,
    result,
    error,
    loadFile,
    compress,
    clear,
  };
}
