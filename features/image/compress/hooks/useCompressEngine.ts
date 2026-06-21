import { useState, useCallback } from 'react';
import { ImageMagick, MagickFormat } from '@imagemagick/magick-wasm';
import { CompressFileItem, CompressOptions } from '../types/compress';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';

const FORMAT_MAP: Record<string, MagickFormat> = {
  jpg: MagickFormat.Jpg,
  jpeg: MagickFormat.Jpeg,
  png: MagickFormat.Png,
  webp: MagickFormat.WebP,
  gif: MagickFormat.Gif,
  bmp: MagickFormat.Bmp,
  tiff: MagickFormat.Tiff,
  avif: MagickFormat.Avif,
};

const toBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return buf;
};

export const useCompressEngine = () => {
  const [files, setFiles] = useState<CompressFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    const items: CompressFileItem[] = newFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      status: 'idle',
      previewUrl: URL.createObjectURL(file),
      originalSize: file.size,
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
  }, [files]);

  const updateFile = useCallback(
    (id: string, patch: Partial<CompressFileItem>) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...patch } : f)),
      );
    },
    [],
  );

  const compressOne = async (
    item: CompressFileItem,
    options: CompressOptions,
  ): Promise<{ url: string; size: number }> => {
    const arrayBuffer = await item.file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer.slice(0));
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? 'jpg';

    const outputExt = options.format === 'keep' ? sourceExt : options.format;
    const magickFormat =
      FORMAT_MAP[outputExt] ?? FORMAT_MAP[sourceExt] ?? MagickFormat.Jpg;
    const mimeType = `image/${outputExt === 'jpg' ? 'jpeg' : outputExt}`;

    return new Promise((resolve, reject) => {
      try {
        ImageMagick.read(uint8Array, (image) => {
          // Strip metadata (EXIF, ICC profiles) - major size reduction
          if (options.stripMetadata) {
            image.strip();
          }

          // Optional resize cap
          if (options.maxWidth && image.width > options.maxWidth) {
            const ratio = options.maxWidth / image.width;
            image.resize(options.maxWidth, Math.round(image.height * ratio));
          }

          // Set compression quality (1-100)
          image.quality = options.quality;

          image.write(magickFormat, (outputBytes) => {
            const blob = new Blob([toBuffer(new Uint8Array(outputBytes))], {
              type: mimeType,
            });
            resolve({ url: URL.createObjectURL(blob), size: blob.size });
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const compressAll = useCallback(
    async (options: CompressOptions) => {
      setIsProcessing(true);

      for (const item of files) {
        if (item.status === 'success') continue;
        updateFile(item.id, { status: 'processing' });
        try {
          const result = await compressOne(item, options);
          const savings = Math.round(
            ((item.originalSize - result.size) / item.originalSize) * 100,
          );
          updateFile(item.id, {
            status: 'success',
            resultUrl: result.url,
            compressedSize: result.size,
            savings: Math.max(0, savings),
          });
        } catch (err) {
          console.error(`Compression failed for ${item.file.name}:`, err);
          updateFile(item.id, { status: 'error', error: String(err) });
        }
      }

      setIsProcessing(false);
      toast.success('Compression complete!');
    },
    [files, updateFile],
  );

  const downloadSingle = useCallback((item: CompressFileItem) => {
    if (!item.resultUrl) return;
    const a = document.createElement('a');
    a.href = item.resultUrl;
    const base = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const ext = item.file.name.split('.').pop();
    a.download = `${base}_compressed.${ext}`;
    a.click();
  }, []);

  const downloadAll = useCallback(async () => {
    const ready = files.filter((f) => f.status === 'success' && f.resultUrl);
    if (!ready.length) return;

    setIsZipping(true);
    const zip = new JSZip();

    try {
      toast.loading('Building ZIP...', { id: 'zip-compress' });
      for (const item of ready) {
        const blob = await fetch(item.resultUrl!).then((r) => r.blob());
        const base = item.file.name.substring(
          0,
          item.file.name.lastIndexOf('.'),
        );
        const ext = item.file.name.split('.').pop();
        zip.file(`${base}_compressed.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'compressed_images.zip');
      toast.success('ZIP ready!', { id: 'zip-compress' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip-compress' });
    } finally {
      setIsZipping(false);
    }
  }, [files]);

  return {
    files,
    isProcessing,
    isZipping,
    addFiles,
    removeFile,
    clearAll,
    compressAll,
    downloadSingle,
    downloadAll,
  };
};
