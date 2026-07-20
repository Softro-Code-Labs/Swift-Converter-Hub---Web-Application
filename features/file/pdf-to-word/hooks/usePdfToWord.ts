'use client';

import { useState, useCallback } from 'react';
import type {
  ConvertProgress,
  ConvertResult,
  ExtractedLine,
  ExtractedPage,
} from '../types/pdfToWord';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// --- Text extraction ----------------------------------------------------------
//
// This is a *text-reflow* conversion, not a pixel-perfect layout clone: it
// reads every text run pdf.js can find, reconstructs lines and paragraphs
// from their position on the page, makes a light guess at headings/bold/
// italic from font size and font name, and writes that out as a normal,
// editable Word document. Tables, columns, and exact positioning are not
// preserved - that's a deliberate tradeoff. Most people who want to convert
// a PDF to Word want to *edit the text*, which this gives them; a
// pixel-perfect clone would need a full desktop-grade layout engine.
//
// Embedded images are not carried over in this version.

interface RawTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  /**
   * Best-effort readable font description for this glyph run. pdf.js's
   * `item.fontName` is usually just an internal lookup key (e.g. "g_d0_f1"),
   * not the real font name, so this combines it with `styles[fontName]
   * .fontFamily` (which sometimes echoes the real name, sometimes falls back
   * to a generic CSS family) - whichever pdf.js gives us. Bold/italic
   * detection from this is inherently best-effort, not guaranteed.
   */
  fontDescriptor: string;
}

async function extractPageItems(page: any): Promise<RawTextItem[]> {
  const content = await page.getTextContent();
  const styles: Record<string, { fontFamily?: string }> = content.styles ?? {};
  const items: RawTextItem[] = [];

  for (const item of content.items) {
    if (typeof item.str !== 'string' || item.str.trim() === '') continue;
    const t = item.transform as number[];
    // Magnitude of the vertical basis vector of the text matrix approximates
    // font size in PDF points, and holds up for rotated text too.
    const fontSize = Math.hypot(t[2], t[3]) || Math.hypot(t[0], t[1]) || 10;
    const style = styles[item.fontName as string];

    items.push({
      str: item.str,
      x: t[4],
      y: t[5],
      width: item.width ?? 0,
      fontSize,
      fontDescriptor: `${item.fontName ?? ''} ${style?.fontFamily ?? ''}`,
    });
  }

  return items;
}

function groupItemsIntoLines(items: RawTextItem[]): RawTextItem[][] {
  if (items.length === 0) return [];

  // Reading order: top to bottom (PDF y grows upward, so descending y),
  // then left to right within a line.
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);

  const lines: RawTextItem[][] = [];
  let current: RawTextItem[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const item = sorted[i];
    const tolerance = Math.max(2, prev.fontSize * 0.35);

    if (Math.abs(item.y - current[0].y) <= tolerance) {
      current.push(item);
    } else {
      lines.push(current);
      current = [item];
    }
  }
  lines.push(current);

  // Within each line, items were sorted by x already relative to the whole
  // page - re-sort defensively in case items arrived out of order.
  return lines.map((line) => [...line].sort((a, b) => a.x - b.x));
}

function lineToExtractedLine(
  line: RawTextItem[],
  gapAbove: number,
): ExtractedLine {
  // Join items left-to-right, inserting a space wherever there's a visible
  // horizontal gap that pdf.js didn't already encode as a space character.
  let text = '';
  for (let i = 0; i < line.length; i++) {
    const item = line[i];
    if (i > 0) {
      const prevItem = line[i - 1];
      const expectedGap = prevItem.fontSize * 0.15;
      const actualGap = item.x - (prevItem.x + prevItem.width);
      const needsSpace =
        actualGap > expectedGap && !text.endsWith(' ') && item.str[0] !== ' ';
      if (needsSpace) text += ' ';
    }
    text += item.str;
  }
  text = text.replace(/\s+/g, ' ').trim();

  // Font size: the size that covers the most characters in the line (a
  // couple of superscript/footnote-marker glyphs shouldn't skew this).
  const sizeVotes = new Map<number, number>();
  for (const item of line) {
    const rounded = Math.round(item.fontSize);
    sizeVotes.set(
      rounded,
      (sizeVotes.get(rounded) ?? 0) + Math.max(1, item.str.length),
    );
  }
  let fontSize = line[0].fontSize;
  let bestVotes = -1;
  for (const [size, votes] of sizeVotes) {
    if (votes > bestVotes) {
      bestVotes = votes;
      fontSize = size;
    }
  }

  const fontNames = line.map((i) => i.fontDescriptor.toLowerCase()).join(' ');
  const bold = /bold|black|heavy|semibold/.test(fontNames);
  const italic = /italic|oblique/.test(fontNames);

  return { text, fontSize, bold, italic, gapAbove };
}

async function extractPdfPages(
  file: File,
  onProgress: (current: number, total: number) => void,
): Promise<ExtractedPage[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) })
    .promise;
  const pages: ExtractedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress(i, pdf.numPages);
    const page = await pdf.getPage(i);
    const items = await extractPageItems(page);
    const rawLines = groupItemsIntoLines(items);

    const lines: ExtractedLine[] = [];
    let prevY: number | null = null;
    for (const line of rawLines) {
      const y = line[0].y;
      const gapAbove = prevY === null ? 0 : prevY - y;
      lines.push(lineToExtractedLine(line, gapAbove));
      prevY = y;
    }

    pages.push({ lines });
  }

  return pages;
}

