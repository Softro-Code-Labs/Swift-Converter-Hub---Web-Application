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
        'table                     => table',
        'tr                        => tr',
        'td                        => td',
      ],
    },
  );

  const warnings = result.messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message)
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

async function convertXlsx(file: File): Promise<ConvertResult> {
  const XLSX = await import('xlsx');
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });

  const sheetsHtml: string[] = wb.SheetNames.map((sheetName) => {
    const ws = wb.Sheets[sheetName];
    const html = XLSX.utils.sheet_to_html(ws, { editable: false });
    return `<div class="sheet-section">
      <h2 class="sheet-name">${sheetName}</h2>
      ${html}
    </div>`;
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
function buildPrintHtml(
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
    h1.title { font-size: 24pt; text-align: center; margin-bottom: 24pt; }
    p { margin-bottom: 8pt; orphans: 3; widows: 3; }
    strong, b { font-weight: bold; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 8pt 0 8pt 24pt; }
    li { margin-bottom: 4pt; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    td, th { border: 1px solid #999; padding: 4pt 8pt; font-size: 10pt; }
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
    .sheet-name { font-size: 14pt; font-weight: bold; margin-bottom: 8pt; border-bottom: 2pt solid #333; padding-bottom: 4pt; }
    table { width: 100%; border-collapse: collapse; }
    td, th { border: 1px solid #bbb; padding: 3pt 6pt; font-size: 9pt; white-space: nowrap; }
    th { background: #ddd; font-weight: bold; }
    tr:nth-child(even) td { background: #f9f9f9; }
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    ${baseStyles}
    ${fileType === 'docx' ? docxStyles : xlsxStyles}
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
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

    // Create hidden iframe, write HTML, trigger print dialog
    const iframe = document.createElement('iframe');
    iframe.style.cssText =
      'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      setIsPrinting(false);
      return;
    }

    iframeDoc.open();
    iframeDoc.write(printHtml);
    iframeDoc.close();

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        setTimeout(() => {
          document.body.removeChild(iframe);
          setIsPrinting(false);
        }, 1000);
      }
    };
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
