import { useState, useEffect } from 'react';
import { initializeImageMagick } from '@imagemagick/magick-wasm';
import toast from 'react-hot-toast';

export const useMagickEngine = () => {
  const [isMagickLoaded, setIsMagickLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/magick.wasm');
        if (!response.ok) throw new Error('WASM fetch failed');
        const wasmBytes = await response.arrayBuffer();
        await initializeImageMagick(new Uint8Array(wasmBytes));
        setIsMagickLoaded(true);
      } catch (error) {
        console.error('Failed to boot ImageMagick WASM:', error);
        toast.error('Image engine failed to initialize.');
      }
    };
    load();
  }, []);

  return { isMagickLoaded };
};
