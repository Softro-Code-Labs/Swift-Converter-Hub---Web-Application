'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import type {
  PageRotation,
  RotateResult,
  RotationDegrees,
} from '../types/pdfRotate';
import { addRotation } from '../types/pdfRotate';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function renderThumbs(
  file: File,
  pageCount: number,
): Promise<{ thumbUrl: string | null; originalRotation: number }[]> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();

    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
    const out: { thumbUrl: string | null; originalRotation: number }[] = [];

    for (let i = 1; i <= Math.min(pageCount, 40); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.35 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({
        canvasContext: canvas.getContext('2d')!,
        viewport,
        canvas,
      }).promise;
      out.push({
        thumbUrl: canvas.toDataURL('image/jpeg', 0.65),
        originalRotation: page.rotate,
      });
    }

    // Beyond 40 pages - no thumbnail
    for (let i = 40; i < pageCount; i++) {
      out.push({ thumbUrl: null, originalRotation: 0 });
    }

    return out;
  } catch {
    return Array.from({ length: pageCount }, () => ({
      thumbUrl: null,
      originalRotation: 0,
    }));
  }
}

export function usePdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageRotation[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [thumbsLoading, setThumbsLoading] = useState(false);
  const [srcBytes, setSrcBytes] = useState<ArrayBuffer | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [result, setResult] = useState<RotateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setThumbsLoading(true);

    try {
      const buf = await f.arrayBuffer();
      setSrcBytes(buf);
      const pdfDoc = await PDFDocument.load(buf.slice(0), {
        ignoreEncryption: true,
      });
      const count = pdfDoc.getPageCount();
      setPageCount(count);

      // Get original rotations from pdf-lib
      const pdfPages = pdfDoc.getPages();
      const origRots = pdfPages.map(
        (p) => (p.getRotation().angle % 360) as RotationDegrees,
      );

      // Placeholder pages
      setPages(
        Array.from({ length: count }, (_, i) => ({
          pageIndex: i,
          currentRotation: origRots[i] ?? 0,
          thumbUrl: null,
          loaded: false,
        })),
      );

      // Render thumbs async
      renderThumbs(f, count).then((thumbData) => {
        setPages((prev) =>
          prev.map((p, i) => ({
            ...p,
            thumbUrl: thumbData[i]?.thumbUrl ?? null,
            loaded: true,
          })),
        );
        setThumbsLoading(false);
      });
    } catch (e) {
      setError((e as Error).message);
      setThumbsLoading(false);
    }
  }, []);

  const rotatePage = useCallback((pageIndex: number, delta: 90 | -90 | 180) => {
    setPages((prev) =>
      prev.map((p) =>
        p.pageIndex === pageIndex
          ? { ...p, currentRotation: addRotation(p.currentRotation, delta) }
          : p,
      ),
    );
    setResult(null);
  }, []);

  const rotateAll = useCallback((delta: 90 | -90 | 180) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        currentRotation: addRotation(p.currentRotation, delta),
      })),
    );
    setResult(null);
  }, []);

  const resetAll = useCallback(() => {
    setPages((prev) => prev.map((p) => ({ ...p, currentRotation: 0 })));
    setResult(null);
  }, []);

  const apply = useCallback(async () => {
    if (!srcBytes || !file) return;
    setIsApplying(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(srcBytes.slice(0), {
        ignoreEncryption: true,
      });
      const pdfPages = pdfDoc.getPages();

      pages.forEach((p, i) => {
        if (pdfPages[i]) {
          pdfPages[i].setRotation(degrees(p.currentRotation));
        }
      });

      const bytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([bytes.buffer as ArrayBuffer], {
        type: 'application/pdf',
      });

      setResult({
        url: URL.createObjectURL(blob),
        pageCount: pdfDoc.getPageCount(),
        sizeLabel: formatBytes(blob.size),
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsApplying(false);
    }
  }, [srcBytes, file, pages, result]);

  const clear = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setPages([]);
    setPageCount(0);
    setSrcBytes(null);
    setResult(null);
    setError(null);
  }, [result]);

  const hasChanges = pages.some((p) => p.currentRotation !== 0);

  return {
    file,
    pages,
    pageCount,
    thumbsLoading,
    isApplying,
    result,
    error,
    hasChanges,
    loadFile,
    rotatePage,
    rotateAll,
    resetAll,
    apply,
    clear,
  };
}
