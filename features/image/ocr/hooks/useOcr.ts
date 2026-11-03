'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  loadLanguage,
  recognize,
  type LoadStep,
  type OcrResult,
} from '../lib/engine';
import { displayable, isHeic, prepareImage } from '../lib/image';
import { DEFAULT_LANGUAGE } from '../lib/languages';

export type ItemStatus = 'queued' | 'working' | 'done' | 'error';

export interface OcrItem {
  id: string;
  file: File;
  /** Object URL for thumbnails and the preview (null until a HEIC photo
   *  has been converted). */
  src: string | null;
  status: ItemStatus;
  /** Recognition progress of the working item, 0-1. */
  progress?: number;
  /** Size of the image Tesseract read; line boxes are in these pixels. */
  width?: number;
  height?: number;
  result?: OcrResult;
  /** Language code the result was read with. */
  lang?: string;
  /** Unique per reading, so anything tied to one result (like hand edits)
   *  doesn't carry over to a re-read. */
  runId?: number;
  error?: string;
}

export type EngineState =
  | { kind: 'idle' }
  | { kind: 'loading'; step: LoadStep; progress: number }
  | { kind: 'ready' }
  | { kind: 'error'; message: string };

let nextId = 0;
let nextRun = 0;

export function useOcr() {
  const [items, setItems] = useState<OcrItem[]>([]);
  const [engine, setEngine] = useState<EngineState>({ kind: 'idle' });
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const running = useRef(false);
  const languageRef = useRef(DEFAULT_LANGUAGE);
  // The queue reads and writes this ref directly so it never acts on a
  // stale render; `items` mirrors it for the UI.
  const itemsRef = useRef<OcrItem[]>([]);

  // Free object URLs when leaving the page.
  useEffect(
    () => () =>
      itemsRef.current.forEach((i) => i.src && URL.revokeObjectURL(i.src)),
    [],
  );

  const patch = (id: string, p: Partial<OcrItem>) => {
    const apply = (list: OcrItem[]) =>
      list.map((it) => (it.id === id ? { ...it, ...p } : it));
    itemsRef.current = apply(itemsRef.current);
    setItems(apply);
  };

  const prepareEngine = useCallback(async (code: string) => {
    setEngine((e) =>
      e.kind === 'ready' ? e : { kind: 'loading', step: 'engine', progress: 0 },
    );
    try {
      await loadLanguage(code, (step, progress) =>
        setEngine({ kind: 'loading', step, progress }),
      );
      setEngine({ kind: 'ready' });
      return true;
    } catch (err) {
      setEngine({
        kind: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'The text-recognition engine failed to start.',
      });
      return false;
    }
  }, []);

  /** Work through the queue one image at a time. */
  const pump = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      for (;;) {
        const next = itemsRef.current.find((i) => i.status === 'queued');
        if (!next) break;
        // Read at each step: the language can change mid-queue.
        const lang = languageRef.current;
        if (!(await prepareEngine(lang))) break;
        patch(next.id, { status: 'working', progress: 0, error: undefined });
        let decoded = false;
        try {
          const source = await displayable(next.file);
          decoded = true;
          if (!next.src) patch(next.id, { src: URL.createObjectURL(source) });
          const image = await prepareImage(source);
          const result = await recognize(image.blob, (progress) =>
            patch(next.id, { progress }),
          );
          patch(next.id, {
            status: 'done',
            result,
            lang,
            runId: ++nextRun,
            width: image.width,
            height: image.height,
          });
        } catch (err) {
          patch(next.id, {
            status: 'error',
            error:
              !decoded
                ?'This HEIC photo couldn’t be converted - try saving it as JPG first.'
                : err instanceof Error
                  ? err.message
                  : 'Failed',
          });
        }
        // Let React commit before looking for the next item.
        await new Promise((r) => setTimeout(r, 0));
      }
    } finally {
      running.current = false;
    }
  }, [prepareEngine]);

  const addFiles = useCallback(
    (files: File[]) => {
      const added: OcrItem[] = files.map((file) => ({
        id: `ocr-${++nextId}`,
        file,
        src: isHeic(file) ? null : URL.createObjectURL(file),
        status: 'queued',
      }));
      setItems((list) => [...list, ...added]);
      itemsRef.current = [...itemsRef.current, ...added];
      void pump();
      return added.map((a) => a.id);
    },
    [pump],
  );

  const setLanguage = useCallback(
    (code: string) => {
      languageRef.current = code;
      setLanguageState(code);
      // Download it now, so it's ready by the time anyone presses "Read again".
      if (!running.current) void prepareEngine(code);
    },
    [prepareEngine],
  );

  /** Read finished images again in the current language. */
  const rereadAll = useCallback(() => {
    itemsRef.current
      .filter((i) => i.status === 'done' && i.lang !== languageRef.current)
      .forEach((i) => patch(i.id, { status: 'queued' }));
    void pump();
  }, [pump]);

  const retry = useCallback(
    (id: string) => {
      patch(id, { status: 'queued', error: undefined });
      void pump();
    },
    [pump],
  );

  /** After an engine failure: queue the failed images and start again. */
  const retryAll = useCallback(() => {
    itemsRef.current
      .filter((i) => i.status === 'error')
      .forEach((i) => patch(i.id, { status: 'queued', error: undefined }));
    if (itemsRef.current.some((i) => i.status === 'queued')) void pump();
    else void prepareEngine(languageRef.current);
  }, [pump, prepareEngine]);

  const remove = useCallback((id: string) => {
    const gone = itemsRef.current.find((i) => i.id === id);
    if (gone?.src) URL.revokeObjectURL(gone.src);
    itemsRef.current = itemsRef.current.filter((i) => i.id !== id);
    setItems((list) => list.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => {
    itemsRef.current.forEach((i) => i.src && URL.revokeObjectURL(i.src));
    itemsRef.current = [];
    setItems([]);
  }, []);

  return {
    items,
    engine,
    language,
    setLanguage,
    addFiles,
    remove,
    clear,
    retry,
    retryAll,
    rereadAll,
  };
}
