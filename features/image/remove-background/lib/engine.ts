'use client';

/* ---------------------------------------------------------------------------
   Client for the background-removal worker (public/workers/
   remove-background.worker.mjs). One worker per tab, created on first use.

   The worker runs the IS-Net model with ONNX Runtime Web - on the GPU via
   WebGPU when the device supports it, otherwise on the CPU. Images are
   handed to it as ImageBitmaps and never leave the browser.
--------------------------------------------------------------------------- */

export type Backend = 'webgpu' | 'wasm';

export interface MaskResult {
  /** Foreground probability per pixel, 0-255, at size x size. */
  mask: Uint8Array;
  size: number;
  ms: number;
}

type Pending = {
  resolve: (r: MaskResult) => void;
  reject: (e: Error) => void;
};

let worker: Worker | null = null;
let ready: Promise<Backend> | null = null;
const pending = new Map<string, Pending>();
const progressListeners = new Set<(ratio: number) => void>();
let seq = 0;

function getWorker() {
  if (worker) return worker;
  worker = new Worker('/workers/remove-background.worker.mjs', {
    type: 'module',
    name: 'remove-background',
  });
  worker.onmessage = (e: MessageEvent) => {
    const d = e.data;
    if (d.type === 'progress') {
      const ratio = d.total ? d.loaded / d.total : 0;
      progressListeners.forEach((l) => l(ratio));
    } else if (d.type === 'mask') {
      pending.get(d.id)?.resolve({ mask: d.mask, size: d.size, ms: d.ms });
      pending.delete(d.id);
    } else if (d.type === 'error' && d.id) {
      pending.get(d.id)?.reject(new Error(d.message));
      pending.delete(d.id);
    }
  };
  return worker;
}

/** Load the runtime and model (downloads once, then cached). */
export function initEngine(onProgress?: (ratio: number) => void) {
  if (onProgress) progressListeners.add(onProgress);
  ready ??= new Promise<Backend>((resolve, reject) => {
    const w = getWorker();
    const onMsg = (e: MessageEvent) => {
      if (e.data.type === 'ready') {
        w.removeEventListener('message', onMsg);
        resolve(e.data.backend);
      } else if (e.data.type === 'error' && !e.data.id) {
        w.removeEventListener('message', onMsg);
        ready = null; // let the user retry
        reject(new Error(e.data.message));
      }
    };
    w.addEventListener('message', onMsg);
    w.onerror = (e) => {
      ready = null;
      reject(
        new Error(
          e.message || 'The background-removal engine failed to start.',
        ),
      );
    };
    w.postMessage({ type: 'init' });
  });
  return ready.finally(() => {
    if (onProgress) progressListeners.delete(onProgress);
  });
}

/** Run the model on one image. */
export async function segment(bitmap: ImageBitmap): Promise<MaskResult> {
  await initEngine();
  const id = `img-${++seq}`;
  // The worker takes ownership of a copy; the caller keeps its bitmap.
  const copy = await createImageBitmap(bitmap);
  return new Promise<MaskResult>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ type: 'run', id, bitmap: copy }, [copy]);
  });
}
