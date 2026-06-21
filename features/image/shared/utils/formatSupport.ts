// --- Base vocabulary of extension groups ---------------------------------------
// Tools compose their own supported/blocked sets from these building blocks.

export const RASTER_PHOTO_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'jfif',
  'jpe',
  'png',
  'webp',
  'gif',
  'bmp',
]);

export const TIFF_EXTENSIONS = new Set(['tiff', 'tif']);

export const MODERN_EXTENSIONS = new Set(['avif', 'heic', 'heif']);

export const PROFESSIONAL_EXTENSIONS = new Set(['psd', 'psb', 'tga', 'svg']);

// Formats that are technically image/* but unusable for visual/raster operations
export const NON_RASTER_BLOCKLIST = new Set([
  'ico',
  'cur',
  'dcm',
  'exr',
  'hdr',
  'rgbe',
  'dpx',
  'cin',
  'fits',
  'fts',
  'pbm',
  'pgm',
  'ppm',
  'pnm',
  'pam',
  'pfm',
  'phm',
  'xbm',
  'xpm',
  'gray',
  'graya',
  'rgb',
  'rgba',
  'rgbo',
  'cmyk',
  'cmyka',
  'yuv',
  'ycbcr',
  'ycbcra',
  'uyvy',
  'mono',
  'wbmp',
  'hrz',
  'vicar',
  'viff',
  'miff',
  'mpc',
  'mat',
  'mtv',
  'sf3',
  'sparsecolor',
  'brf',
  'ubrl',
  'ubrl6',
  'uil',
  'isobrl',
  'isobrl6',
  'palm',
  'plam',
  'pdb',
  'pcd',
  'pcds',
  'pcl',
  'cals',
  'fax',
  'g3',
  'g4',
  'group4',
  'dds',
  'ps',
  'ps2',
  'ps3',
  'ai',
  'eps',
  'eps2',
  'eps3',
  'epsf',
  'epsi',
  'epi',
  'ept',
  'epdf',
  'pdf',
  'pict',
  'otb',
  'cip',
  'avs',
  'aai',
  'art',
  'wpg',
  'sgi',
  'sun',
  'ras',
  'farbfeld',
  'jbig2',
  'jng',
  'mng',
  'pcx',
  'dcx',
  'qoi',
  'fl32',
  'rgb565',
  'shtml',
  'txt',
  'ftxt',
  'json',
  'yaml',
  'info',
]);

// --- Per-tool supported sets -----------------------------------------------------

export const CONVERTER_BLOCKED = new Set<string>([]); // converter handles everything via the full FORMAT_MAP

export const CROP_SUPPORTED = new Set([
  ...RASTER_PHOTO_EXTENSIONS,
  ...TIFF_EXTENSIONS,
  'tga',
  'psd',
  'svg',
  'avif',
]);

export const COMPRESS_SUPPORTED = new Set([
  ...RASTER_PHOTO_EXTENSIONS,
  ...TIFF_EXTENSIONS,
  'avif',
  'heic',
  'heif',
]);

export const ADJUST_SUPPORTED = new Set([
  ...RASTER_PHOTO_EXTENSIONS,
  ...TIFF_EXTENSIONS,
  'avif',
  'heic',
  'heif',
]);

export const METADATA_SUPPORTED = new Set([
  'jpg',
  'jpeg',
  'jfif',
  ...TIFF_EXTENSIONS,
  'png',
  'webp',
  'heic',
  'heif',
]);

export const BASE64_SUPPORTED = null; // base64 accepts any image/* - no restriction needed

// --- Generic validator factory ---------------------------------------------------

interface ValidatorOptions {
  supported: Set<string> | null; // null = accept any image/*
  allowedMimes?: string[];
}

/**
 * Builds a file-validation function for a tool.
 * Checks extension against a blocklist first (catches mis-typed MIME types
 * like ICO which reports image/x-icon), then checks the supported allowlist,
 * then falls back to an explicit MIME allowlist if provided.
 */
export const createFormatValidator = ({
  supported,
  allowedMimes,
}: ValidatorOptions) => {
  return (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

    // Always reject formats known to be non-raster / unusable, regardless of tool
    if (NON_RASTER_BLOCKLIST.has(ext)) return false;

    // No restriction - any image/* MIME passes
    if (supported === null) {
      return file.type.toLowerCase().startsWith('image/');
    }

    if (supported.has(ext)) return true;

    if (allowedMimes?.includes(file.type.toLowerCase())) return true;

    return false;
  };
};

// --- Ready-made validators for each tool -----------------------------------------

export const isSupportedForCrop = createFormatValidator({
  supported: CROP_SUPPORTED,
  allowedMimes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/x-tga',
    'image/vnd.adobe.photoshop',
    'image/svg+xml',
    'image/avif',
  ],
});

export const isSupportedForCompress = createFormatValidator({
  supported: COMPRESS_SUPPORTED,
  allowedMimes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/heif',
  ],
});

export const isSupportedForAdjust = createFormatValidator({
  supported: ADJUST_SUPPORTED,
  allowedMimes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/avif',
    'image/heic',
    'image/heif',
  ],
});

export const isSupportedForMetadata = createFormatValidator({
  supported: METADATA_SUPPORTED,
  allowedMimes: [
    'image/jpeg',
    'image/tiff',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
  ],
});

export const isSupportedForBase64 = createFormatValidator({ supported: null });

// Display labels for dialogs / dropzones, derived once per tool
export const formatLabelsFor = (
  set: Set<string> | null,
  fallback: string[],
): string[] => {
  if (!set) return fallback;
  const labelMap: Record<string, string> = {
    jpg: 'JPG',
    jpeg: 'JPEG',
    png: 'PNG',
    webp: 'WebP',
    gif: 'GIF',
    bmp: 'BMP',
    tiff: 'TIFF',
    tif: 'TIFF',
    avif: 'AVIF',
    heic: 'HEIC',
    heif: 'HEIF',
    tga: 'TGA',
    psd: 'PSD',
    svg: 'SVG',
  };
  const seen = new Set<string>();
  const out: string[] = [];
  set.forEach((ext) => {
    const label = labelMap[ext] ?? ext.toUpperCase();
    if (!seen.has(label)) {
      seen.add(label);
      out.push(label);
    }
  });
  return out;
};
