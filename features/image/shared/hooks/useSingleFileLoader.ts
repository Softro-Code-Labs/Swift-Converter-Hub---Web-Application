import { useState, useCallback, useRef } from 'react';

interface UseSingleFileLoaderOptions {
  isSupported: (file: File) => boolean;
  onUnsupported: (file: File) => void;
  onLoaded?: (file: File, previewUrl: string) => void;
  /** Called on every reset/change so the consumer can clear its own derived state */
  onClear?: () => void;
}

export const useSingleFileLoader = ({
  isSupported,
  onUnsupported,
  onLoaded,
  onClear,
}: UseSingleFileLoaderOptions) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(
    (f: File) => {
      if (!isSupported(f)) {
        onUnsupported(f);
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      onClear?.();
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      onLoaded?.(f, url);
    },
    [isSupported, onUnsupported, onLoaded, onClear, previewUrl],
  );

  /** Clears current file and immediately opens the file picker */
  const changeImage = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onClear?.();
    setFile(null);
    setPreviewUrl('');
    setTimeout(() => inputRef.current?.click(), 50);
  }, [previewUrl, onClear]);

  /** Clears current file only - does not open the file picker */
  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onClear?.();
    setFile(null);
    setPreviewUrl('');
  }, [previewUrl, onClear]);

  return { file, previewUrl, inputRef, loadFile, changeImage, reset, setFile };
};
