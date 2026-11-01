/* Background-removal worker (module worker).
 *
 * Runs the IS-Net segmentation model with ONNX Runtime Web entirely on the
 * visitor's device: on the GPU via WebGPU when available, otherwise on the
 * CPU via WebAssembly. Images never leave the browser - the only network
 * requests are for the runtime and the model, both served by this site and
 * cached after the first use.
 *
 * Messages in:   { type: 'init' }
 *                { type: 'run', id, bitmap: ImageBitmap }
 * Messages out:  { type: 'progress', loaded, total }      model download
 *                { type: 'ready', backend: 'webgpu' | 'wasm' }
 *                { type: 'mask', id, mask: Uint8Array, size, ms }
 *                { type: 'error', id?, message }
 */

const ORT_BASE = '/ort/1.30.0/';
const MODEL_URL = '/models/isnet-general-use-w8-v2.onnx';
const MODEL_CACHE = 'sch-models-v2';
const SIZE = 1024; // IS-Net input resolution

let session = null;
let ort = null;
let backend = 'wasm';
let initPromise = null;

/** Download the model once, keep it in Cache Storage, report progress. */
async function loadModel() {
  let cache = null;
  try {
    // Drop copies of older model versions.
    for (const key of await caches.keys()) {
      if (key.startsWith('sch-models-') && key !== MODEL_CACHE) await caches.delete(key);
    }
    cache = await caches.open(MODEL_CACHE);
    const hit = await cache.match(MODEL_URL);
    if (hit) return new Uint8Array(await hit.arrayBuffer());
  } catch {
    cache = null; // Cache Storage unavailable (e.g. private mode)
  }

  const res = await fetch(MODEL_URL);
  if (!res.ok || !res.body) throw new Error(`Model download failed (${res.status})`);
  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    self.postMessage({ type: 'progress', loaded, total });
  }
  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  if (cache) {
    try {
      await cache.put(
        MODEL_URL,
        new Response(bytes, { headers: { 'content-type': 'application/octet-stream' } }),
      );
    } catch {
      /* quota - it simply downloads again next time */
    }
  }
  return bytes;
}

async function hasWebGPU() {
  try {
    if (!('gpu' in navigator)) return false;
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

let modelBytes = null;

async function createCpuSession() {
  session = await ort.InferenceSession.create(modelBytes, {
    graphOptimizationLevel: 'all',
    executionProviders: ['wasm'],
  });
  backend = 'wasm';
}

/** One run on a blank image: compiles the GPU shaders up front and proves
 *  every layer of the model works on this GPU before real images arrive. */
async function warmUp() {
  const input = new ort.Tensor('float32', new Float32Array(3 * SIZE * SIZE), [1, 3, SIZE, SIZE]);
  const out = await session.run({ [session.inputNames[0]]: input });
  for (const t of Object.values(out)) t.dispose?.();
}

async function init() {
  const gpu = await hasWebGPU();
  // The WebGPU build also contains the CPU backend; the CPU-only build is
  // half the size, so devices without a usable GPU get that one.
  ort = await import(/* webpackIgnore: true */ ORT_BASE + (gpu ? 'ort.min.mjs' : 'ort.wasm.min.mjs'));
  ort.env.wasm.wasmPaths = ORT_BASE;
  ort.env.wasm.numThreads = 1; // no SharedArrayBuffer without cross-origin isolation
  ort.env.logLevel = 'error';

  modelBytes = await loadModel();
  if (gpu) {
    try {
      session = await ort.InferenceSession.create(modelBytes, {
        graphOptimizationLevel: 'all',
        executionProviders: ['webgpu'],
      });
      backend = 'webgpu';
      // A broken driver can hang rather than fail - don't wait forever.
      await Promise.race([
        warmUp(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('WebGPU warm-up timed out')), 45000),
        ),
      ]);
    } catch (err) {
      // Some GPUs/drivers don't support every operation: use the CPU.
      console.warn('[remove-background] WebGPU unavailable, using CPU:', err);
      session?.release?.();
      session = null;
    }
  }
  if (!session) await createCpuSession();
  self.postMessage({ type: 'ready', backend });
}

/** RGB resized to 1024x1024, scaled to 0..1 by the image's max, minus 0.5. */
function preprocess(bitmap) {
  const canvas = new OffscreenCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, SIZE, SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  let max = 1;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > max) max = data[i];
    if (data[i + 1] > max) max = data[i + 1];
    if (data[i + 2] > max) max = data[i + 2];
  }
  const plane = SIZE * SIZE;
  const input = new Float32Array(3 * plane);
  for (let p = 0, i = 0; p < plane; p++, i += 4) {
    input[p] = data[i] / max - 0.5;
    input[plane + p] = data[i + 1] / max - 0.5;
    input[2 * plane + p] = data[i + 2] / max - 0.5;
  }
  return input;
}

async function infer(input) {
  const feeds = {
    [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, SIZE, SIZE]),
  };
  const results = await session.run(feeds);
  const out = results[session.outputNames[0]];
  const pred = Float32Array.from((await out.getData?.()) ?? out.data);
  for (const t of Object.values(results)) t.dispose?.();
  return pred;
}

async function run(id, bitmap) {
  const t0 = performance.now();
  const input = preprocess(bitmap);
  bitmap.close?.();
  let pred;
  try {
    pred = await infer(input);
  } catch (err) {
    if (backend !== 'webgpu') throw err;
    // A GPU failure mid-way: switch to the CPU for good and try again.
    console.warn('[remove-background] WebGPU run failed, using CPU:', err);
    session?.release?.();
    await createCpuSession();
    pred = await infer(input);
  }
  // Stretch to 0..255 the same way the reference implementation does.
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < SIZE * SIZE; i++) {
    const v = pred[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  const mask = new Uint8Array(SIZE * SIZE);
  for (let i = 0; i < mask.length; i++) {
    mask[i] = Math.round(((pred[i] - min) / range) * 255);
  }
  self.postMessage(
    { type: 'mask', id, mask, size: SIZE, backend, ms: Math.round(performance.now() - t0) },
    [mask.buffer],
  );
}

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === 'init') {
      initPromise ??= init();
      await initPromise;
    } else if (msg.type === 'run') {
      initPromise ??= init();
      await initPromise;
      await run(msg.id, msg.bitmap);
    }
  } catch (err) {
    if (msg.type === 'init') initPromise = null; // allow a retry
    self.postMessage({
      type: 'error',
      id: msg.id,
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