// --- DOCX reconstruction --------------------------------------------------------

function isHyphenatedBreak(a: string, b: string): boolean {
  return /[a-z]-$/.test(a) && /^[a-z]/.test(b);
}

async function buildDocx(
  pages: ExtractedPage[],
  fileName: string,
): Promise<Blob> {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    PageBreak,
    AlignmentType,
  } = await import('docx');

  // Establish a document-wide "body" font size from the most common line size,
  // used as the baseline for heading detection.
  const allSizes = new Map<number, number>();
  for (const page of pages) {
    for (const line of page.lines) {
      if (!line.text) continue;
      allSizes.set(
        line.fontSize,
        (allSizes.get(line.fontSize) ?? 0) + line.text.length,
      );
    }
  }
  let bodySize = 11;
  let bestVotes = -1;
  for (const [size, votes] of allSizes) {
    if (votes > bestVotes) {
      bestVotes = votes;
      bodySize = size;
    }
  }

  const children: InstanceType<typeof Paragraph>[] = [];

  pages.forEach((page, pageIndex) => {
    if (pageIndex > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Merge consecutive lines into paragraphs: a normal line-to-line gap
    // (or a heading followed immediately by its own text) stays in the same
    // paragraph; a materially larger gap, or a heading boundary, starts a
    // new one.
    type Group = { lines: ExtractedLine[] };
    const groups: Group[] = [];

    for (const line of page.lines) {
      if (!line.text) continue;
      const isHeading = line.fontSize >= bodySize * 1.15;
      const last = groups[groups.length - 1];
      const lastLine = last?.lines[last.lines.length - 1];
      const lastIsHeading = lastLine
        ? lastLine.fontSize >= bodySize * 1.15
        : false;

      const normalGap = line.fontSize * 1.6;
      const sameParagraph =
        last &&
        line.gapAbove <= normalGap &&
        isHeading === lastIsHeading &&
        line.bold === lastLine!.bold &&
        line.italic === lastLine!.italic;

      if (sameParagraph) {
        last.lines.push(line);
      } else {
        groups.push({ lines: [line] });
      }
    }

    for (const group of groups) {
      const first = group.lines[0];
      const isHeading = first.fontSize >= bodySize * 1.15;
      const isTitle = first.fontSize >= bodySize * 1.6;

      let combinedText = '';
      group.lines.forEach((line, i) => {
        if (i === 0) {
          combinedText = line.text;
          return;
        }
        const prevText = group.lines[i - 1].text;
        if (isHyphenatedBreak(prevText, line.text)) {
          combinedText = combinedText.replace(/-$/, '') + line.text;
        } else {
          combinedText += ` ${line.text}`;
        }
      });

      children.push(
        new Paragraph({
          heading: isTitle
            ? HeadingLevel.HEADING_1
            : isHeading
              ? HeadingLevel.HEADING_2
              : undefined,
          alignment: AlignmentType.LEFT,
          spacing: { after: 160 },
          children: [
            new TextRun({
              text: combinedText,
              bold: isHeading ? true : first.bold,
              italics: first.italic,
              size: isHeading ? undefined : Math.round(first.fontSize * 2), // half-points
            }),
          ],
        }),
      );
    }

    if (groups.length === 0) {
      children.push(new Paragraph({ children: [] }));
    }
  });

  const doc = new Document({
    title: fileName.replace(/\.pdf$/i, ''),
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
}

export function usePdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<ConvertProgress | null>(null);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setProgress(null);
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setIsConverting(true);
    setError(null);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setProgress({ stage: 'reading', currentPage: 0, totalPages: 0 });

    try {
      const pages = await extractPdfPages(file, (currentPage, totalPages) =>
        setProgress({ stage: 'extracting', currentPage, totalPages }),
      );

      const totalChars = pages.reduce(
        (sum, p) => sum + p.lines.reduce((s, l) => s + l.text.length, 0),
        0,
      );
      const lowTextWarning = totalChars < pages.length * 20;

      setProgress({
        stage: 'building',
        currentPage: pages.length,
        totalPages: pages.length,
      });

      const pagesForDoc = lowTextWarning
        ? ([
            {
              lines: [
                {
                  text: "No selectable text was found in this PDF - it's likely a scanned image with no embedded text layer. This browser-based tool can reflow existing text, but it doesn't perform OCR (optical character recognition), so there's nothing here to convert.",
                  fontSize: 12,
                  bold: false,
                  italic: false,
                  gapAbove: 0,
                },
              ],
            },
            ...pages,
          ] as ExtractedPage[])
        : pages;

      const blob = await buildDocx(pagesForDoc, file.name);

      const paragraphCount = pages.reduce(
        (sum, p) => sum + p.lines.filter((l) => l.text).length,
        0,
      );

      setProgress({ stage: 'done', currentPage: 0, totalPages: 0 });
      setResult({
        url: URL.createObjectURL(blob),
        fileName: file.name.replace(/\.pdf$/i, '.docx'),
        pageCount: pages.length,
        paragraphCount,
        sizeLabel: formatBytes(blob.size),
        lowTextWarning,
      });
    } catch (e) {
      setError((e as Error).message || 'Could not convert this PDF.');
    } finally {
      setIsConverting(false);
      setProgress(null);
    }
  }, [file, result]);

  const clear = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(null);
  }, [result]);

  return {
    file,
    isConverting,
    progress,
    result,
    error,
    loadFile,
    convert,
    clear,
  };
}
