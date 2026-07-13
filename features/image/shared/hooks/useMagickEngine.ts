import { useMagickEngineContext } from '../providers/MagickEngineProvider';

/**
 * Returns whether the shared ImageMagick WASM engine has finished loading.
 *
 * The engine itself is booted exactly once by <MagickEngineProvider>
 * (mounted in app/image/layout.tsx so it wraps every tool under /image/*).
 * This hook just reads that shared state, so calling it from multiple tool
 * components (convert, compress, crop, adjust, metadata) no longer
 * triggers redundant WASM re-downloads/re-initialization when navigating
 * between tools. Same public API as before, so no call sites needed to
 * change.
 */
export const useMagickEngine = () => {
  return useMagickEngineContext();
};
