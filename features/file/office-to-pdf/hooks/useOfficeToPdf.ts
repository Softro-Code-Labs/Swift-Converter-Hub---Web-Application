'use client';

import { useState, useCallback } from 'react';
import type { ConvertResult, OfficeFileType } from '../types/officeToPdf';
import { detectFileType } from '../types/officeToPdf';

async function convertDocx(file: File): Promise<ConvertResult> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Title']     => h1.title:fresh",
        'b                         => strong',
        'i                         => em',
        'u                         => u',
        'strike                    => s',
        // Tables, rows and cells are converted by mammoth by default -
        // mapping them here is invalid and produced user-facing warnings.
      ],
    },
  );

  // Only surface warnings people can act on; mammoth's internal notes about
  // unrecognised paragraph styles are expected and harmless.
  const warnings = result.messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message)
    .filter((m) => !/Unrecognised (paragraph|run) style|style mapping/i.test(m))
    .slice(0, 5);

  // Rough page estimate: ~500 words per page
  const wordCount = result.value
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 500));

  return {
    htmlContent: result.value,
    fileName: file.name,
    fileType: 'docx',
    pageEstimate,
    warnings,
  };
}

const escapeHtml = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

async function convertXlsx(file: File): Promise<ConvertResult> {
  const XLSX = await import('xlsx');
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetsHtml: string[] = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const empty = !ws || !ws['!ref'];
    // sheet_to_html returns a full HTML document; keep only the table.
    const raw = empty ? '' : XLSX.utils.sheet_to_html(ws, { editable: false });
    const table = raw.match(/<table[\s\S]*<\/table>/i)?.[0] ?? '';
    return `<section class="sheet-section">
      <h2 class="sheet-name">${escapeHtml(sheetName)}</h2>
      ${table || '<p class="empty">This sheet is empty.</p>'}
    </section>`;
  });

  return {
    htmlContent: sheetsHtml.join('\n'),
    fileName: file.name,
    fileType: 'xlsx',
    pageEstimate: wb.SheetNames.length,
    warnings: [],
  };
}

// Print stylesheet for clean PDF output
export function buildPrintHtml(
  content: string,
  fileType: OfficeFileType,
  title: string,
): string {
  const baseStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: #fff;
    }
    @page { margin: 2cm; size: A4; }
  `;

  const docxStyles = `
    h1 { font-size: 20pt; font-weight: bold; margin: 16pt 0 8pt; }
    h2 { font-size: 16pt; font-weight: bold; margin: 14pt 0 6pt; }
    h3 { font-size: 14pt; font-weight: bold; margin: 12pt 0 4pt; }
    h4 { font-size: 12pt; font-weight: bold; margin: 10pt 0 4pt; }
    h1.title { font-size: 24pt; margin-bottom: 18pt; }
    p { margin-bottom: 8pt; orphans: 3; widows: 3; }
    strong, b { font-weight: bold; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 8pt 0 8pt 24pt; }
    li { margin-bottom: 4pt; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    td, th { border: 1px solid #999; padding: 4pt 8pt; font-size: 10pt; vertical-align: top; }
    td p, th p { margin: 0; }
    th { background: #eee; font-weight: bold; }
    img { max-width: 100%; height: auto; }
    a { color: #000; text-decoration: underline; }
    blockquote { margin: 8pt 0 8pt 24pt; border-left: 3pt solid #ccc; padding-left: 12pt; }
    pre, code { font-family: 'Courier New', monospace; font-size: 10pt; background: #f5f5f5; padding: 2pt 4pt; }
  `;

  const xlsxStyles = `
    body { font-family: Arial, sans-serif; font-size: 10pt; }
    .sheet-section { margin-bottom: 24pt; page-break-after: always; }
    .sheet-section:last-child { page-break-after: avoid; }
    @page { size: A4 landscape; margin: 1.5cm; }
    .sheet-name { font-size: 14pt; font-weight: bold; margin-bottom: 8pt; border-bottom: 2pt solid #333; padding-bottom: 4pt; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #bbb; padding: 3pt 6pt; font-size: 9pt; vertical-align: top; overflow-wrap: anywhere; }
    tr:first-child td { background: #e8e8e8; font-weight: bold; }
    tr:nth-child(even) td { background: #f7f7f7; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    .empty { color: #666; font-style: italic; }
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title.replace(/\.[^.]+$/, ''))}</title>
  <style>
    ${baseStyles}
    ${fileType === 'docx' ? docxStyles : xlsxStyles}
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    /* On screen (the preview), imitate the printed page margins. */
    @media screen { body { padding: 1.5cm; } }
  </style>
</head>
<body>${content}</body>
</html>`;
}

export function useOfficeToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<OfficeFileType | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const loadFile = useCallback((f: File) => {
    const type = detectFileType(f);
    setFile(f);
    setFileType(type);
    setResult(null);
    setError(null);
  }, []);

  const convert = useCallback(async () => {
    if (!file || !fileType || fileType === 'unsupported') return;
    setIsConverting(true);
    setError(null);
    setResult(null);

    try {
      const res =
        fileType === 'docx' ? await convertDocx(file) : await convertXlsx(file);
      setResult(res);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsConverting(false);
    }
  }, [file, fileType]);

  const printToPdf = useCallback(() => {
    if (!result) return;
    setIsPrinting(true);

    const printHtml = buildPrintHtml(
      result.htmlContent,
      result.fileType,
      result.fileName,
    );

    // Print from a hidden iframe. The page is written via srcdoc and the
    // print call waits for it to load (attaching onload after
    // document.write could miss the event, so nothing happened). The frame is
    // removed only after printing finishes - removing it early cancels the
    // dialog in Firefox and Safari, where print() doesn't block.
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';

    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      iframe.remove();
      setIsPrinting(false);
    };

    iframe.onload = () => {
      const win = iframe.contentWindow;
      if (!win) return cleanup();
      win.addEventListener('afterprint', () => setTimeout(cleanup, 100));
      // Give embedded images a moment to decode before printing.
      setTimeout(() => {
        try {
          win.focus();
          win.print();
        } catch {
          cleanup();
        }
      }, 150);
      // Safety net if afterprint never fires.
      setTimeout(cleanup, 120_000);
    };
    iframe.srcdoc = printHtml;
    document.body.appendChild(iframe);
  }, [result]);

  const clear = useCallback(() => {
    setFile(null);
    setFileType(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    file,
    fileType,
    isConverting,
    result,
    error,
    isPrinting,
    loadFile,
    convert,
    printToPdf,
    clear,
  };
}
