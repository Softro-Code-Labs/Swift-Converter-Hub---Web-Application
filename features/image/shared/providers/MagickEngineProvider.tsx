'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { initializeImageMagick } from '@imagemagick/magick-wasm';
import toast from 'react-hot-toast';

interface MagickEngineContextValue {
  isMagickLoaded: boolean;
}

const MagickEngineContext = createContext<MagickEngineContextValue>({
  isMagickLoaded: false,
});

let initPromise: Promise<void> | null = null;

function loadMagickEngine(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const response = await fetch('/magick.wasm');
      if (!response.ok) throw new Error('WASM fetch failed');
      const wasmBytes = await response.arrayBuffer();
      await initializeImageMagick(new Uint8Array(wasmBytes));
    })();
  }
  return initPromise;
}

export function MagickEngineProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMagickLoaded, setIsMagickLoaded] = useState(false);
  const hasWarnedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    loadMagickEngine()
      .then(() => {
        if (!cancelled) setIsMagickLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to boot WASM engine:', error);
        if (!cancelled && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          toast.error('Image engine failed to initialize.');
        }
        initPromise = null;
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MagickEngineContext.Provider value={{ isMagickLoaded }}>
      {children}
    </MagickEngineContext.Provider>
  );
}

export function useMagickEngineContext(): MagickEngineContextValue {
  return useContext(MagickEngineContext);
}
