'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { decodeHeic } from '@/features/image/convert/hooks/useHeicConverter';
import { layoutPage } from '../lib/layout';
import { readJpegOrientation } from '../lib/exif';
import {
  MAX_IMAGES,
  type ImageItem,
  type PdfOptions,
  type PdfResult,
} from '../types/imageToPdf';

const isHeic = (f: File) =>
  /\.(heic|heif)$/i.test(f.name) || /image\/hei[cf]/i.test(f.type);

const isImage = (f: File) =>
  f.type.startsWith('image/') ||
  /\.(jpe?g|png|webp|gif|bmp|avif|heic|heif)$/i.test(f.name);

const kind = (f: File): 'jpeg' | 'png' | 'other' => {
  if (/image\/jpe?g/i.test(f.type) || /\.jpe?g$/i.test(f.name)) return 'jpeg';
  if (/image\/png/i.test(f.type) || /\.png$/i.test(f.name)) return 'png';
  return 'other';
};

/** Longest side, in pixels, when "Smaller file" is chosen. */
const COMPACT_MAX = 2000;

export function useImageToPdf() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isBuilding, setBuilding] = useState(false);
  const [progress, setProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [result, setResult] = useState<PdfResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Decoded HEIC images (as JPEG blobs), keyed by item id. Kept out of state
  // because they are only needed when building the PDF.
  const decoded = useRef(new Map<string, Blob>());
  const urls = useRef(new Set<string>());

  const track = (url: string) => {
    urls.current.add(url);
    return url;
  };

  // Free every object URL when the tool unmounts.
  useEffect(() => {
    const all = urls.current;
    return () => all.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const clearResult = useCallback(() => {
    setResult((r) => {
      if (r) URL.revokeObjectURL(r.url);
      return null;
    });
  }, []);

  const patch = (id: string, p: Partial<ImageItem>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...p } : it)));

  const addFiles = useCallback(
    (incoming: File[]) => {
      const images = incoming.filter(isImage);
      if (!images.length) return;
      clearResult();
      setError(null);

      const fresh: ImageItem[] = images.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        previewUrl: isHeic(file) ? null : track(URL.createObjectURL(file)),
        rotation: 0,
        width: null,
        height: null,
        error: null,
      }));

      setItems((list) => [...list, ...fresh].slice(0, MAX_IMAGES));

      // Read sizes (and decode HEIC) in the background.
      fresh.forEach(async (item) => {
        try {
          let blob: Blob = item.file;
          if (isHeic(item.file)) {
            const bytes = new Uint8Array(await item.file.arrayBuffer());
            const jpeg = await decodeHeic(bytes, 'JPEG', 0.92);
            blob = new Blob([jpeg.slice().buffer], { type: 'image/jpeg' });
            decoded.current.set(item.id, blob);
            patch(item.id, { previewUrl: track(URL.createObjectURL(blob)) });
          }
          const bmp = await createImageBitmap(blob);
          patch(item.id, { width: bmp.width, height: bmp.height });
          bmp.close();
        } catch {
          patch(item.id, {
            error:
              "This image couldn't be read. It may be damaged or in an unsupported format.",
          });
        }
      });
    },
    [clearResult],
  );

  const remove = useCallback(
    (id: string) => {
      clearResult();
      decoded.current.delete(id);
      setItems((list) => list.filter((it) => it.id !== id));
    },
    [clearResult],
  );

  const move = useCallback(
    (from: number, to: number) => {
      clearResult();
      setItems((list) => {
        if (to < 0 || to >= list.length || from === to) return list;
        const next = [...list];
        const [it] = next.splice(from, 1);
        next.splice(to, 0, it);
        return next;
      });
    },
    [clearResult],
  );

  const rotate = useCallback(
    (id: string) => {
      clearResult();
      setItems((list) =>
        list.map((it) =>
          it.id === id
            ? {
                ...it,
                rotation: ((it.rotation + 90) % 360) as ImageItem['rotation'],
              }
            : it,
        ),
      );
    },
    [clearResult],
  );

  const sortByName = useCallback(() => {
    clearResult();
    setItems((list) =>
      [...list].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      ),
    );
  }, [clearResult]);

  const clear = useCallback(() => {
    clearResult();
    decoded.current.clear();
    setItems([]);
    setError(null);
  }, [clearResult]);

  const build = useCallback(
    async (options: PdfOptions, fileName: string) => {
      const usable = items.filter((it) => !it.error);
      if (!usable.length) return;
      clearResult();
      setError(null);
      setBuilding(true);
      setProgress({ done: 0, total: usable.length });

      try {
        const pdf = await PDFDocument.create();
        pdf.setTitle(fileName.replace(/\.pdf$/i, ''));
        pdf.setCreator('Swift Converter Hub');
        pdf.setProducer('Swift Converter Hub (in-browser)');

        for (let i = 0; i < usable.length; i++) {
          const item = usable[i];
          const source = decoded.current.get(item.id) ?? item.file;
          const k = decoded.current.has(item.id) ? 'jpeg' : kind(item.file);
          const bytes = new Uint8Array(await source.arrayBuffer());

          // Embed the original bytes when nothing needs changing - this is
          // lossless and keeps the file small. Otherwise redraw on a canvas.
          const exifRotated = k === 'jpeg' && readJpegOrientation(bytes) !== 1;
          const direct =
            options.quality === 'original' &&
            item.rotation === 0 &&
            !exifRotated &&
            (k === 'jpeg' || k === 'png');

          let image;
          if (direct) {
            image =
              k === 'jpeg'
                ? await pdf.embedJpg(bytes)
                : await pdf.embedPng(bytes);
          } else {
            const { data, asPng } = await redraw(
              source,
              item.rotation,
              options,
              k,
            );
            image = asPng ? await pdf.embedPng(data) : await pdf.embedJpg(data);
          }

          const l = layoutPage(image.width, image.height, options);
          const page = pdf.addPage([l.pageWidth, l.pageHeight]);
          page.drawImage(image, {
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height,
          });

          setProgress({ done: i + 1, total: usable.length });
          // Let the UI paint between images on long batches.
          await new Promise((r) => setTimeout(r, 0));
        }

        const out = await pdf.save({ useObjectStreams: true });
        const blob = new Blob([out.slice().buffer], {
          type: 'application/pdf',
        });
        const name = /\.pdf$/i.test(fileName) ? fileName : `${fileName}.pdf`;
        setResult({
          url: URL.createObjectURL(blob),
          size: blob.size,
          pageCount: usable.length,
          fileName: name,
        });
      } catch (e) {
        setError(
          e instanceof Error
            ? `The PDF couldn't be created: ${e.message}`
            : "The PDF couldn't be created. Try removing the last image you added.",
        );
      } finally {
        setBuilding(false);
        setProgress(null);
      }
    },
    [items, clearResult],
  );

  return {
    items,
    isBuilding,
    progress,
    result,
    error,
    addFiles,
    remove,
    move,
    rotate,
    sortByName,
    clear,
    build,
    clearResult,
  };
}

