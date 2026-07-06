import { useState } from 'react';
import {
  ImageMagick,
  MagickColor,
  MagickFormat,
} from '@imagemagick/magick-wasm';
import {
  isHeicSource,
  decodeHeic,
  toStandaloneBuffer,
  detectActualFormat,
} from './useHeicConverter';
import { FileItem } from '@/features/image/convert/types/converter';
import { formatBytes } from '../../shared/utils/bytes';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import toast from 'react-hot-toast';
import {
  CONVERSION_MATRIX,
  IMAGE_FORMATS,
  ImageFormat,
} from '../config/formats';

// --- Complete ImageMagick WASM Format Map -------------------------------------

const FORMAT_MAP: Record<string, MagickFormat> = {
  // -- Web & Photo ------------------------------------------------------------
  jpg: MagickFormat.Jpg,
  jpeg: MagickFormat.Jpeg,
  jfif: MagickFormat.Jpeg,
  jpe: MagickFormat.Jpe,
  jps: MagickFormat.Jps,
  pjpeg: MagickFormat.Pjpeg,
  png: MagickFormat.Png,
  webp: MagickFormat.WebP,
  gif: MagickFormat.Gif,
  avif: MagickFormat.Avif,
  jxl: MagickFormat.Jxl,
  qoi: MagickFormat.Qoi,

  // -- Animated / Multi-frame -------------------------------------------------
  mng: MagickFormat.Mng,
  jng: MagickFormat.Jng,

  // -- JPEG 2000 --------------------------------------------------------------
  jp2: MagickFormat.Jp2,
  jpg2: MagickFormat.Jp2,
  jpc: MagickFormat.Jpc,
  j2k: MagickFormat.J2k,
  j2c: MagickFormat.J2c,
  jpm: MagickFormat.Jpm,

  // -- PNG Variants -----------------------------------------------------------
  png8: MagickFormat.Png8,
  png24: MagickFormat.Png24,
  png32: MagickFormat.Png32,
  png48: MagickFormat.Png48,
  png64: MagickFormat.Png64,
  png00: MagickFormat.Png00,

  // -- HEIF / HEIC -----------------------------------------------------------
  heic: MagickFormat.Heic,
  heif: MagickFormat.Heif,

  // -- Bitmap ----------------------------------------------------------------
  bmp: MagickFormat.Bmp,
  bmp2: MagickFormat.Bmp2,
  bmp3: MagickFormat.Bmp3,
  tga: MagickFormat.Tga,
  pcx: MagickFormat.Pcx,
  dcx: MagickFormat.Dcx,
  wbmp: MagickFormat.Wbmp,
  xbm: MagickFormat.Xbm,
  xpm: MagickFormat.Xpm,
  otb: MagickFormat.Otb,
  farbfeld: MagickFormat.Farbfeld,
  avs: MagickFormat.Avs,
  cip: MagickFormat.Cip,
  sgi: MagickFormat.Sgi,
  sun: MagickFormat.Sun,
  ras: MagickFormat.Ras,
  wpg: MagickFormat.Wpg,
  picon: MagickFormat.Picon,
  art: MagickFormat.Art,
  aai: MagickFormat.Aai,
  viff: MagickFormat.Viff,
  hrz: MagickFormat.Hrz,
  vicar: MagickFormat.Vicar,

  // -- GIMP ------------------------------------------------------------------
  xcf: MagickFormat.Xcf,

  // -- Photoshop / Layered ---------------------------------------------------
  psd: MagickFormat.Psd,
  psb: MagickFormat.Psb,

  // -- Tagged Image ---------------------------------------------------------
  tiff: MagickFormat.Tiff,
  tiff64: MagickFormat.Tiff64,
  tif: MagickFormat.Tif,
  ptif: MagickFormat.Ptif,

  // -- Portable Bitmap / Pixmap / Anymap -------------------------------------
  pbm: MagickFormat.Pbm,
  pgm: MagickFormat.Pgm,
  ppm: MagickFormat.Ppm,
  pnm: MagickFormat.Pnm,
  pam: MagickFormat.Pam,
  pfm: MagickFormat.Pfm,
  phm: MagickFormat.Phm,

  // -- Vector / PostScript ---------------------------------------------------
  svg: MagickFormat.Svg,
  svgz: MagickFormat.Svgz,
  ai: MagickFormat.Ai,
  eps: MagickFormat.Eps,
  eps2: MagickFormat.Eps2,
  eps3: MagickFormat.Eps3,
  epsf: MagickFormat.Epsf,
  epsi: MagickFormat.Epsi,
  epi: MagickFormat.Epi,
  ept: MagickFormat.Ept,
  ps: MagickFormat.Ps,
  ps2: MagickFormat.Ps2,
  ps3: MagickFormat.Ps3,
  mvg: MagickFormat.Mvg,

  // -- Document --------------------------------------------------------------
  pdf: MagickFormat.Pdf,
  epdf: MagickFormat.Epdf,
  pict: MagickFormat.Pict,
  pcl: MagickFormat.Pcl,

  // -- HDR / Scientific ------------------------------------------------------
  exr: MagickFormat.Exr,
  hdr: MagickFormat.Hdr,
  rgbe: MagickFormat.Hdr,
  dpx: MagickFormat.Dpx,
  cin: MagickFormat.Cin,
  fits: MagickFormat.Fits,
  fts: MagickFormat.Fts,
  fl32: MagickFormat.Fl32,

  // --- RAW Digital Camera ---------------------------------------------------
  cr2: MagickFormat.Cr2,
  cr3: MagickFormat.Cr3,
  nef: MagickFormat.Nef,
  arw: MagickFormat.Arw,
  dng: MagickFormat.Dng,
  orf: MagickFormat.Orf,
  rw2: MagickFormat.Rw2,
  pef: MagickFormat.Pef,
  srw: MagickFormat.Srw,
  x3f: MagickFormat.X3f,
  mrw: MagickFormat.Mrw,
  dcr: MagickFormat.Dcr,
  mdc: MagickFormat.Mdc,
  srf: MagickFormat.Srf,
  sr2: MagickFormat.Sr2,
  raf: MagickFormat.Raf,
  crw: MagickFormat.Crw,
  mef: MagickFormat.Mef,
  iiq: MagickFormat.Iiq,

  // -- Fax / Compression -----------------------------------------------------
  fax: MagickFormat.Fax,
  g3: MagickFormat.G3,
  g4: MagickFormat.G4,
  group4: MagickFormat.Group4,
  cals: MagickFormat.Cals,

  // -- Game / DirectX --------------------------------------------------------
  dds: MagickFormat.Dds,

  // -- Medical ---------------------------------------------------------------
  dcm: MagickFormat.Dcm,

  // -- Raw Color Spaces ------------------------------------------------------
  rgb: MagickFormat.Rgb,
  rgba: MagickFormat.Rgba,
  rgbo: MagickFormat.Rgbo,
  rgb565: MagickFormat.Rgb565,
  gray: MagickFormat.Gray,
  graya: MagickFormat.Graya,
  cmyk: MagickFormat.Cmyk,
  cmyka: MagickFormat.Cmyka,
  yuv: MagickFormat.Yuv,
  ycbcr: MagickFormat.Ycbcr,
  ycbcra: MagickFormat.Ycbcra,
  uyvy: MagickFormat.Uyvy,
  mono: MagickFormat.Mono,

  // -- Icon & System ---------------------------------------------------------
  ico: MagickFormat.Ico,
  cur: MagickFormat.Cur,
  palm: MagickFormat.Palm,
  plam: MagickFormat.Palm,
  pdb: MagickFormat.Pdb,
  pcd: MagickFormat.Pcd,
  pcds: MagickFormat.Pcds,

  // -- Braille / Accessibility -----------------------------------------------
  brf: MagickFormat.Brf,
  ubrl: MagickFormat.Ubrl,
  ubrl6: MagickFormat.Ubrl6,
  uil: MagickFormat.Uil,
  isobrl: MagickFormat.Isobrl,
  isobrl6: MagickFormat.Isobrl6,

  // -- Text / Metadata Output ------------------------------------------------
  txt: MagickFormat.Txt,
  ftxt: MagickFormat.Ftxt,
  info: MagickFormat.Info,
  json: MagickFormat.Json,
  yaml: MagickFormat.Yaml,
  shtml: MagickFormat.Shtml,

  // -- Magick Internal -------------------------------------------------------
  miff: MagickFormat.Miff,
  mpc: MagickFormat.Mpc,
  mat: MagickFormat.Mat,
  sf3: MagickFormat.Sf3,
  mtv: MagickFormat.Mtv,
  sparsecolor: MagickFormat.SparseColor,
};

