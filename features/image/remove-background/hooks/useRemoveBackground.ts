'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { initEngine, segment, type Backend } from '../lib/engine';

export type ItemStatus = 'queued' | 'working' | 'done' | 'error';

export interface BgItem {
  id: string;
  file: File;
  /** Object URL of the original, for thumbnails and the "before" view. */
  src: string;
  status: ItemStatus;
  /** Decoded original (kept for re-composing when settings change). */
  bitmap?: ImageBitmap;
  mask?: Uint8Array;
  maskSize?: number;
  ms?: number;
  error?: string;
}

export type EngineState =
  | { kind: 'idle' }
  | { kind: 'loading'; progress: number }
  | { kind: 'ready'; backend: Backend }
  | { kind: 'error'; message: string };

let nextId = 0;

/** Decode with EXIF orientation applied, so phone photos come out upright. */
async function decode(file: File) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error(
      /heic|heif/i.test(file.type + file.name)
        ? 'HEIC photos can’t be opened here - convert to JPG first.'
        : 'This image couldn’t be opened.',
    );
  }
}

export function useRemoveBackground() {
  const [items, setItems] = useState<BgItem[]>([]);
  const [engine, setEngine] = useState<EngineState>({ kind: 'idle' });
  const running = useRef(false);
  // The queue reads and writes this ref directly so it never acts on a
  // stale render; `items` mirrors it for the UI.
  const itemsRef = useRef<BgItem[]>([]);

  // Free decoded images and URLs when leaving the page.
  useEffect(
    () => () =>
      itemsRef.current.forEach((i) => {
        i.bitmap?.close();
        URL.revokeObjectURL(i.src);
      }),
    [],
  );

  const patch = (id: string, p: Partial<BgItem>) => {
    const apply = (list: BgItem[]) =>
      list.map((it) => (it.id === id ? { ...it, ...p } : it));
    itemsRef.current = apply(itemsRef.current);
    setItems(apply);
  };

  const startEngine = useCallback(async () => {
    setEngine((e) =>
      e.kind === 'ready' ? e : { kind: 'loading', progress: 0 },
    );
    try {
      const backend = await initEngine((progress) =>
        setEngine({ kind: 'loading', progress }),
      );
      setEngine({ kind: 'ready', backend });
      return true;
    } catch (err) {
      setEngine({
        kind: 'error',
        message:
          err instanceof Error ? err.message : 'The AI model failed to load.',
      });
      return false;
    }
  }, []);

  /** Work through the queue one image at a time (the model is big). */
  const pump = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      if (!(await startEngine())) return;
      for (;;) {
        const next = itemsRef.current.find((i) => i.status === 'queued');
        if (!next) break;
        patch(next.id, { status: 'working' });
        try {
          const bitmap = next.bitmap ?? (await decode(next.file));
          const r = await segment(bitmap);
          setEngine((e) =>
            e.kind === 'ready' && e.backend !== r.backend
              ? { kind: 'ready', backend: r.backend }
              : e,
          );
          patch(next.id, {
            status: 'done',
            bitmap,
            mask: r.mask,
            maskSize: r.size,
            ms: r.ms,
          });
        } catch (err) {
          patch(next.id, {
            status: 'error',
            error: err instanceof Error ? err.message : 'Failed',
          });
        }
        // Let React commit before looking for the next item.
        await new Promise((r) => setTimeout(r, 0));
      }
    } finally {
      running.current = false;
    }
  }, [startEngine]);

  const addFiles = useCallback(
    (files: File[]) => {
      const added = files.map((file) => ({
        id: `bg-${++nextId}`,
        file,
        src: URL.createObjectURL(file),
        status: 'queued' as const,
      }));
      setItems((list) => [...list, ...added]);
      itemsRef.current = [...itemsRef.current, ...added];
      void pump();
      return added.map((a) => a.id);
    },
    [pump],
  );

  const retry = useCallback(
    (id: string) => {
      patch(id, { status: 'queued', error: undefined });
      void pump();
    },
    [pump],
  );

  const remove = useCallback((id: string) => {
    const gone = itemsRef.current.find((i) => i.id === id);
    gone?.bitmap?.close();
    if (gone) URL.revokeObjectURL(gone.src);
    itemsRef.current = itemsRef.current.filter((i) => i.id !== id);
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    itemsRef.current.forEach((i) => {
      i.bitmap?.close();
      URL.revokeObjectURL(i.src);
    });
    itemsRef.current = [];
    setItems([]);
  }, []);

  return { items, engine, addFiles, remove, clear, retry, startEngine };
}
