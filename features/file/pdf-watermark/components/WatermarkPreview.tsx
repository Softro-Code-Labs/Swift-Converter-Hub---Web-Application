'use client';

import { useEffect, useRef } from 'react';
import type { WatermarkConfig } from '../types/pdfWatermark';

interface WatermarkPreviewProps {
  thumbUrl: string | null;
  config: WatermarkConfig;
  canvasWidth?: number;
}

function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

export function WatermarkPreview({
  thumbUrl,
  config,
  canvasWidth = 320,
}: WatermarkPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const A4_RATIO = 297 / 210;
    const cw = canvasWidth;
    const ch = Math.round(cw * A4_RATIO);
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, cw, ch);

    // White page background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cw, ch);

    // Draw PDF thumbnail as background if available
    const drawWatermark = () => {
      if (config.type === 'text') {
        const fontSize = Math.round(config.fontSize * (cw / 595));
        ctx.save();
        ctx.globalAlpha = config.opacity;
        ctx.fillStyle = config.color;
        ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;

        const textW = ctx.measureText(config.text).width;
        const textH = fontSize;

        const drawAt = (x: number, y: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((config.angle * Math.PI) / 180);
          ctx.fillText(config.text, -textW / 2, textH / 4);
          ctx.restore();
        };

        if (config.position === 'tiled') {
          const gapX = textW * 1.8;
          const gapY = textH * 3.5;
          for (let y = 0; y < ch + textH; y += gapY) {
            for (let x = 0; x < cw + textW; x += gapX) {
              drawAt(x, y);
            }
          }
        } else {
          const px = config.position.includes('right')
            ? cw - textW / 2 - 20
            : config.position.includes('left')
              ? textW / 2 + 20
              : cw / 2;
          const py = config.position.includes('bottom')
            ? ch - textH - 20
            : config.position.includes('top')
              ? textH + 20
              : ch / 2;
          drawAt(px, py);
        }
        ctx.restore();
      } else if (config.type === 'image' && config.imageDataUrl) {
        const img = new Image();
        img.onload = () => {
          const wmW = img.width * config.scale * (cw / 595);
          const wmH = img.height * config.scale * (cw / 595);

          const px = config.position.includes('right')
            ? cw - wmW - 20
            : config.position.includes('left')
              ? 20
              : cw / 2 - wmW / 2;
          const py = config.position.includes('bottom')
            ? ch - wmH - 20
            : config.position.includes('top')
              ? 20
              : ch / 2 - wmH / 2;

          ctx.save();
          ctx.globalAlpha = config.opacity;
          if (config.position === 'tiled') {
            const gapX = wmW * 1.8;
            const gapY = wmH * 2.5;
            for (let y = 0; y < ch + wmH; y += gapY) {
              for (let x = 0; x < cw + wmW; x += gapX) {
                ctx.save();
                ctx.translate(x + wmW / 2, y + wmH / 2);
                ctx.rotate((config.angle * Math.PI) / 180);
                ctx.drawImage(img, -wmW / 2, -wmH / 2, wmW, wmH);
                ctx.restore();
              }
            }
          } else {
            ctx.save();
            ctx.translate(px + wmW / 2, py + wmH / 2);
            ctx.rotate((config.angle * Math.PI) / 180);
            ctx.drawImage(img, -wmW / 2, -wmH / 2, wmW, wmH);
            ctx.restore();
          }
          ctx.restore();
        };
        img.src = config.imageDataUrl;
      }
    };

    if (thumbUrl) {
      const bg = new Image();
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, cw, ch);
        drawWatermark();
      };
      bg.src = thumbUrl;
    } else {
      // Draw placeholder lines to simulate a document
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, cw, ch);
      const lineColor = '#e2e8f0';
      const margin = cw * 0.1;
      const lineH = 6;
      const gap = 14;
      let y = ch * 0.12;
      // Title line
      ctx.fillStyle = lineColor;
      ctx.fillRect(margin, y, cw * 0.5, lineH + 4);
      y += gap * 2;
      // Body lines
      for (let i = 0; i < 18; i++) {
        const lineW = i % 5 === 4 ? cw * 0.45 : cw - margin * 2;
        ctx.fillRect(margin, y, lineW, lineH);
        y += gap;
        if (y > ch - margin) break;
      }
      drawWatermark();
    }
  }, [thumbUrl, config, canvasWidth]);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-xs mx-auto block"
      style={{ background: '#fff' }}
    />
  );
}