// --- Formats needing special handling on write --------------------------------

const RESIZE_ON_WRITE: Partial<Record<MagickFormat, { w: number; h: number }>> =
  {
    [MagickFormat.Ico]: { w: 256, h: 256 },
    [MagickFormat.Wbmp]: { w: 96, h: 96 },
  };

// --- Development Checks -----------------------------------------------------

if (process.env.NODE_ENV === 'development') {
  // Check IMAGE_FORMATS
  IMAGE_FORMATS.forEach((f) => {
    if (!FORMAT_MAP[f.extension]) {
      console.warn(
        `IMAGE_FORMATS has "${f.extension}" but FORMAT_MAP does not`,
      );
    }
  });
  Object.keys(FORMAT_MAP).forEach((ext) => {
    const exists = IMAGE_FORMATS.some((f) => f.extension === ext);
    if (!exists) {
      console.warn(
        `FORMAT_MAP has "${ext}" but no IMAGE_FORMATS entry covers it`,
      );
    }
  });

  // Check CONVERSION_MATRIX
  const _allExts = new Set(IMAGE_FORMATS.map((f) => f.extension));
  Object.entries(CONVERSION_MATRIX).forEach(([src, rule]) => {
    if (!_allExts.has(src)) {
      console.warn(
        `[formats] CONVERSION_MATRIX source "${src}" not in IMAGE_FORMATS`,
      );
    }
    if (rule.mode === 'allow' || rule.mode === 'block') {
      rule.formats.forEach((tgt) => {
        if (!_allExts.has(tgt)) {
          console.warn(
            `[formats] CONVERSION_MATRIX["${src}"] target "${tgt}" not in IMAGE_FORMATS`,
          );
        }
      });
    }
  });
}

