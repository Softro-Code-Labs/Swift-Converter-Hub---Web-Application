'use client';

import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import type {
  PageThumb,
  SplitResult,
  SplitMode,
  RangeGroup,
} from '../types/pdfSplit';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Parse range string like "1-3, 5, 7-9" into 0-based indices
export function parseRangeString(raw: string, maxPage: number): number[] {
  const indices: number[] = [];
  const parts = raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [a, b] = part.split('-').map((n) => parseInt(n.trim()));
      if (!isNaN(a) && !isNaN(b)) {
        const from = Math.max(1, Math.min(a, maxPage));
        const to = Math.max(1, Math.min(b, maxPage));
        for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
          if (!indices.includes(i - 1)) indices.push(i - 1);
        }
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= 1 && n <= maxPage && !indices.includes(n - 1)) {
        indices.push(n - 1);
      }
    }
  }
  return indices.sort((a, b) => a - b);
}

// Validate range string
export function validateRangeString(
  raw: string,
  maxPage: number,
): string | null {
  if (!raw.trim()) return null;
  const pages = parseRangeString(raw, maxPage);
  if (pages.length === 0) return 'No valid pages found in range';
  return null;
}

async function renderThumbs(
  file: File,
  pageCount: number,
): Promise<PageThumb[]> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) })
      .promise;
    const thumbs: PageThumb[] = [];

    for (let i = 1; i <= Math.min(pageCount, 50); i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 0.3 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      thumbs.push({
        pageIndex: i - 1,
        thumbUrl: canvas.toDataURL('image/jpeg', 0.6),
        loaded: true,
      });
    }

    // Pages beyond 50 — no thumbnail
    for (let i = 50; i < pageCount; i++) {
      thumbs.push({ pageIndex: i, thumbUrl: null, loaded: true });
    }

    return thumbs;
  } catch {
    return Array.from({ length: pageCount }, (_, i) => ({
      pageIndex: i,
      thumbUrl: null,
      loaded: true,
    }));
  }
}

async function extractPages(
  srcBytes: ArrayBuffer,
  pageIndices: number[],
  fileName: string,
): Promise<{
  name: string;
  url: string;
  pageCount: number;
  sizeLabel: string;
}> {
  const src = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
  const dest = await PDFDocument.create();
  const copied = await dest.copyPages(src, pageIndices);
  copied.forEach((p) => dest.addPage(p));
  const bytes = await dest.save();
  const blob = new Blob([bytes.buffer as ArrayBuffer], {
    type: 'application/pdf',
  });
  return {
    name: fileName,
    url: URL.createObjectURL(blob),
    pageCount: dest.getPageCount(),
    sizeLabel: formatBytes(blob.size),
  };
}

export function usePdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<PageThumb[]>([]);
  const [thumbsLoading, setThumbsLoading] = useState(false);
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [rangeString, setRangeString] = useState('');
  const [rangeGroups, setRangeGroups] = useState<RangeGroup[]>([
    { id: crypto.randomUUID(), label: 'Part 1', pages: [] },
  ]);
  const [splitMode, setSplitMode] = useState<SplitMode>('extract');
  const [everyN, setEveryN] = useState(1);
  const [isSplitting, setIsSplitting] = useState(false);
  const [result, setResult] = useState<SplitResult | null>(null);
  const [srcBytes, setSrcBytes] = useState<ArrayBuffer | null>(null);

  const loadFile = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setSelectedPages(new Set());
    setRangeString('');
    setRangeGroups([{ id: crypto.randomUUID(), label: 'Part 1', pages: [] }]);
    setThumbsLoading(true);

    try {
      const buf = await f.arrayBuffer();
      setSrcBytes(buf);
      const pdfDoc = await PDFDocument.load(buf.slice(0), {
        ignoreEncryption: true,
      });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      // Placeholder thumbs
      setThumbs(
        Array.from({ length: count }, (_, i) => ({
          pageIndex: i,
          thumbUrl: null,
          loaded: false,
        })),
      );
      // Render async
      renderThumbs(f, count).then((t) => {
        setThumbs(t);
        setThumbsLoading(false);
      });
    } catch {
      setThumbsLoading(false);
    }
  }, []);

  const togglePage = useCallback((idx: number) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedPages(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  }, [pageCount]);

  const selectNone = useCallback(() => setSelectedPages(new Set()), []);

  const split = useCallback(async () => {
    if (!srcBytes || !file) return;
    setIsSplitting(true);
    if (result) result.files.forEach((f) => URL.revokeObjectURL(f.url));
    setResult(null);

    try {
      const baseName = file.name.replace(/\.pdf$/i, '');
      const outputs: SplitResult['files'] = [];

      if (splitMode === 'extract') {
        const indices = rangeString.trim()
          ? parseRangeString(rangeString, pageCount)
          : Array.from(selectedPages).sort((a, b) => a - b);

        if (indices.length === 0) {
          setIsSplitting(false);
          return;
        }

        const out = await extractPages(
          srcBytes.slice(0),
          indices,
          `${baseName}_extracted.pdf`,
        );
        outputs.push(out);
      } else if (splitMode === 'ranges') {
        for (const group of rangeGroups) {
          if (!group.pages.length) continue;
          const out = await extractPages(
            srcBytes.slice(0),
            group.pages,
            `${baseName}_${group.label.replace(/\s+/g, '_')}.pdf`,
          );
          outputs.push(out);
        }
      } else if (splitMode === 'every') {
        const n = Math.max(1, everyN);
        let part = 1;
        for (let start = 0; start < pageCount; start += n) {
          const end = Math.min(start + n - 1, pageCount - 1);
          const indices = Array.from(
            { length: end - start + 1 },
            (_, i) => start + i,
          );
          const out = await extractPages(
            srcBytes.slice(0),
            indices,
            `${baseName}_part${part}.pdf`,
          );
          outputs.push(out);
          part++;
        }
      }

      setResult({ files: outputs });
    } catch (e) {
      console.error('PDF split failed:', e);
    } finally {
      setIsSplitting(false);
    }
  }, [
    srcBytes,
    file,
    splitMode,
    selectedPages,
    rangeString,
    rangeGroups,
    pageCount,
    everyN,
    result,
  ]);

  const clear = useCallback(() => {
    if (result) result.files.forEach((f) => URL.revokeObjectURL(f.url));
    setFile(null);
    setPageCount(0);
    setThumbs([]);
    setSelectedPages(new Set());
    setRangeString('');
    setResult(null);
    setSrcBytes(null);
  }, [result]);

  return {
    file,
    pageCount,
    thumbs,
    thumbsLoading,
    selectedPages,
    rangeString,
    setRangeString,
    rangeGroups,
    setRangeGroups,
    splitMode,
    setSplitMode,
    everyN,
    setEveryN,
    isSplitting,
    result,
    loadFile,
    togglePage,
    selectAll,
    selectNone,
    split,
    clear,
  };
}
