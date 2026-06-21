import { useState, useCallback } from 'react';
import {
  ImageMagick,
  MagickFormat,
  Percentage,
} from '@imagemagick/magick-wasm';
import {
  AdjustmentValues,
  ProcessedAdjustResult,
  formatBytes,
} from '../types/adjust';
import toast from 'react-hot-toast';

const toBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return buf;
};

export const useAdjustEngine = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedAdjustResult | null>(null);

  const applyAdjustments = useCallback(
    async (
      file: File,
      adjustments: AdjustmentValues,
      outputFormat: string = 'png',
    ) => {
      setIsProcessing(true);
      setResult(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer.slice(0));

        await new Promise<void>((resolve, reject) => {
          try {
            ImageMagick.read(uint8Array, (image) => {
              // --- Brightness / Contrast / Saturation -----------------------
              if (adjustments.brightness !== 0 || adjustments.contrast !== 0) {
                image.brightnessContrast(
                  new Percentage(adjustments.brightness),
                  new Percentage(adjustments.contrast),
                );
              }

              // Saturation via modulate: 100 = no change, 0 = grayscale, 200 = double
              if (adjustments.saturation !== 0 || adjustments.hue !== 0) {
                const saturationPct = Math.max(0, 100 + adjustments.saturation);
                const huePct = 100 + (adjustments.hue / 180) * 100;
                image.modulate(
                  new Percentage(100),
                  new Percentage(saturationPct),
                  new Percentage(huePct),
                );
              }

              // --- Sharpen ----------------------------------------------------
              if (adjustments.sharpen > 0) {
                const amount = adjustments.sharpen / 20;
                image.sharpen(amount, amount);
              }

              // --- Blur ---------------------------------------------------------
              if (adjustments.blur > 0) {
                image.blur(adjustments.blur, adjustments.blur / 2);
              }

              // --- Grayscale ----------------------------------------------------
              if (adjustments.grayscale) {
                image.grayscale();
              }

              // --- Sepia ----------------------------------------------------------
              if (adjustments.sepia) {
                image.sepiaTone(new Percentage(80));
              }

              // --- Invert -----------------------------------------------------
              if (adjustments.invert) {
                image.negate();
              }

              // --- Output -------------------------------------------------------
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
                const blob = new Blob([toBuffer(new Uint8Array(outputBytes))], {
                  type: mimeType,
                });
                setResult({
                  url: URL.createObjectURL(blob),
                  size: formatBytes(blob.size),
                  width: image.width,
                  height: image.height,
                });
                resolve();
              });
            });
          } catch (err) {
            reject(err);
          }
        });

        toast.success('Adjustments applied!');
      } catch (err) {
        console.error('Adjust failed:', err);
        toast.error('Processing failed. Try a different image.');
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

  return { isProcessing, result, applyAdjustments, clearResult };
};
