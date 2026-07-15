import { useState, useCallback } from 'react';
import {
  ImageMagick,
  MagickFormat,
  MagickGeometry,
} from '@imagemagick/magick-wasm';
import { CropRegion, ResizeDimensions, ProcessedResult } from '../types/crop';
import { formatBytes } from '../../shared/utils/bytes';
import toast from 'react-hot-toast';

export const useCropEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedResult | null>(null);

  const processImage = useCallback(
    async (
      file: File,
      crop: CropRegion | null,
      resize: ResizeDimensions | null,
      outputFormat: string = 'png',
    ) => {
      if (!file) return;

      setIsProcessing(true);
      setResult(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        await new Promise<void>((resolve, reject) => {
          try {
            ImageMagick.read(uint8Array, (image) => {
              const originalWidth = image.width;
              const originalHeight = image.height;

              // Apply crop if specified
              if (crop && crop.width > 0 && crop.height > 0) {
                const geometry = new MagickGeometry(
                  Math.round(crop.x),
                  Math.round(crop.y),
                  Math.round(crop.width),
                  Math.round(crop.height),
                );
                image.crop(geometry);
                image.resetPage();
              }

              // Apply resize if specified
              if (resize && resize.width > 0 && resize.height > 0) {
                const geometry = new MagickGeometry(
                  Math.round(resize.width),
                  Math.round(resize.height),
                );
                geometry.ignoreAspectRatio = !resize.lockAspect;
                image.resize(geometry);
              }

              // Determine output format
              const formatMap: Record<string, MagickFormat> = {
                png: MagickFormat.Png,
                jpg: MagickFormat.Jpg,
                jpeg: MagickFormat.Jpeg,
                webp: MagickFormat.WebP,
              };
              const magickFormat =
                formatMap[outputFormat.toLowerCase()] ?? MagickFormat.Png;
              const mimeType =
                outputFormat === 'jpg' || outputFormat === 'jpeg'
                  ? 'image/jpeg'
                  : `image/${outputFormat}`;

              image.write(magickFormat, (outputBytes) => {
                const blob = new Blob([new Uint8Array(outputBytes)], {
                  type: mimeType,
                });
                setResult({
                  url: URL.createObjectURL(blob),
                  width: image.width,
                  height: image.height,
                  size: formatBytes(blob.size),
                  originalWidth,
                  originalHeight,
                });
                resolve();
              });
            });
          } catch (err) {
            reject(err);
          }
        });

        toast.success('Image processed successfully!');
      } catch (err) {
        console.error('Crop/resize failed:', err);
        toast.error('Processing failed. Please try a different image.');
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  const clearResult = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
  }, [result]);

  return { isProcessing, result, processImage, clearResult };
};
