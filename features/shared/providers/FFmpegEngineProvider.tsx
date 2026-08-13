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
  /** Engine #0, for single-job tools (Trim, Merge, to-GIF, preview transcoder). */
  ffmpeg: FFmpeg | null;
  /** Reserves a free engine for batch tools; grows the pool lazily. Pair with releaseEngine. */
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

// --- Engine pool (module-scoped singleton) ---------------------------------
// Pool of independent FFmpeg WASM instances (one Web Worker each), grown
// lazily so batch tools can process multiple files concurrently. Engine #0
// doubles as the direct `ffmpeg` export for single-job tools (Trim, Merge,
// to-GIF) - safe since only one tool/route is ever mounted per tab.
//
// POOL_SIZE = floor(cores / 2), same formula on mobile and desktop, leaving
// headroom for the UI thread. Clamped to [1, MAX_POOL_SIZE]; the ceiling
// exists because each engine is its own ~30MB WASM instance, so memory -
// not CPU - is the limiting factor at high core counts.
const MAX_POOL_SIZE = 6;
const POOL_SIZE =
  typeof navigator !== 'undefined' && navigator.hardwareConcurrency
    ? Math.max(
        1,
        Math.min(Math.floor(navigator.hardwareConcurrency / 2), MAX_POOL_SIZE),
      )
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
      // Free the slot so a later call can retry instead of reusing this rejection.
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

  // All engines spoken for - queue and wait for one to free up.
  return new Promise<FFmpeg>((resolve) => {
    waiters.push((entry) => resolve(entry.ffmpeg));
  });
}

function releaseEngine(ffmpeg: FFmpeg): void {
  const entry = pool.find((e) => e.ffmpeg === ffmpeg);
  if (!entry) return;

  const nextWaiter = waiters.shift();
  if (nextWaiter) {
    // Hand off directly - stays busy, just for a different job.
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
