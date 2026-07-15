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
  ffmpeg: FFmpeg | null;
}

const FFmpegEngineContext = createContext<FFmpegEngineContextValue>({
  isFFmpegLoaded: false,
  ffmpeg: null,
});

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

function loadFFmpegEngine(): Promise<FFmpeg> {
  if (!loadPromise) {
    loadPromise = (async () => {
      const instance = new FFmpeg();
      const baseURL = '/ffmpeg';
      const [coreURL, wasmURL] = await Promise.all([
        toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      ]);
      await instance.load({ coreURL, wasmURL });
      ffmpegInstance = instance;
      return instance;
    })();
  }
  return loadPromise;
}

export function FFmpegEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(ffmpegInstance !== null);
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    if (ffmpegInstance) return;

    let cancelled = false;

    loadFFmpegEngine()
      .then(() => {
        if (!cancelled) setIsFFmpegLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to boot FFmpeg engine:', error);
        if (!cancelled && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          toast.error('Audio engine failed to initialize.');
        }
        loadPromise = null;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FFmpegEngineContext.Provider
      value={{ isFFmpegLoaded, ffmpeg: ffmpegInstance }}
    >
      {children}
    </FFmpegEngineContext.Provider>
  );
}

export function useFFmpegEngineContext(): FFmpegEngineContextValue {
  return useContext(FFmpegEngineContext);
}
