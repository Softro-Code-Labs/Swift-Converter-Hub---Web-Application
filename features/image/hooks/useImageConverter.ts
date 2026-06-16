import { useState } from 'react';
import {
  ImageMagick,
  MagickColor,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import { FileItem } from '@/features/image/types/converter';
import { formatBytes } from '../utils/formatBytes';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import { IMAGE_FORMATS, ImageFormat } from '../config/formats';

// ─── Complete ImageMagick WASM Format Map ─────────────────────────────────────

const FORMAT_MAP: Record<string, MagickFormat> = {
  // ── Web & Photo ────────────────────────────────────────────────────────────
  jpg: MagickFormat.Jpg,
  jpeg: MagickFormat.Jpeg,
  jfif: MagickFormat.Jpeg,
  png: MagickFormat.Png,
  webp: MagickFormat.WebP,
  gif: MagickFormat.Gif,
  avif: MagickFormat.Avif,
  jxl: MagickFormat.Jxl,

  // ── Icon & System ──────────────────────────────────────────────────────────
  ico: MagickFormat.Ico,
  cur: MagickFormat.Cur,

  // ── Print & Professional ───────────────────────────────────────────────────
  tiff: MagickFormat.Tiff,
  tif: MagickFormat.Tiff,
  pdf: MagickFormat.Pdf,
  eps: MagickFormat.Eps,
  eps2: MagickFormat.Eps2,
  eps3: MagickFormat.Eps3,
  epsf: MagickFormat.Epsf,
  epsi: MagickFormat.Epsi,
  ps: MagickFormat.Ps,
  ps2: MagickFormat.Ps2,
  ps3: MagickFormat.Ps3,
  ai: MagickFormat.Ai,
  fax: MagickFormat.Fax,
  g3: MagickFormat.G3,
  g4: MagickFormat.G4,

  // ── Bitmap Formats ─────────────────────────────────────────────────────────
  bmp: MagickFormat.Bmp,
  bmp2: MagickFormat.Bmp2,
  bmp3: MagickFormat.Bmp3,
  tga: MagickFormat.Tga,
  pcx: MagickFormat.Pcx,
  pict: MagickFormat.Pict,
  psd: MagickFormat.Psd,
  psb: MagickFormat.Psb,
  xcf: MagickFormat.Xcf,
  dds: MagickFormat.Dds,

  // ── Portable/Unix Formats ──────────────────────────────────────────────────
  pbm: MagickFormat.Pbm,
  pgm: MagickFormat.Pgm,
  ppm: MagickFormat.Ppm,
  pnm: MagickFormat.Pnm,
  pam: MagickFormat.Pam,
  pfm: MagickFormat.Pfm,
  xbm: MagickFormat.Xbm,
  xpm: MagickFormat.Xpm,

  // ── HDR / Scientific ───────────────────────────────────────────────────────
  hdr: MagickFormat.Hdr,
  rgbe: MagickFormat.Hdr,
  exr: MagickFormat.Exr,
  dpx: MagickFormat.Dpx,
  cin: MagickFormat.Cin,
  fits: MagickFormat.Fits,
  fts: MagickFormat.Fts,

  // ── Mobile / Embedded ──────────────────────────────────────────────────────
  heic: MagickFormat.Heic,
  heif: MagickFormat.Heif,
  wbmp: MagickFormat.Wbmp,

  // ── Raw Camera Formats (read via delegates) ────────────────────────────────
  crw: MagickFormat.Crw,
  cr2: MagickFormat.Cr2,
  nef: MagickFormat.Nef,
  orf: MagickFormat.Orf,
  arw: MagickFormat.Arw,
  dng: MagickFormat.Dng,
  mrw: MagickFormat.Mrw,
  raf: MagickFormat.Raf,
  rw2: MagickFormat.Rw2,
  pef: MagickFormat.Pef,
  srw: MagickFormat.Srw,
  x3f: MagickFormat.X3f,

  // ── Raw Data / Special ─────────────────────────────────────────────────────
  gray: MagickFormat.Gray,
  graya: MagickFormat.Graya,
  rgb: MagickFormat.Rgb,
  rgba: MagickFormat.Rgba,
  rgbo: MagickFormat.Rgbo,
  cmyk: MagickFormat.Cmyk,
  cmyka: MagickFormat.Cmyka,
  mono: MagickFormat.Mono,

  // ── Lossless / Specialty Web ───────────────────────────────────────────────
  mng: MagickFormat.Mng,
  jng: MagickFormat.Jng,
  png8: MagickFormat.Png8,
  png24: MagickFormat.Png24,
  png32: MagickFormat.Png32,
  png48: MagickFormat.Png48,
  png64: MagickFormat.Png64,

  // ── JPEG variants ──────────────────────────────────────────────────────────
  jpg2: MagickFormat.Jp2,
  jp2: MagickFormat.Jp2,
  jpc: MagickFormat.Jpc,
  j2k: MagickFormat.J2k,
  j2c: MagickFormat.J2c,

  // ── Vector ─────────────────────────────────────────────────────────────────
  svg: MagickFormat.Svg,
  svgz: MagickFormat.Svgz,
  mvg: MagickFormat.Mvg,

  // ── Medical ────────────────────────────────────────────────────────────────
  dcm: MagickFormat.Dcm,
  vicar: MagickFormat.Vicar,

  // ── Legacy / Archive ───────────────────────────────────────────────────────
  sgi: MagickFormat.Sgi,
  sun: MagickFormat.Sun,
  ras: MagickFormat.Ras,
  viff: MagickFormat.Viff,
  miff: MagickFormat.Miff,
  palm: MagickFormat.Palm,
  pdb: MagickFormat.Pdb,
  tim: MagickFormat.Tim,
  hrz: MagickFormat.Hrz,
};

// ─── Formats needing special handling on write ────────────────────────────────

const RESIZE_ON_WRITE: Partial<Record<MagickFormat, { w: number; h: number }>> =
  {
    [MagickFormat.Ico]: { w: 256, h: 256 },
    [MagickFormat.Wbmp]: { w: 96, h: 96 },
  };

// ─── Development Checks ─────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  IMAGE_FORMATS.forEach((f) => {
    if (!FORMAT_MAP[f.extension]) {
      console.warn(
        `IMAGE_FORMATS has "${f.extension}" but FORMAT_MAP does not`,
      );
    }
  });
  Object.keys(FORMAT_MAP).forEach((ext) => {
    const exists = IMAGE_FORMATS.some(
      (f) => f.extension === ext || f.aliases?.includes(ext),
    );
    if (!exists) {
      console.warn(
        `FORMAT_MAP has "${ext}" but no IMAGE_FORMATS entry covers it`,
      );
    }
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useImageConverter = (
  files: FileItem[],
  updateFile: (id: string, patch: Partial<FileItem>) => void,
  selectedTarget: ImageFormat,
  isMagickLoaded: boolean,
) => {
  const [isConvertingAll, setIsConvertingAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const getMagickFormat = (format: ImageFormat): MagickFormat => {
    const mapped = FORMAT_MAP[format.extension.toLowerCase()];
    if (!mapped) {
      console.warn(
        `No MagickFormat mapping for: ${format.extension}. Falling back to PNG.`,
      );
      return MagickFormat.Png;
    }
    return mapped;
  };

  const convertFile = async (
    item: FileItem,
  ): Promise<{ url: string; size: string }> => {
    const arrayBuffer = await item.file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const target = item.targetFormat ?? selectedTarget;
    const magickFormat = getMagickFormat(target);

    return new Promise((resolve, reject) => {
      try {
        ImageMagick.read(uint8Array, (image) => {
          // Hard resize for formats with dimension requirements
          const resizeTo = RESIZE_ON_WRITE[magickFormat];
          if (resizeTo) image.resize(resizeTo.w, resizeTo.h);

          // PDF doesn't support transparency — fill with white
          if (magickFormat === MagickFormat.Pdf) {
            image.backgroundColor = new MagickColor(255, 255, 255, 255);
          }

          image.write(magickFormat, (outputBytes) => {
            const blob = new Blob([new Uint8Array(outputBytes)], {
              type: target.mimeType,
            });
            resolve({
              url: URL.createObjectURL(blob),
              size: formatBytes(blob.size),
            });
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  };

  const convertAll = async () => {
    if (!isMagickLoaded) {
      toast.error('Please wait for the engine to finish initializing.');
      return;
    }
    setIsConvertingAll(true);

    for (const item of files) {
      if (item.status !== 'idle') continue;
      updateFile(item.id, { status: 'processing' });
      try {
        const result = await convertFile(item);
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        updateFile(item.id, {
          status: 'success',
          convertedUrl: result.url,
          outputSize: result.size,
          previewUrl: '',
        });
      } catch (err) {
        console.error(`Conversion failed for ${item.file.name}:`, err);
        updateFile(item.id, { status: 'error' });
      }
    }

    setIsConvertingAll(false);
    toast.success('All conversions complete!');
  };

  const downloadAll = async () => {
    const ready = files.filter((f) => f.status === 'success' && f.convertedUrl);
    if (!ready.length) return;

    setIsZipping(true);
    const zip = new JSZip();
    const ext = selectedTarget.extension;

    try {
      toast.loading('Building ZIP...', { id: 'zip' });
      for (const item of ready) {
        const blob = await fetch(item.convertedUrl!).then((r) => r.blob());
        const name = item.file.name.substring(
          0,
          item.file.name.lastIndexOf('.'),
        );
        zip.file(`${name}_converted.${ext}`, blob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `converted_${ext}_batch.zip`);
      toast.success('ZIP ready!', { id: 'zip' });
    } catch {
      toast.error('ZIP failed.', { id: 'zip' });
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: FileItem) => {
    if (!item.convertedUrl) return;
    const target = item.targetFormat ?? selectedTarget;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_converted.${target.extension}`;
    link.click();
  };

  return {
    isConvertingAll,
    isZipping,
    convertAll,
    downloadAll,
    downloadSingle,
  };
};
