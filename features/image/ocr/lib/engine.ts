'use client';

/* ---------------------------------------------------------------------------
   Client for the OCR engine: Tesseract compiled to WebAssembly, running in
   a Web Worker via tesseract.js. One worker per tab, created on first use.

   The worker script, engine and language data are all served from this
   site (copied into public/tesseract/ by scripts/copy-tesseract.js), so
   nothing - not the image, not a request for the engine - goes to a CDN.
   Language data is kept in IndexedDB after its first download.
--------------------------------------------------------------------------- */

import type { Worker as TessWorker } from 'tesseract.js';
import { version } from 'tesseract.js/package.json';
import { tesseractLangs } from './languages';

const BASE = `/tesseract/${version}`;
const MODEL = '4.0.0_best_int';

export interface Bbox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface OcrLine {
  text: string;
  /** 0-100. */
  confidence: number;
  bbox: Bbox;
}

export interface OcrResult {
  text: string;
  /** Mean word confidence, 0-100. */
  confidence: number;
  lines: OcrLine[];
  ms: number;
}

export type LoadStep = 'engine' | 'language';

type LoadListener = (step: LoadStep, ratio: number) => void;

let worker: Promise<TessWorker> | null = null;
let loadedLangs: string | null = null;
/** Every call runs after the previous one: the worker does one job at a time,
 *  and a language switch must not land in the middle of a recognition. */
let chain: Promise<unknown> = Promise.resolve();
const loadListeners = new Set<LoadListener>();
let recognizeListener: ((ratio: number) => void) | null = null;

function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.catch(() => {});
  return run;
}

function onLog(m: { status: string; progress: number }) {
  if (m.status === 'recognizing text') {
    recognizeListener?.(m.progress);
  } else if (m.status === 'loading tesseract core') {
    loadListeners.forEach((l) => l('engine', m.progress));
  } else if (m.status === 'loading language traineddata') {
    loadListeners.forEach((l) => l('language', m.progress));
  }
}

const toError = (err: unknown, fallback: string) =>
  err instanceof Error ? err : new Error(typeof err === 'string' ? err : fallback);

/** Start the engine and load a language (downloads once, then cached).
 *  Switching language reuses the running worker. */
export function loadLanguage(code: string, onProgress?: LoadListener) {
  const langs = tesseractLangs(code);
  return serial(async () => {
    if (onProgress) loadListeners.add(onProgress);
    try {
      if (!worker) {
        loadedLangs = langs;
        worker = import('tesseract.js').then(({ createWorker, OEM }) =>
          createWorker(langs, OEM.LSTM_ONLY, {
            workerPath: `${BASE}/worker.min.js`,
            corePath: BASE,
            langPath: `/tesseract/lang/${MODEL}`,
            // Versioned so a model update never serves stale cached data.
            cachePath: `tesseract-${MODEL}`,
            logger: onLog,
          }),
        );
        await worker;
      } else if (loadedLangs !== langs) {
        await (await worker).reinitialize(langs);
        loadedLangs = langs;
      }
    } catch (err) {
      // Let the next attempt start from scratch.
      void worker?.then((w) => w.terminate()).catch(() => {});
      worker = null;
      loadedLangs = null;
      throw toError(err, 'The text-recognition engine failed to start.');
    } finally {
      if (onProgress) loadListeners.delete(onProgress);
    }
  });
}

/** Read the text in one image. Call loadLanguage first. */
export function recognize(
  image: Blob,
  onProgress?: (ratio: number) => void,
): Promise<OcrResult> {
  return serial(async () => {
    if (!worker) throw new Error('The text-recognition engine isn’t running.');
    const w = await worker;
    const started = performance.now();
    recognizeListener = onProgress ?? null;
    try {
      const { data } = await w.recognize(
        image,
        {},
        { text: true, blocks: true },
      );
      const lines: OcrLine[] = (data.blocks ?? []).flatMap((b) =>
        b.paragraphs.flatMap((p) =>
          p.lines
            .filter((l) => l.text.trim())
            .map((l) => ({
              text: l.text.trim(),
              confidence: l.confidence,
              bbox: l.bbox,
            })),
        ),
      );
      return {
        text: data.text,
        confidence: data.confidence,
        lines,
        ms: performance.now() - started,
      };
    } catch (err) {
      throw toError(err, 'The text in this image couldn’t be read.');
    } finally {
      recognizeListener = null;
    }
  });
}
