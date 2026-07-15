'use client';

import { useState, useCallback } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import type {
  WatermarkConfig,
  WatermarkResult,
  TextWatermarkConfig,
  ImageWatermarkConfig,
  WatermarkPosition,
} from '../types/pdfWatermark';
import {
  DEFAULT_TEXT_CONFIG,
  DEFAULT_IMAGE_CONFIG,
} from '../types/pdfWatermark';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return { r, g, b };
}

function getPositionCoords(
  position: WatermarkPosition,
  pageWidth: number,
  pageHeight: number,
  wmWidth: number,
  wmHeight: number,
  margin = 40,
): { x: number; y: number }[] {
  switch (position) {
    case 'center':
      return [
        { x: pageWidth / 2 - wmWidth / 2, y: pageHeight / 2 - wmHeight / 2 },
      ];
    case 'top-left':
      return [{ x: margin, y: pageHeight - wmHeight - margin }];
    case 'top-right':
      return [
        { x: pageWidth - wmWidth - margin, y: pageHeight - wmHeight - margin },
      ];
    case 'bottom-left':
      return [{ x: margin, y: margin }];
    case 'bottom-right':
      return [{ x: pageWidth - wmWidth - margin, y: margin }];
    case 'tiled': {
      const coords: { x: number; y: number }[] = [];
      const gapX = wmWidth * 1.8;
      const gapY = wmHeight * 2.5;
      for (let y = -wmHeight; y < pageHeight + wmHeight; y += gapY) {
        for (let x = -wmWidth; x < pageWidth + wmWidth; x += gapX) {
          coords.push({ x, y });
        }
      }
      return coords;
    }
  }
}

async function applyTextWatermark(
  pdfDoc: PDFDocument,
  config: TextWatermarkConfig,
): Promise<void> {
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();
  const { r, g, b } = hexToRgb(config.color);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(config.text, config.fontSize);
    const textHeight = config.fontSize;

    const positions = getPositionCoords(
      config.position,
      width,
      height,
      textWidth,
      textHeight,
    );

    for (const { x, y } of positions) {
      page.drawText(config.text, {
        x: config.position === 'center' ? width / 2 : x,
        y: config.position === 'center' ? height / 2 : y + textHeight / 2,
        font,
        size: config.fontSize,
        color: rgb(r, g, b),
        opacity: config.opacity,
        rotate: degrees(config.angle),
        xSkew: degrees(0),
        ySkew: degrees(0),
      });
    }
  }
}

async function applyImageWatermark(
  pdfDoc: PDFDocument,
  config: ImageWatermarkConfig,
): Promise<void> {
  if (!config.imageDataUrl) return;

  // Detect image type and embed
  const isJpeg =
    config.imageDataUrl.includes('data:image/jpeg') ||
    config.imageDataUrl.includes('data:image/jpg');
  const isPng = config.imageDataUrl.includes('data:image/png');

  if (!isJpeg && !isPng) throw new Error('Watermark image must be JPEG or PNG');

  const base64 = config.imageDataUrl.split(',')[1];
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const embeddedImage = isJpeg
    ? await pdfDoc.embedJpg(bytes)
    : await pdfDoc.embedPng(bytes);

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const wmWidth = embeddedImage.width * config.scale;
    const wmHeight = embeddedImage.height * config.scale;

    const positions = getPositionCoords(
      config.position,
      width,
      height,
      wmWidth,
      wmHeight,
    );

    for (const { x, y } of positions) {
      page.drawImage(embeddedImage, {
        x: config.position === 'center' ? width / 2 - wmWidth / 2 : x,
        y: config.position === 'center' ? height / 2 - wmHeight / 2 : y,
        width: wmWidth,
        height: wmHeight,
        opacity: config.opacity,
        rotate: degrees(config.angle),
      });
    }
  }
}

export function usePdfWatermark() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [srcBytes, setSrcBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [textConfig, setTextConfig] = useState(DEFAULT_TEXT_CONFIG);
  const [imageConfig, setImageConfig] = useState(DEFAULT_IMAGE_CONFIG);
  const [isApplying, setIsApplying] = useState(false);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadPdf = useCallback(async (f: File) => {
    setPdfFile(f);
    setResult(null);
    setError(null);
    setThumbUrl(null);

    try {
      const buf = await f.arrayBuffer();
      setSrcBytes(buf);
      const pdfDoc = await PDFDocument.load(buf.slice(0), {
        ignoreEncryption: true,
      });
      setPageCount(pdfDoc.getPageCount());

      // Render first page thumbnail for preview
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const pdf = await pdfjsLib.getDocument({ data: buf.slice(0) }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.6 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({
          canvasContext: canvas.getContext('2d')!,
          viewport,
          canvas,
        }).promise;
        setThumbUrl(canvas.toDataURL('image/jpeg', 0.8));
      } catch {
        /* no preview */
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const loadImage = useCallback(async (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageConfig((prev) => ({
        ...prev,
        imageFile: f,
        imageDataUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(f);
  }, []);

  const applyWatermark = useCallback(async () => {
    if (!srcBytes || !pdfFile) return;
    setIsApplying(true);
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(srcBytes.slice(0), {
        ignoreEncryption: true,
      });
      const config: WatermarkConfig =
        mode === 'text' ? textConfig : imageConfig;

      if (config.type === 'text') {
        await applyTextWatermark(pdfDoc, config);
      } else {
        await applyImageWatermark(pdfDoc, config);
      }

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
  }, [srcBytes, pdfFile, mode, textConfig, imageConfig, result]);

  const clear = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setPdfFile(null);
    setSrcBytes(null);
    setPageCount(0);
    setThumbUrl(null);
    setResult(null);
    setError(null);
    setTextConfig(DEFAULT_TEXT_CONFIG);
    setImageConfig(DEFAULT_IMAGE_CONFIG);
  }, [result]);

  return {
    pdfFile,
    pageCount,
    thumbUrl,
    mode,
    setMode,
    textConfig,
    setTextConfig,
    imageConfig,
    setImageConfig,
    isApplying,
    result,
    error,
    loadPdf,
    loadImage,
    applyWatermark,
    clear,
  };
}
