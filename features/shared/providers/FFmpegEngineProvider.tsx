'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import toast from 'react-hot-toast';

interface FFmpegEngineContextValue {
  isFFmpegLoaded: boolean;
  /** Engine #0, for single-job tools (Trim, Merge, to-GIF, the preview
   * transcoder) that only ever need one engine at a time - see the pool
   * note below for why using this directly is safe. */
  ffmpeg: FFmpeg | null;
  /** For batch tools (Compress/Convert/Volume/Extract-Audio): reserves a
   * free engine from the pool, growing it lazily up to POOL_SIZE, or
   * queues until one frees up. Always pair with releaseEngine. */
  acquireEngine: () => Promise<FFmpeg>;
  releaseEngine: (engine: FFmpeg) => void;
}

const FFmpegEngineContext = createContext<FFmpegEngineContextValue>({
  isFFmpegLoaded: false,
  ffmpeg: null,
  acquireEngine: () =>
    Promise.reject(new Error('FFmpeg engine pool not ready')),
  releaseEngine: () => {},
});

// --- Engine pool (module-scoped singleton) ------------------------------------
// A pool of independent FFmpeg WASM instances (each its own Web Worker) so
// batch tools can process several files at once instead of strictly one at
// a time. The pool is shared by every route (module-level state persists
// for the tab's lifetime, same as the old single-instance version), and
// grows lazily - only as batch jobs actually demand more than one engine -
// rather than eagerly fetching POOL_SIZE x ~30MB of wasm on every page load.
//
// Engine #0 is also handed out directly as `ffmpeg` for single-job tools
// (Trim, Merge, to-GIF, the preview transcoder), bypassing the busy/free
// bookkeeping below. That's safe because this app only ever has one tool
// mounted per tab (each tool is its own route) - a single-job tool and a
// batch job's pool usage never run at the same time.
const POOL_SIZE =
  typeof navigator !== 'undefined' && navigator.hardwareConcurrency
    ? Math.max(1, Math.min(navigator.hardwareConcurrency, 4))
    : 2;

interface PooledEngine {
  ffmpeg: FFmpeg;
  busy: boolean;
}

const pool: PooledEngine[] = [];
const pendingLoads = new Map<number, Promise<PooledEngine>>();
const waiters: ((entry: PooledEngine) => void)[] = [];

async function loadEngineInstance(): Promise<FFmpeg> {
  const instance = new FFmpeg();
  const baseURL = '/ffmpeg';
  const [coreURL, wasmURL] = await Promise.all([
    toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  ]);
  await instance.load({ coreURL, wasmURL });
  return instance;
}

function growPool(): Promise<PooledEngine> {
  const slot = pool.length + pendingLoads.size;
  const existing = pendingLoads.get(slot);
  if (existing) return existing;

  const loading = loadEngineInstance()
    .then((instance) => {
      const entry: PooledEngine = { ffmpeg: instance, busy: false };
      pool.push(entry);
      pendingLoads.delete(slot);
      return entry;
    })
    .catch((error) => {
      // Free the slot so a later call can retry, instead of everyone
      // getting stuck reusing this one rejected promise forever.
      pendingLoads.delete(slot);
      throw error;
    });
  pendingLoads.set(slot, loading);
  return loading;
}

function ensureFirstEngine(): Promise<FFmpeg> {
  if (pool[0]) return Promise.resolve(pool[0].ffmpeg);
  const pending = pendingLoads.get(0);
  if (pending) return pending.then((entry) => entry.ffmpeg);
  return growPool().then((entry) => entry.ffmpeg);
}

async function acquireEngine(): Promise<FFmpeg> {
  await ensureFirstEngine();

  const free = pool.find((e) => !e.busy);
  if (free) {
    free.busy = true;
    return free.ffmpeg;
  }

  if (pool.length + pendingLoads.size < POOL_SIZE) {
    const entry = await growPool();
    entry.busy = true;
    return entry.ffmpeg;
  }

  // Every engine (loaded or loading) is spoken for - queue and wait for
  // whichever one frees up first.
  return new Promise<FFmpeg>((resolve) => {
    waiters.push((entry) => resolve(entry.ffmpeg));
  });
}

function releaseEngine(ffmpeg: FFmpeg): void {
  const entry = pool.find((e) => e.ffmpeg === ffmpeg);
  if (!entry) return;

  const nextWaiter = waiters.shift();
  if (nextWaiter) {
    // Hand off directly - stays "busy", just for a different job.
    nextWaiter(entry);
  } else {
    entry.busy = false;
  }
}

export function FFmpegEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(pool[0] != null);
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (pool[0]) return;

    let cancelled = false;

    ensureFirstEngine()
      .then(() => {
        if (!cancelled) setIsFFmpegLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to boot FFmpeg engine:', error);
        if (!cancelled && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          toast.error('Media engine failed to initialize.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FFmpegEngineContext.Provider
      value={{
        isFFmpegLoaded,
        ffmpeg: pool[0]?.ffmpeg ?? null,
        acquireEngine,
        releaseEngine,
      }}
    >
      {children}
    </FFmpegEngineContext.Provider>
  );
}

export function useFFmpegEngineContext(): FFmpegEngineContextValue {
  return useContext(FFmpegEngineContext);
}
