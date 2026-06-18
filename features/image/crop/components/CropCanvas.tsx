'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CropRegion, AspectRatioPreset } from '../types/crop';
import { ASPECT_RATIOS } from './AspectRatioSelector';

interface CropCanvasProps {
  imageUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  aspectRatio: AspectRatioPreset;
  // Externally controlled crop in NATURAL pixels
  cropRegion: CropRegion;
  onCropChange: (region: CropRegion) => void;
}

const MIN_SIZE = 10; // minimum display pixels for handles

export const CropCanvas = ({
  imageUrl,
  naturalWidth,
  naturalHeight,
  aspectRatio,
  cropRegion,
  onCropChange,
}: CropCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [displayW, setDisplayW] = useState(0);
  const [displayH, setDisplayH] = useState(0);

  const dragging = useRef<{
    type: string;
    startX: number;
    startY: number;
    initCrop: CropRegion; // in NATURAL pixels
  } | null>(null);

  // Compute display scale whenever container or image changes
  useEffect(() => {
    const compute = () => {
      if (!containerRef.current || !naturalWidth || !naturalHeight) return;
      const containerWidth = containerRef.current.clientWidth;
      const s = Math.min(containerWidth / naturalWidth, 480 / naturalHeight, 1);
      setScale(s);
      setDisplayW(Math.round(naturalWidth * s));
      setDisplayH(Math.round(naturalHeight * s));
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [naturalWidth, naturalHeight, imageUrl]);

  const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

  // Convert natural pixels → display pixels
  const toDisplay = (v: number) => v * scale;
  // Convert display pixels → natural pixels
  const toNatural = (v: number) => Math.round(v / scale);

  // Display crop derived from natural crop
  const dc = {
    x: toDisplay(cropRegion.x),
    y: toDisplay(cropRegion.y),
    w: toDisplay(cropRegion.width),
    h: toDisplay(cropRegion.height),
  };

  const enforceAspect = (
    x: number,
    y: number,
    w: number,
    h: number,
  ): { x: number; y: number; w: number; h: number } => {
    const ratio = ASPECT_RATIOS[aspectRatio];
    if (!ratio) return { x, y, w, h };
    const newH = w / ratio;
    // clamp so it doesn't go out of bounds
    const clampedH = Math.min(newH, displayH - y);
    return { x, y, w, h: clampedH };
  };

  const emitNatural = (x: number, y: number, w: number, h: number) => {
    onCropChange({
      x: toNatural(x),
      y: toNatural(y),
      width: toNatural(w),
      height: toNatural(h),
    });
  };

  const getClientPos = (e: MouseEvent | TouchEvent) => ({
    clientX: 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX,
    clientY: 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY,
  });

  const onHandleMouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = containerRef.current!.getBoundingClientRect();
    dragging.current = {
      type,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      initCrop: { ...cropRegion },
    };
  };

  const onBoxMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current!.getBoundingClientRect();
    dragging.current = {
      type: 'move',
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      initCrop: { ...cropRegion },
    };
  };

  const onMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging.current || !containerRef.current || scale === 0) return;
      e.preventDefault();

      const rect = containerRef.current.getBoundingClientRect();
      const { clientX, clientY } = getClientPos(e);
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const dx = mx - dragging.current.startX;
      const dy = my - dragging.current.startY;

      // Work in display pixels, convert at end
      const ic = dragging.current.initCrop;
      let x = toDisplay(ic.x);
      let y = toDisplay(ic.y);
      let w = toDisplay(ic.width);
      let h = toDisplay(ic.height);
      const ratio = ASPECT_RATIOS[aspectRatio];

      switch (dragging.current.type) {
        case 'move': {
          x = clamp(x + dx, 0, displayW - w);
          y = clamp(y + dy, 0, displayH - h);
          break;
        }
        case 'se': {
          w = clamp(w + dx, MIN_SIZE, displayW - x);
          h = ratio ? w / ratio : clamp(h + dy, MIN_SIZE, displayH - y);
          break;
        }
        case 'sw': {
          const nw = clamp(w - dx, MIN_SIZE, x + w);
          x = x + w - nw;
          w = nw;
          h = ratio ? w / ratio : clamp(h + dy, MIN_SIZE, displayH - y);
          break;
        }
        case 'ne': {
          w = clamp(w + dx, MIN_SIZE, displayW - x);
          const nh = ratio ? w / ratio : clamp(h - dy, MIN_SIZE, y + h);
          y = y + h - nh;
          h = nh;
          break;
        }
        case 'nw': {
          const nw2 = clamp(w - dx, MIN_SIZE, x + w);
          x = x + w - nw2;
          w = nw2;
          const nh2 = ratio ? w / ratio : clamp(h - dy, MIN_SIZE, y + h);
          y = y + h - nh2;
          h = nh2;
          break;
        }
      }

      const enforced = enforceAspect(x, y, w, h);
      emitNatural(enforced.x, enforced.y, enforced.w, enforced.h);
    },
    [scale, displayW, displayH, aspectRatio, cropRegion],
  );

  const onMouseUp = useCallback(() => {
    dragging.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const handleBase =
    'absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md z-20 -translate-x-1/2 -translate-y-1/2';

  const naturalW = Math.round(cropRegion.width);
  const naturalH = Math.round(cropRegion.height);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-hidden rounded-xl"
      style={{ width: '100%' }}
    >
      {/* Base image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Crop preview"
        style={{ width: displayW, height: displayH, display: 'block' }}
        draggable={false}
      />

      {/* Dark overlay outside crop area */}
      {displayW > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width={displayW}
          height={displayH}
          style={{ top: 0, left: 0 }}
        >
          <defs>
            <mask id="crop-mask">
              <rect width={displayW} height={displayH} fill="white" />
              <rect x={dc.x} y={dc.y} width={dc.w} height={dc.h} fill="black" />
            </mask>
          </defs>
          <rect
            width={displayW}
            height={displayH}
            fill="rgba(0,0,0,0.55)"
            mask="url(#crop-mask)"
          />
          {/* Crop border */}
          <rect
            x={dc.x}
            y={dc.y}
            width={dc.w}
            height={dc.h}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={2}
          />
          {/* Rule of thirds lines */}
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <line
                x1={dc.x + (dc.w * i) / 3}
                y1={dc.y}
                x2={dc.x + (dc.w * i) / 3}
                y2={dc.y + dc.h}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
              />
              <line
                x1={dc.x}
                y1={dc.y + (dc.h * i) / 3}
                x2={dc.x + dc.w}
                y2={dc.y + (dc.h * i) / 3}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth={1}
              />
            </React.Fragment>
          ))}
        </svg>
      )}

      {/* Draggable crop box (invisible hit area) */}
      {displayW > 0 && (
        <div
          className="absolute z-10 cursor-move"
          style={{ left: dc.x, top: dc.y, width: dc.w, height: dc.h }}
          onMouseDown={onBoxMouseDown}
        />
      )}

      {/* Corner handles */}
      {displayW > 0 &&
        [
          { type: 'nw', style: { left: dc.x, top: dc.y, cursor: 'nw-resize' } },
          {
            type: 'ne',
            style: { left: dc.x + dc.w, top: dc.y, cursor: 'ne-resize' },
          },
          {
            type: 'sw',
            style: { left: dc.x, top: dc.y + dc.h, cursor: 'sw-resize' },
          },
          {
            type: 'se',
            style: { left: dc.x + dc.w, top: dc.y + dc.h, cursor: 'se-resize' },
          },
        ].map((h) => (
          <div
            key={h.type}
            className={handleBase}
            style={{ ...h.style, position: 'absolute' } as React.CSSProperties}
            onMouseDown={(e) => onHandleMouseDown(e, h.type)}
          />
        ))}

      {/* Dimensions badge */}
      {displayW > 0 && (
        <div
          className="absolute z-20 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none"
          style={{ left: dc.x, top: dc.y + dc.h + 6 }}
        >
          {naturalW} × {naturalH} px
        </div>
      )}
    </div>
  );
};
