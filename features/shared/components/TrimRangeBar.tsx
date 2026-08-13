'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type Accent = 'purple' | 'blue';

const ACCENT = {
  purple: {
    fill: 'bg-purple-400 dark:bg-purple-600',
    handle: 'bg-purple-600 dark:bg-purple-500',
  },
  blue: {
    fill: 'bg-blue-400 dark:bg-blue-600',
    handle: 'bg-blue-600 dark:bg-blue-500',
  },
} as const;

type DragMode = 'start' | 'end' | 'range';

interface DragState {
  mode: DragMode;
  startX: number;
  initStart: number;
  initEnd: number;
}

interface TrimRangeBarProps {
  startTime: number;
  endTime: number;
  duration: number;
  onChange: (start: number, end: number) => void;
  /** Fires continuously during drag with the position under the pointer, so a
   * connected preview player can seek live as the user adjusts the range. */
  onScrub?: (time: number) => void;
  accent?: Accent;
}

/**
 * A trim range bar with draggable start/end handles, plus a draggable fill
 * region that shifts the whole selection at once. Previously this was a
 * purely visual, non-interactive readout styled to look exactly like a
 * draggable trim bracket (rounded track, filled selection) with no drag
 * behavior behind it - a mismatch against the near-universal convention
 * from YouTube Shorts, Instagram Reels, iMovie, etc.
 */
export function TrimRangeBar({
  startTime,
  endTime,
  duration,
  onChange,
  onScrub,
  accent = 'purple',
}: TrimRangeBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [dragging, setDragging] = useState<DragMode | null>(null);

  const colors = ACCENT[accent];
  const pct = {
    start: duration ? (startTime / duration) * 100 : 0,
    end: duration ? (endTime / duration) * 100 : 100,
  };

  const timeAtClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || duration === 0) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(
        1,
        Math.max(0, (clientX - rect.left) / rect.width),
      );
      return ratio * duration;
    },
    [duration],
  );

  const beginDrag = (mode: DragMode, e: React.PointerEvent) => {
    e.preventDefault();
    dragRef.current = {
      mode,
      startX: e.clientX,
      initStart: startTime,
      initEnd: endTime,
    };
    setDragging(mode);
    onScrub?.(mode === 'end' ? endTime : startTime);
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      const track = trackRef.current;
      if (!drag || !track || duration === 0) return;

      if (drag.mode === 'range') {
        const rect = track.getBoundingClientRect();
        const deltaTime = ((e.clientX - drag.startX) / rect.width) * duration;
        const span = drag.initEnd - drag.initStart;
        let newStart = drag.initStart + deltaTime;
        let newEnd = drag.initEnd + deltaTime;
        if (newStart < 0) {
          newStart = 0;
          newEnd = span;
        }
        if (newEnd > duration) {
          newEnd = duration;
          newStart = duration - span;
        }
        onChange(newStart, newEnd);
        onScrub?.(newStart);
      } else if (drag.mode === 'start') {
        const t = Math.min(timeAtClientX(e.clientX), endTime);
        onChange(t, endTime);
        onScrub?.(t);
      } else {
        const t = Math.max(timeAtClientX(e.clientX), startTime);
        onChange(startTime, t);
        onScrub?.(t);
      }
    };

    const endDrag = () => {
      dragRef.current = null;
      setDragging(null);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', endDrag);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', endDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, duration, timeAtClientX]);

  const nudge = (mode: 'start' | 'end') => (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 1 : 0.1;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (mode === 'start') {
        const t = Math.max(0, startTime - step);
        onChange(t, endTime);
        onScrub?.(t);
      } else {
        const t = Math.max(startTime, endTime - step);
        onChange(startTime, t);
        onScrub?.(t);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (mode === 'start') {
        const t = Math.min(endTime, startTime + step);
        onChange(t, endTime);
        onScrub?.(t);
      } else {
        const t = Math.min(duration, endTime + step);
        onChange(startTime, t);
        onScrub?.(t);
      }
    }
  };

  return (
    <div
      ref={trackRef}
      className="relative h-5 flex items-center touch-none select-none"
    >
      <div className="absolute inset-x-0 h-2 rounded-full bg-slate-100 dark:bg-slate-800 pointer-events-none" />

      {/* Filled selection - drag anywhere on it to shift the whole range */}
      <div
        onPointerDown={(e) => beginDrag('range', e)}
        className={`absolute h-2 rounded-full ${colors.fill} cursor-grab active:cursor-grabbing`}
        style={{ left: `${pct.start}%`, right: `${100 - pct.end}%` }}
      />

      {/* Start handle */}
      <div
        onPointerDown={(e) => beginDrag('start', e)}
        onKeyDown={nudge('start')}
        role="slider"
        aria-label="Trim start"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={startTime}
        tabIndex={0}
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 flex items-center justify-center cursor-ew-resize touch-none focus-visible:outline-none"
        style={{ left: `${pct.start}%` }}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full ${colors.handle} border-2 border-white dark:border-slate-900 shadow-sm`}
        />
      </div>

      {/* End handle */}
      <div
        onPointerDown={(e) => beginDrag('end', e)}
        onKeyDown={nudge('end')}
        role="slider"
        aria-label="Trim end"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={endTime}
        tabIndex={0}
        className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 top-1/2 flex items-center justify-center cursor-ew-resize touch-none focus-visible:outline-none"
        style={{ left: `${pct.end}%` }}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full ${colors.handle} border-2 border-white dark:border-slate-900 shadow-sm`}
        />
      </div>
    </div>
  );
}
