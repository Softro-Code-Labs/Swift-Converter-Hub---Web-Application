export interface ImageFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  aliases?: string[];
}

export interface ConversionRoute {
  source: string;
  target: string;
  title: string;
  description: string;
  keywords: string[];
  features: { icon: string; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

// ─── All Supported Formats ────────────────────────────────────────────────────

export const IMAGE_FORMATS: ImageFormat[] = [
  // ── Web & Photo ────────────────────────────────────────────────────────────
  {
    label: 'JPG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    description: 'Standard compressed photo format',
    aliases: ['jpg', 'jpeg', 'jfif'],
  },
  {
    label: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
    description: 'Lossless format with transparency',
    aliases: ['png'],
  },
  {
    label: 'WebP',
    extension: 'webp',
    mimeType: 'image/webp',
    description: 'Modern web format by Google',
    aliases: ['webp'],
  },
  {
    label: 'GIF',
    extension: 'gif',
    mimeType: 'image/gif',
    description: 'Animated & static graphics',
    aliases: ['gif'],
  },
  {
    label: 'AVIF',
    extension: 'avif',
    mimeType: 'image/avif',
    description: 'Next-gen high compression format',
    aliases: ['avif'],
  },
  {
    label: 'JXL',
    extension: 'jxl',
    mimeType: 'image/jxl',
    description: 'JPEG XL next-gen format',
    aliases: ['jxl'],
  },

  // ── Icon & System ──────────────────────────────────────────────────────────
  {
    label: 'ICO',
    extension: 'ico',
    mimeType: 'image/x-icon',
    description: 'Windows icon & favicon format',
    aliases: ['ico'],
  },
  {
    label: 'CUR',
    extension: 'cur',
    mimeType: 'image/vnd.microsoft.icon',
    description: 'Windows cursor file',
    aliases: ['cur'],
  },

  // ── Print & Professional ───────────────────────────────────────────────────
  {
    label: 'TIFF',
    extension: 'tiff',
    mimeType: 'image/tiff',
    description: 'High-quality print format',
    aliases: ['tiff', 'tif'],
  },
  {
    label: 'PDF',
    extension: 'pdf',
    mimeType: 'application/pdf',
    description: 'Portable document format',
    aliases: ['pdf'],
  },
  {
    label: 'EPS',
    extension: 'eps',
    mimeType: 'application/postscript',
    description: 'Encapsulated PostScript for print',
    aliases: ['eps', 'eps2', 'eps3', 'epsf', 'epsi'],
  },
  {
    label: 'PS',
    extension: 'ps',
    mimeType: 'application/postscript',
    description: 'PostScript document format',
    aliases: ['ps', 'ps2', 'ps3'],
  },
  {
    label: 'AI',
    extension: 'ai',
    mimeType: 'application/postscript',
    description: 'Adobe Illustrator format',
    aliases: ['ai'],
  },
  {
    label: 'FAX',
    extension: 'fax',
    mimeType: 'image/fax',
    description: 'CCITT FAX format',
    aliases: ['fax'],
  },
  {
    label: 'G3',
    extension: 'g3',
    mimeType: 'image/g3fax',
    description: 'Group 3 FAX format',
    aliases: ['g3'],
  },
  {
    label: 'G4',
    extension: 'g4',
    mimeType: 'image/g4fax',
    description: 'Group 4 FAX format',
    aliases: ['g4'],
  },

  // ── Bitmap Formats ─────────────────────────────────────────────────────────
  {
    label: 'BMP',
    extension: 'bmp',
    mimeType: 'image/bmp',
    description: 'Uncompressed Windows bitmap',
    aliases: ['bmp', 'bmp2', 'bmp3'],
  },
  {
    label: 'TGA',
    extension: 'tga',
    mimeType: 'image/x-tga',
    description: 'Game & 3D rendering format',
    aliases: ['tga'],
  },
  {
    label: 'PCX',
    extension: 'pcx',
    mimeType: 'image/x-pcx',
    description: 'Legacy PC Paintbrush format',
    aliases: ['pcx'],
  },
  {
    label: 'PICT',
    extension: 'pict',
    mimeType: 'image/x-pict',
    description: 'Apple PICT format',
    aliases: ['pict'],
  },
  {
    label: 'PSD',
    extension: 'psd',
    mimeType: 'image/vnd.adobe.photoshop',
    description: 'Adobe Photoshop document',
    aliases: ['psd', 'psb'],
  },
  {
    label: 'XCF',
    extension: 'xcf',
    mimeType: 'image/x-xcf',
    description: 'GIMP native format',
    aliases: ['xcf'],
  },
  {
    label: 'DDS',
    extension: 'dds',
    mimeType: 'image/vnd-ms.dds',
    description: 'DirectDraw Surface - game textures',
    aliases: ['dds'],
  },

  // ── Portable/Unix Formats ──────────────────────────────────────────────────
  {
    label: 'PBM',
    extension: 'pbm',
    mimeType: 'image/x-portable-bitmap',
    description: 'Portable bitmap (Linux/Unix)',
    aliases: ['pbm', 'pnm'],
  },
  {
    label: 'PGM',
    extension: 'pgm',
    mimeType: 'image/x-portable-graymap',
    description: 'Portable graymap format',
    aliases: ['pgm', 'pnm'],
  },
  {
    label: 'PPM',
    extension: 'ppm',
    mimeType: 'image/x-portable-pixmap',
    description: 'Portable pixmap format',
    aliases: ['ppm', 'pnm'],
  },
  {
    label: 'PNM',
    extension: 'pnm',
    mimeType: 'image/x-portable-anymap',
    description: 'Portable anymap (pbm/pgm/ppm)',
    aliases: ['pnm', 'pbm', 'pgm', 'ppm'],
  },
  {
    label: 'PAM',
    extension: 'pam',
    mimeType: 'image/x-portable-arbitrarymap',
    description: 'Portable arbitrary map format',
    aliases: ['pam'],
  },
  {
    label: 'PFM',
    extension: 'pfm',
    mimeType: 'image/x-portable-floatmap',
    description: 'Portable float map',
    aliases: ['pfm'],
  },
  {
    label: 'XBM',
    extension: 'xbm',
    mimeType: 'image/x-xbitmap',
    description: 'X11 bitmap for Linux icons',
    aliases: ['xbm'],
  },
  {
    label: 'XPM',
    extension: 'xpm',
    mimeType: 'image/x-xpixmap',
    description: 'X11 pixmap format',
    aliases: ['xpm'],
  },

  // ── HDR / Scientific ───────────────────────────────────────────────────────
  {
    label: 'HDR',
    extension: 'hdr',
    mimeType: 'image/vnd.radiance',
    description: 'Radiance HDR format',
    aliases: ['hdr', 'rgbe'],
  },
  {
    label: 'EXR',
    extension: 'exr',
    mimeType: 'image/x-exr',
    description: 'OpenEXR high dynamic range',
    aliases: ['exr'],
  },
  {
    label: 'DPX',
    extension: 'dpx',
    mimeType: 'image/x-dpx',
    description: 'Digital Picture Exchange (film)',
    aliases: ['dpx'],
  },
  {
    label: 'CIN',
    extension: 'cin',
    mimeType: 'image/x-cin',
    description: 'Kodak Cineon film format',
    aliases: ['cin'],
  },
  {
    label: 'FITS',
    extension: 'fits',
    mimeType: 'image/fits',
    description: 'Flexible Image Transport (astronomy)',
    aliases: ['fits', 'fts'],
  },

  // ── Mobile / Embedded ──────────────────────────────────────────────────────
  {
    label: 'HEIC',
    extension: 'heic',
    mimeType: 'image/heic',
    description: 'iPhone default photo format',
    aliases: ['heic', 'heif'],
  },
  {
    label: 'WBMP',
    extension: 'wbmp',
    mimeType: 'image/vnd.wap.wbmp',
    description: 'Wireless/mobile bitmap',
    aliases: ['wbmp'],
  },

  // ── Raw Camera ─────────────────────────────────────────────────────────────
  {
    label: 'DNG',
    extension: 'dng',
    mimeType: 'image/x-adobe-dng',
    description: 'Adobe Digital Negative RAW',
    aliases: ['dng'],
  },
  {
    label: 'CR2',
    extension: 'cr2',
    mimeType: 'image/x-canon-cr2',
    description: 'Canon RAW v2 format',
    aliases: ['cr2', 'crw'],
  },
  {
    label: 'NEF',
    extension: 'nef',
    mimeType: 'image/x-nikon-nef',
    description: 'Nikon RAW format',
    aliases: ['nef'],
  },
  {
    label: 'ARW',
    extension: 'arw',
    mimeType: 'image/x-sony-arw',
    description: 'Sony RAW format',
    aliases: ['arw'],
  },
  {
    label: 'ORF',
    extension: 'orf',
    mimeType: 'image/x-olympus-orf',
    description: 'Olympus RAW format',
    aliases: ['orf'],
  },
  {
    label: 'RAF',
    extension: 'raf',
    mimeType: 'image/x-fuji-raf',
    description: 'Fujifilm RAW format',
    aliases: ['raf'],
  },
  {
    label: 'RW2',
    extension: 'rw2',
    mimeType: 'image/x-panasonic-rw2',
    description: 'Panasonic RAW format',
    aliases: ['rw2'],
  },
  {
    label: 'PEF',
    extension: 'pef',
    mimeType: 'image/x-pentax-pef',
    description: 'Pentax RAW format',
    aliases: ['pef'],
  },
  {
    label: 'SRW',
    extension: 'srw',
    mimeType: 'image/x-samsung-srw',
    description: 'Samsung RAW format',
    aliases: ['srw'],
  },
  {
    label: 'X3F',
    extension: 'x3f',
    mimeType: 'image/x-sigma-x3f',
    description: 'Sigma RAW format',
    aliases: ['x3f'],
  },
  {
    label: 'MRW',
    extension: 'mrw',
    mimeType: 'image/x-minolta-mrw',
    description: 'Minolta RAW format',
    aliases: ['mrw'],
  },

  // ── Raw Pixel Data ─────────────────────────────────────────────────────────
  {
    label: 'GRAY',
    extension: 'gray',
    mimeType: 'image/x-gray',
    description: 'Raw grayscale pixels',
    aliases: ['gray'],
  },
  {
    label: 'GRAYA',
    extension: 'graya',
    mimeType: 'image/x-graya',
    description: 'Raw grayscale with alpha',
    aliases: ['graya'],
  },
  {
    label: 'RGB',
    extension: 'rgb',
    mimeType: 'image/x-rgb',
    description: 'Raw RGB pixel data',
    aliases: ['rgb'],
  },
  {
    label: 'RGBA',
    extension: 'rgba',
    mimeType: 'image/x-rgba',
    description: 'Raw RGBA pixel data',
    aliases: ['rgba'],
  },
  {
    label: 'RGBO',
    extension: 'rgbo',
    mimeType: 'image/x-rgbo',
    description: 'Raw RGBA with associated alpha',
    aliases: ['rgbo'],
  },
  {
    label: 'CMYK',
    extension: 'cmyk',
    mimeType: 'image/x-cmyk',
    description: 'Raw CMYK print color data',
    aliases: ['cmyk'],
  },
  {
    label: 'CMYKA',
    extension: 'cmyka',
    mimeType: 'image/x-cmyka',
    description: 'Raw CMYK with alpha',
    aliases: ['cmyka'],
  },
  {
    label: 'MONO',
    extension: 'mono',
    mimeType: 'image/x-mono',
    description: 'Raw 1-bit monochrome bitmap',
    aliases: ['mono'],
  },

  // ── Lossless / Multi-image ─────────────────────────────────────────────────
  {
    label: 'MNG',
    extension: 'mng',
    mimeType: 'image/x-mng',
    description: 'Multiple-image Network Graphics',
    aliases: ['mng'],
  },
  {
    label: 'JNG',
    extension: 'jng',
    mimeType: 'image/x-jng',
    description: 'JPEG Network Graphics',
    aliases: ['jng'],
  },
  {
    label: 'PNG-8',
    extension: 'png8',
    mimeType: 'image/png',
    description: '8-bit palette PNG - smaller file size',
    aliases: ['png8'],
  },
  {
    label: 'PNG-24',
    extension: 'png24',
    mimeType: 'image/png',
    description: '24-bit PNG without alpha channel',
    aliases: ['png24'],
  },
  {
    label: 'PNG-32',
    extension: 'png32',
    mimeType: 'image/png',
    description: '32-bit PNG with full alpha transparency',
    aliases: ['png32'],
  },
  {
    label: 'PNG-48',
    extension: 'png48',
    mimeType: 'image/png',
    description: '48-bit PNG - professional print quality',
    aliases: ['png48'],
  },
  {
    label: 'PNG-64',
    extension: 'png64',
    mimeType: 'image/png',
    description: '64-bit PNG - highest quality with alpha',
    aliases: ['png64'],
  },

  // ── JPEG 2000 ──────────────────────────────────────────────────────────────
  {
    label: 'JP2',
    extension: 'jp2',
    mimeType: 'image/jp2',
    description: 'JPEG 2000 containerized format',
    aliases: ['jp2', 'jpg2'],
  },
  {
    label: 'JPC',
    extension: 'jpc',
    mimeType: 'image/x-jpc',
    description: 'JPEG 2000 raw codestream',
    aliases: ['jpc', 'j2k', 'j2c'],
  },

  // ── Vector ─────────────────────────────────────────────────────────────────
  {
    label: 'SVG',
    extension: 'svg',
    mimeType: 'image/svg+xml',
    description: 'Scalable Vector Graphics',
    aliases: ['svg', 'svgz'],
  },
  {
    label: 'SVGZ',
    extension: 'svgz',
    mimeType: 'image/svg+xml',
    description: 'Compressed SVG format',
    aliases: ['svgz', 'svg'],
  },
  {
    label: 'MVG',
    extension: 'mvg',
    mimeType: 'image/x-mvg',
    description: 'Magick Vector Graphics',
    aliases: ['mvg'],
  },

  // ── Medical ────────────────────────────────────────────────────────────────
  {
    label: 'DCM',
    extension: 'dcm',
    mimeType: 'application/dicom',
    description: 'DICOM medical imaging format',
    aliases: ['dcm'],
  },
  {
    label: 'VICAR',
    extension: 'vicar',
    mimeType: 'image/x-vicar',
    description: 'NASA VICAR image format',
    aliases: ['vicar'],
  },

  // ── Legacy / Archive ───────────────────────────────────────────────────────
  {
    label: 'SGI',
    extension: 'sgi',
    mimeType: 'image/sgi',
    description: 'Silicon Graphics Image',
    aliases: ['sgi'],
  },
  {
    label: 'SUN',
    extension: 'sun',
    mimeType: 'image/x-sun-raster',
    description: 'Sun Rasterfile format',
    aliases: ['sun', 'ras'],
  },
  {
    label: 'RAS',
    extension: 'ras',
    mimeType: 'image/x-sun-raster',
    description: 'Sun Raster format',
    aliases: ['ras', 'sun'],
  },
  {
    label: 'VIFF',
    extension: 'viff',
    mimeType: 'image/x-viff',
    description: 'Khoros Visualization image',
    aliases: ['viff'],
  },
  {
    label: 'MIFF',
    extension: 'miff',
    mimeType: 'image/x-miff',
    description: 'ImageMagick native format',
    aliases: ['miff'],
  },
  {
    label: 'PALM',
    extension: 'palm',
    mimeType: 'image/palm',
    description: 'Palm Pilot image format',
    aliases: ['palm'],
  },
  {
    label: 'PDB',
    extension: 'pdb',
    mimeType: 'image/x-pdb',
    description: 'Palm Database ImageViewer',
    aliases: ['pdb'],
  },
  {
    label: 'TIM',
    extension: 'tim',
    mimeType: 'image/x-tim',
    description: 'PlayStation TIM texture format',
    aliases: ['tim'],
  },
  {
    label: 'HRZ',
    extension: 'hrz',
    mimeType: 'image/x-hrz',
    description: 'Slow-scan television format',
    aliases: ['hrz'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getFormatByExtension = (ext: string): ImageFormat | undefined =>
  IMAGE_FORMATS.find(
    (f) =>
      f.extension === ext.toLowerCase() ||
      f.aliases?.includes(ext.toLowerCase()),
  );

export const getTargetFormats = (sourceExtension: string): ImageFormat[] =>
  IMAGE_FORMATS.filter((f) => f.extension !== sourceExtension.toLowerCase());

export const isAcceptedByFormat = (
  fileExt: string,
  sourceExtension: string,
): boolean => {
  const format = getFormatByExtension(sourceExtension);
  if (!format) return false;
  const aliases = format.aliases ?? [format.extension];
  return aliases.includes(fileExt.toLowerCase());
};

// ─── Format category detection ────────────────────────────────────────────────
const isLossless = (ext: string) =>
  [
    'png',
    'png8',
    'png24',
    'png32',
    'png48',
    'png64',
    'tiff',
    'bmp',
    'psd',
    'xcf',
    'webp',
    'avif',
    'jxl',
    'exr',
    'hdr',
    'dpx',
    'cin',
  ].includes(ext);

const isCompressed = (ext: string) =>
  ['jpg', 'jpeg', 'webp', 'avif', 'jxl', 'heic', 'heif', 'gif'].includes(ext);

const isVector = (ext: string) =>
  ['svg', 'svgz', 'mvg', 'eps', 'ai', 'ps'].includes(ext);

const isRaw = (ext: string) =>
  [
    'cr2',
    'crw',
    'nef',
    'arw',
    'orf',
    'raf',
    'rw2',
    'pef',
    'srw',
    'x3f',
    'mrw',
    'dng',
  ].includes(ext);

const isDocument = (ext: string) => ['pdf', 'eps', 'ps', 'ai'].includes(ext);

const isWebOptimized = (ext: string) => ['webp', 'avif', 'jxl'].includes(ext);

// ─── Smart feature generation ─────────────────────────────────────────────────

const DEFAULT_FEATURES = (source: string, target: string) => {
  const src = source.toLowerCase();
  const tgt = target.toLowerCase();

  const qualityFeature = () => {
    if (isLossless(tgt))
      return {
        icon: '💎',
        title: 'Lossless Output Quality',
        description: `${target} is a lossless format - every pixel from your ${source} file is preserved exactly with no compression artifacts.`,
      };
    if (isCompressed(tgt))
      return {
        icon: '💎',
        title: 'Optimized Compression',
        description: `${target} uses advanced compression to keep file sizes small while maintaining excellent visual quality.`,
      };
    return {
      icon: '💎',
      title: 'High Quality Output',
      description: `Powered by ImageMagick WASM for accurate ${source} to ${target} conversion every time.`,
    };
  };

  const purposeFeature = () => {
    if (isWebOptimized(tgt))
      return {
        icon: '🌐',
        title: 'Web Performance Ready',
        description: `${target} is designed for the modern web - smaller file sizes mean faster page loads and better Core Web Vitals scores.`,
      };
    if (isDocument(tgt))
      return {
        icon: '📄',
        title: 'Document Ready Output',
        description: `Convert your ${source} image into a print-ready ${target} document, preserving dimensions and quality for professional use.`,
      };
    if (isRaw(src))
      return {
        icon: '📷',
        title: 'Camera RAW Supported',
        description: `Upload ${source} files straight from your camera - no need to pre-convert. The engine reads RAW data directly.`,
      };
    if (isVector(src))
      return {
        icon: '🔷',
        title: 'Vector Rasterization',
        description: `${source} vector graphics are rendered at full quality into ${target} raster pixels - scalable to any resolution.`,
      };
    return {
      icon: '⚡',
      title: 'Instant Conversion',
      description: `Your ${source} files convert to ${target} in seconds using WebAssembly - no waiting, no queues.`,
    };
  };

  return [
    {
      icon: '🔒',
      title: '100% Private - Nothing Uploaded',
      description: `Your ${source} files never leave your device. All conversion happens locally inside your browser using WebAssembly. Zero server contact.`,
    },
    {
      icon: '📦',
      title: 'Batch + ZIP Download',
      description: `Convert up to 20 ${source} files to ${target} at once and download them all as a single ZIP archive in one click.`,
    },
    qualityFeature(),
    purposeFeature(),
  ];
};

// ─── Smart FAQ generation ─────────────────────────────────────────────────────

const DEFAULT_FAQS = (source: string, target: string) => {
  const src = source.toLowerCase();
  const tgt = target.toLowerCase();

  const faqs = [
    {
      question: `How do I convert ${source} to ${target}?`,
      answer: `Upload your ${source} files by dragging them into the drop zone or clicking Browse. Select up to 20 files at once, then click Convert. Your files are processed locally in your browser and ready to download in seconds - no account or internet connection needed after the page loads.`,
    },
    {
      question: `Is it safe to convert my ${source} files here?`,
      answer: `Yes, completely safe. Unlike most online converters that upload your files to a remote server, this tool runs entirely in your browser using WebAssembly. Your files never leave your device and are never stored, logged, or transmitted anywhere.`,
    },
  ];

  // Quality-specific FAQ
  if (isLossless(tgt) && isCompressed(src)) {
    faqs.push({
      question: `Will converting ${source} to ${target} improve quality?`,
      answer: `Converting from ${source} to ${target} won't recover quality that was already lost during ${source} compression, but the output ${target} file will not introduce any new compression artifacts. From this point forward, editing and re-saving the ${target} file will preserve quality perfectly.`,
    });
  } else if (isCompressed(tgt) && isLossless(src)) {
    faqs.push({
      question: `Will my image lose quality when converting ${source} to ${target}?`,
      answer: `${target} uses lossy compression, so there will be some quality reduction compared to your original ${source} file. However, the compression is optimized to minimize visible differences. For web use the quality is typically excellent; for print or archival use, keep the original ${source} file.`,
    });
  } else if (isVector(src)) {
    faqs.push({
      question: `What resolution will the ${target} output be?`,
      answer: `When converting from a vector format like ${source}, ImageMagick renders at the dimensions defined in the file. For best results, ensure your ${source} file has an explicit width and height set. You can also pre-scale the vector before converting if you need a specific pixel size.`,
    });
  } else if (isRaw(src)) {
    faqs.push({
      question: `Does this support all ${source} camera files?`,
      answer: `${source} support depends on the WebAssembly build of ImageMagick included in this tool. Most common ${source} variants are supported. If your file fails, try converting it first using your camera's software or a desktop RAW editor, then use the resulting TIFF or JPG here.`,
    });
  } else if (isDocument(tgt)) {
    faqs.push({
      question: `What size will the ${target} output be?`,
      answer: `The ${target} output preserves your image at its original pixel dimensions. For print use, the physical size depends on your printer's DPI setting. For best print results, ensure your source image is at least 300 DPI at the intended print size.`,
    });
  } else {
    faqs.push({
      question: `What is the difference between ${source} and ${target}?`,
      answer: `${source} and ${target} are different image formats optimized for different use cases. The best choice depends on your specific needs - file size, quality requirements, transparency support, and where the image will be used.`,
    });
  }

  // Batch FAQ always included
  faqs.push({
    question: `Can I convert multiple ${source} files to ${target} at once?`,
    answer: `Yes - you can upload up to 20 ${source} files at once. They all convert simultaneously and you can download them individually or as a single ZIP bundle.`,
  });

  return faqs;
};

// ─── Route-specific SEO overrides ─────────────────────────────────────────────
const ROUTE_OVERRIDES: Partial<Record<string, Partial<ConversionRoute>>> = {
  'jpg-to-png': {
    title: 'Convert JPG to PNG Online - Free, High-Quality, Batch',
    description:
      'Convert JPG images to transparent PNG files instantly. Process your images safely inside your browser with zero server uploads. High-quality, fast batch conversion.',
    keywords: [
      'jpg to png',
      'jpeg to png',
      'convert jpg to png online',
      'change jpg to png background transparent',
      'batch jpg to png converter',
      'turn jpeg into png',
      'safe image converter online',
    ],
  },
  'png-to-jpg': {
    title: 'Convert PNG to JPG Online - Free, Fast Batch Conversion',
    description:
      'Compress and convert PNG images to high-quality JPG files. Reduce file sizes instantly without uploading images to a server. Best free batch PNG to JPG tool.',
    keywords: [
      'png to jpg',
      'png to jpeg',
      'convert png to jpg online free',
      'compress png to jpg without losing quality',
      'bulk png to jpg converter',
      'change png to jpeg',
      'save png as jpg',
    ],
  },
  'jpg-to-webp': {
    title: 'Convert JPG to WebP Online - Optimize for Web Performance',
    description:
      'Convert JPG or JPEG images to modern WebP format for faster page load speeds. Compress your images locally with no server uploads. Improve Core Web Vitals.',
    keywords: [
      'jpg to webp',
      'jpeg to webp',
      'convert jpg to webp online',
      'bulk jpeg to webp converter',
      'image to webp optimization',
      'next gen image format converter',
      'reduce image size for web',
    ],
  },
  'png-to-webp': {
    title: 'Convert PNG to WebP Online - Compress Web Images with Transparency',
    description:
      'Convert PNG files to WebP format while preserving alpha channel transparency. Shrink PNG file sizes up to 80% directly in your browser.',
    keywords: [
      'png to webp',
      'convert png to webp transparent',
      'png to webp online free',
      'reduce png size webp',
      'mass png to webp converter',
      'lossless png to webp conversion',
    ],
  },
  'jpg-to-ico': {
    title: 'Convert JPG to ICO Online - Free Favicon Generator',
    description:
      'Convert JPG images to Windows ICO format. Easily generate app icons, website favicons, and desktop shortcut icons instantly and privately.',
    keywords: [
      'jpg to ico',
      'jpeg to ico',
      'convert jpg to favicon',
      'create ico from jpg online',
      'free favicon generator',
      'convert image to windows icon file',
    ],
  },
  'heic-to-jpg': {
    title: 'Convert HEIC to JPG Online - Free iPhone Photo Converter',
    description:
      'Convert Apple HEIC photos to universal JPG format. Open and view your iPhone pictures on Windows. 100% offline, local browser processing.',
    keywords: [
      'heic to jpg',
      'heic to jpeg',
      'convert iphone photos to jpg',
      'heic converter for windows',
      'batch heic to jpg online free',
      'change apple .heic to .jpg',
      'open heic files',
    ],
  },
  'png-to-pdf': {
    title: 'Convert PNG to PDF Online - Free Image to PDF Document',
    description:
      'Convert and export PNG images into clean, print-ready PDF files. Safe, browser-side rendering ensures your documents remain completely private.',
    keywords: [
      'png to pdf',
      'convert png to pdf document',
      'png to pdf online free no upload',
      'image to pdf converter tool',
      'save multiple png as one pdf',
      'turn png into pdf',
    ],
  },
  'jpg-to-pdf': {
    title: 'Convert JPG to PDF Online - Turn Photos into PDF Documents',
    description:
      'Convert JPG and JPEG photos into secure PDF files. Perfect for printing, scanning, and portfolio assembly. Complete privacy with zero server uploads.',
    keywords: [
      'jpg to pdf',
      'jpeg to pdf converter',
      'convert jpg to pdf online',
      'photo to pdf document creator',
      'image to pdf free client side',
      'combine jpegs into pdf',
    ],
  },
  'svg-to-png': {
    title: 'Convert SVG to PNG Online - High-Resolution Vector Rasterizer',
    description:
      'Rasterize vector SVG graphics into high-quality pixel-perfect PNG images. Preserves clear paths and transparent backgrounds. Safe and instant.',
    keywords: [
      'svg to png',
      'convert svg to png',
      'svg to png online high resolution',
      'vector to png converter',
      'render svg to png transparent',
      'change .svg to .png',
    ],
  },
  'webp-to-jpg': {
    title: 'Convert WebP to JPG Online - Unblock and Save Web Images',
    description:
      'Convert modern web-native WebP images to universal JPG format. Easily save website graphics as traditional files. Fast, secure, and private.',
    keywords: [
      'webp to jpg',
      'webp to jpeg',
      'convert webp to jpg online',
      'unblock webp image to jpg',
      'save webp as jpg',
      'change webp file to jpeg format',
    ],
  },
  'webp-to-png': {
    title: 'Convert WebP to PNG Online - Extract Lossless Images with Alpha',
    description:
      'Convert WebP images to lossless PNG format with transparency channels intact. Fast browser processing via high-fidelity ImageMagick WASM.',
    keywords: [
      'webp to png',
      'convert webp to png transparent',
      'webp to png online free',
      'extract webp to png lossless',
      'change webp to png',
    ],
  },
  'bmp-to-jpg': {
    title: 'Convert BMP to JPG Online - Compress Legacy Bitmaps',
    description:
      'Convert raw uncompressed BMP bitmap images to optimized, lightweight JPG files. Instant conversion with no data files ever leaving your computer.',
    keywords: [
      'bmp to jpg',
      'bmp to jpeg',
      'convert bmp to jpg online',
      'compress windows bitmap to jpg',
      'bmp file size reduction',
    ],
  },
  'tiff-to-jpg': {
    title: 'Convert TIFF to JPG Online - Compress Master Print Images',
    description:
      'Convert heavy print-quality TIFF or TIF files to standard web-friendly compressed JPG format. Fast, private bulk processing directly in-browser.',
    keywords: [
      'tiff to jpg',
      'tif to jpg converter',
      'convert tiff to jpg online',
      'compress print tiff to jpeg',
      'batch tif to jpg',
    ],
  },
  'gif-to-png': {
    title: 'Convert GIF to PNG Online - Extract Frames & Graphics',
    description:
      'Convert static or animated GIF files to clear, alpha-transparent PNG layouts. Clean up visual distortion from legacy compression channels.',
    keywords: [
      'gif to png',
      'convert gif to png online',
      'gif to png transparent background',
      'extract frames from gif to png',
    ],
  },
  'psd-to-jpg': {
    title: 'Convert PSD to JPG Online - View Photoshop Files Free',
    description:
      'Convert Adobe Photoshop PSD layers into standard JPG flat files without needing a costly Creative Cloud subscription. local, private execution.',
    keywords: [
      'psd to jpg',
      'photoshop to jpg',
      'convert psd to jpg online free',
      'flatten psd to jpeg',
      'view psd files without photoshop',
    ],
  },
  'psd-to-png': {
    title:
      'Convert PSD to PNG Online - Flatten Photoshop Files with Transparency',
    description:
      'Convert Adobe Photoshop PSD files into clean PNG formats, retaining transparent composition elements. Quick browser-side extraction.',
    keywords: [
      'psd to png',
      'photoshop to png converter',
      'convert psd to png online',
      'psd to png transparent background',
      'extract layers from psd to png',
    ],
  },
  'avif-to-jpg': {
    title: 'Convert AVIF to JPG Online - Decode Next-Gen Files Universal',
    description:
      'Convert highly compressed next-generation AVIF images into standard JPG layouts compatible across older operating systems and device displays.',
    keywords: [
      'avif to jpg',
      'convert avif to jpg online',
      'avif to jpeg format decoder',
      'change avif image to jpg',
      'avif converter tool free',
    ],
  },
  'ico-to-png': {
    title: 'Convert ICO to PNG Online - Extract App and Web Favicons',
    description:
      'Convert Windows ICO files into high-resolution PNG transparent assets. Deconstruct complex system icons down to crisp graphic layouts instantly.',
    keywords: [
      'ico to png',
      'convert ico to png online',
      'extract icon file to transparent png',
      'ico layout converter',
      'favicon asset extractor',
    ],
  },
};

export const getConversionRoute = (
  source: string,
  target: string,
): ConversionRoute => {
  const key = `${source}-to-${target}`;
  const sourceLabel = source.toUpperCase();
  const targetLabel = target.toUpperCase();
  const override = ROUTE_OVERRIDES[key] ?? {};

  return {
    source,
    target,
    title:
      override.title ??
      `${sourceLabel} to ${targetLabel} Converter - Free Online Tool`,
    description:
      override.description ??
      `Convert ${sourceLabel} images to ${targetLabel} format free, fast, and privately in your browser.`,
    keywords: override.keywords ?? [
      `${source} to ${target}`,
      `convert ${source} to ${target}`,
      `${source} to ${target} online free`,
    ],
    features: override.features ?? DEFAULT_FEATURES(sourceLabel, targetLabel),
    faqs: override.faqs ?? DEFAULT_FAQS(sourceLabel, targetLabel),
  };
};

// All valid conversion pairs for static generation
export const ALL_CONVERSION_PAIRS = IMAGE_FORMATS.flatMap((source) =>
  IMAGE_FORMATS.filter((target) => target.extension !== source.extension).map(
    (target) => ({
      source: source.extension,
      target: target.extension,
    }),
  ),
);
