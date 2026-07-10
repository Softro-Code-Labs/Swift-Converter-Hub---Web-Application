'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import type { PdfFileItem, MergeResult } from '../types/pdfMerge';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Render first page of a PDF to a canvas thumbnail URL
async function renderThumb(
  file: File,
): Promise<{ pageCount: number; thumbUrl: string | null }> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 0.4 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({
      canvasContext: ctx,
      viewport,
      canvas,
    }).promise;
    const thumbUrl = canvas.toDataURL('image/jpeg', 0.7);

    return { pageCount, thumbUrl };
  } catch {
    // pdf-lib can at least count pages even if rendering fails
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      return { pageCount: pdfDoc.getPageCount(), thumbUrl: null };
    } catch {
      return { pageCount: 0, thumbUrl: null };
    }
  }
}

export function usePdfMerge() {
  const [files, setFiles] = useState<PdfFileItem[]>([]);
  const [isMerging, setMerging] = useState(false);
  const [result, setResult] = useState<MergeResult | null>(null);

  const addFiles = useCallback(async (incoming: File[]) => {
    const pdfFiles = incoming.filter(
      (f) =>
        f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    );
    if (!pdfFiles.length) return;

    // Add immediately with loading state
    const newItems: PdfFileItem[] = pdfFiles.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      sizeLabel: formatBytes(f.size),
      pageCount: null,
      thumbUrl: null,
      error: null,
    }));

    setFiles((prev) => [...prev, ...newItems]);

    // Load thumbnails + page counts async per file
    for (const item of newItems) {
      renderThumb(item.file).then(({ pageCount, thumbUrl }) => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  pageCount,
                  thumbUrl,
                  error: pageCount === 0 ? 'Could not read PDF' : null,
                }
              : f,
          ),
        );
      });
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const merge = useCallback(async () => {
    if (files.length < 2) return;
    setMerging(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);

    try {
      const merged = await PDFDocument.create();

      for (const item of files) {
        const arrayBuffer = await item.file.arrayBuffer();
        const src = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }

      const bytes = await merged.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });

      setResult({
        url: URL.createObjectURL(blob),
        pageCount: merged.getPageCount(),
        sizeLabel: formatBytes(blob.size),
      });
    } catch (e) {
      console.error('PDF merge failed:', e);
    } finally {
      setMerging(false);
    }
  }, [files, result]);

  const clearResult = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
  }, [result]);

  const clearAll = useCallback(() => {
    clearResult();
    setFiles([]);
  }, [clearResult]);

  return {
    files,
    isMerging,
    result,
    addFiles,
    removeFile,
    reorder,
    merge,
    clearResult,
    clearAll,
  };
}