/** Draw an image onto a canvas (applying EXIF orientation, extra rotation
 *  and optional downscaling) and export bytes pdf-lib can embed. */
async function redraw(
  source: Blob,
  rotation: number,
  options: PdfOptions,
  k: 'jpeg' | 'png' | 'other',
): Promise<{ data: Uint8Array; asPng: boolean }> {
  // createImageBitmap applies EXIF orientation ("from-image").
  const bmp = await createImageBitmap(source, {
    imageOrientation: 'from-image',
  });
  let w = bmp.width;
  let h = bmp.height;

  if (options.quality === 'compact') {
    const s = Math.min(1, COMPACT_MAX / Math.max(w, h));
    w = Math.round(w * s);
    h = Math.round(h * s);
  }

  const quarter = rotation === 90 || rotation === 270;
  const canvas = document.createElement('canvas');
  canvas.width = quarter ? h : w;
  canvas.height = quarter ? w : h;
  const ctx = canvas.getContext('2d')!;

  // Lossless sources that may carry transparency stay PNG unless the user
  // asked for a smaller file; everything else becomes JPEG on white.
  const asPng = options.quality === 'original' && k !== 'jpeg';
  if (!asPng) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(bmp, -w / 2, -h / 2, w, h);
  bmp.close();

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))),
      asPng ? 'image/png' : 'image/jpeg',
      options.quality === 'compact' ? 0.75 : 0.92,
    ),
  );
  return { data: new Uint8Array(await blob.arrayBuffer()), asPng };
}