// --- Hook ---------------------------------------------------------------------

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
    const uint8Array = new Uint8Array(arrayBuffer.slice(0));
    const target = item.targetFormat ?? selectedTarget;
    const targetExt = target.extension.toLowerCase();
    const sourceExt = item.file.name.split('.').pop()?.toLowerCase() ?? '';

    // -- Detect real format from magic bytes -----------------------------------
    const actualFormat = detectActualFormat(uint8Array);

    // -- Case 1: Real HEIC/HEIF source → decode with heic2any -----------------
    if (isHeicSource(sourceExt) && actualFormat === 'heic') {
      if (['jpg', 'jpeg'].includes(targetExt)) {
        const decoded = await decodeHeic(uint8Array, 'JPEG', 0.92);
        const blob = new Blob([toStandaloneBuffer(decoded)], {
          type: 'image/jpeg',
        });
        return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
      }

      if (targetExt === 'png') {
        const decoded = await decodeHeic(uint8Array, 'PNG', 1);
        const blob = new Blob([toStandaloneBuffer(decoded)], {
          type: 'image/png',
        });
        return { url: URL.createObjectURL(blob), size: formatBytes(blob.size) };
      }

      // Any other target: HEIC → PNG → ImageMagick
      const decodedPng = await decodeHeic(uint8Array, 'PNG', 1);
      const magickFormat = getMagickFormat(target);

      return new Promise((resolve, reject) => {
        try {
          ImageMagick.read(decodedPng, (image) => {
            const resizeTo = RESIZE_ON_WRITE[magickFormat];
            if (resizeTo) image.resize(resizeTo.w, resizeTo.h);
            if (magickFormat === MagickFormat.Pdf)
              image.backgroundColor = new MagickColor(255, 255, 255, 255);

            image.write(magickFormat, (outputBytes) => {
              const blob = new Blob(
                [toStandaloneBuffer(new Uint8Array(outputBytes))],
                {
                  type: target.mimeType,
                },
              );
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
    }

    // -- Case 2: .heic extension but actually a different format ---------------
    // (e.g. someone renamed a WebP/PNG/JPEG to .heic)
    // Let ImageMagick handle it - it reads by magic bytes, not extension
    // Falls through to Case 3 below

    // -- Case 3: standard ImageMagick conversion -------------------------------
    const magickFormat = getMagickFormat(target);
    return new Promise((resolve, reject) => {
      try {
        ImageMagick.read(uint8Array, (image) => {
          const resizeTo = RESIZE_ON_WRITE[magickFormat];
          if (resizeTo) image.resize(resizeTo.w, resizeTo.h);
          if (magickFormat === MagickFormat.Pdf)
            image.backgroundColor = new MagickColor(255, 255, 255, 255);

          image.write(magickFormat, (outputBytes) => {
            const blob = new Blob(
              [toStandaloneBuffer(new Uint8Array(outputBytes))],
              {
                type: target.mimeType,
              },
            );
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
    const ext = (item as any).actualExt ?? target.extension;
    const name = item.file.name.substring(0, item.file.name.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = item.convertedUrl;
    link.download = `${name}_converted.${ext}`;
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
