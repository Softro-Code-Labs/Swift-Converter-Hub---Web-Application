export interface ImageFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
}

export interface ConversionRoute {
  source: string;
  target: string;
  title: string;
  description: string;
  keywords: string[];
  features: { icon: string; title: string; description: string }[];
  faqs: { q: string; a: string }[];
}

// --- All Supported Formats ----------------------------------------------------

export const IMAGE_FORMATS: ImageFormat[] = [
  // -- Web & Photo ------------------------------------------------------------
  {
    label: 'JPG',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    description: 'Standard photo format',
  },
  {
    label: 'JPEG',
    extension: 'jpeg',
    mimeType: 'image/jpeg',
    description: 'Standard photo format',
  },
  {
    label: 'JFIF',
    extension: 'jfif',
    mimeType: 'image/jpeg',
    description: 'JPEG interchange format',
  },
  {
    label: 'PNG',
    extension: 'png',
    mimeType: 'image/png',
    description: 'Lossless with transparency',
  },
  {
    label: 'WEBP',
    extension: 'webp',
    mimeType: 'image/webp',
    description: 'Modern web image format',
  },
  {
    label: 'GIF',
    extension: 'gif',
    mimeType: 'image/gif',
    description: 'Animated & indexed color',
  },
  {
    label: 'AVIF',
    extension: 'avif',
    mimeType: 'image/avif',
    description: 'AV1 compressed image',
  },
  {
    label: 'JXL',
    extension: 'jxl',
    mimeType: 'image/jxl',
    description: 'Next-gen JPEG format',
  },
  {
    label: 'QOI',
    extension: 'qoi',
    mimeType: 'image/qoi',
    description: 'Fast lossless image format',
  },
  {
    label: 'PJPEG',
    extension: 'pjpeg',
    mimeType: 'image/pjpeg',
    description: 'Progressive JPEG format',
  },
  {
    label: 'JPE',
    extension: 'jpe',
    mimeType: 'image/jpeg',
    description: 'JPEG photo variant',
  },
  {
    label: 'JPS',
    extension: 'jps',
    mimeType: 'image/jps',
    description: 'JPEG stereo pair',
  },

  // -- Animated / Multi-frame -------------------------------------------------
  {
    label: 'MNG',
    extension: 'mng',
    mimeType: 'image/x-mng',
    description: 'Multi-frame animation format',
  },
  {
    label: 'JNG',
    extension: 'jng',
    mimeType: 'image/jng',
    description: 'JPEG-based network graphics',
  },

  // -- JPEG 2000 --------------------------------------------------------------
  {
    label: 'JP2',
    extension: 'jp2',
    mimeType: 'image/jp2',
    description: 'JPEG 2000 wavelet image',
  },
  {
    label: 'JPG2',
    extension: 'jpg2',
    mimeType: 'image/jp2',
    description: 'JPEG 2000 codestream',
  },
  {
    label: 'JPC',
    extension: 'jpc',
    mimeType: 'image/jpc',
    description: 'JPEG 2000 raw stream',
  },
  {
    label: 'J2K',
    extension: 'j2k',
    mimeType: 'image/j2k',
    description: 'JPEG 2000 codestream',
  },
  {
    label: 'J2C',
    extension: 'j2c',
    mimeType: 'image/j2c',
    description: 'JPEG 2000 code stream',
  },
  {
    label: 'JPM',
    extension: 'jpm',
    mimeType: 'image/jpm',
    description: 'JPEG 2000 multi-layer',
  },

  // -- PNG Variants ----------------------------------------------------------
  {
    label: 'PNG8',
    extension: 'png8',
    mimeType: 'image/png',
    description: 'PNG 8-bit palette',
  },
  {
    label: 'PNG24',
    extension: 'png24',
    mimeType: 'image/png',
    description: 'PNG true color',
  },
  {
    label: 'PNG32',
    extension: 'png32',
    mimeType: 'image/png',
    description: 'PNG with full alpha',
  },
  {
    label: 'PNG48',
    extension: 'png48',
    mimeType: 'image/png',
    description: 'PNG 48-bit deep color',
  },
  {
    label: 'PNG64',
    extension: 'png64',
    mimeType: 'image/png',
    description: 'PNG 64-bit with alpha',
  },
  {
    label: 'PNG00',
    extension: 'png00',
    mimeType: 'image/png',
    description: 'PNG sub-format variant',
  },

  // -- HEIF / HEIC ------------------------------------------------------------
  {
    label: 'HEIC',
    extension: 'heic',
    mimeType: 'image/heic',
    description: 'High Efficiency Image Format',
  },
  {
    label: 'HEIF',
    extension: 'heif',
    mimeType: 'image/heif',
    description: 'High Efficiency Image Format',
  },

  // -- Bitmap ----------------------------------------------------------------
  {
    label: 'BMP',
    extension: 'bmp',
    mimeType: 'image/bmp',
    description: 'Windows bitmap',
  },
  {
    label: 'BMP2',
    extension: 'bmp2',
    mimeType: 'image/bmp',
    description: 'Windows bitmap v2',
  },
  {
    label: 'BMP3',
    extension: 'bmp3',
    mimeType: 'image/bmp',
    description: 'Windows bitmap v3',
  },
  {
    label: 'TGA',
    extension: 'tga',
    mimeType: 'image/x-tga',
    description: 'Truevision game texture',
  },
  {
    label: 'PCX',
    extension: 'pcx',
    mimeType: 'image/x-pcx',
    description: 'Legacy PC bitmap',
  },
  {
    label: 'DCX',
    extension: 'dcx',
    mimeType: 'image/vnd.dcx',
    description: 'Multi-page PCX format',
  },
  {
    label: 'WBMP',
    extension: 'wbmp',
    mimeType: 'image/vnd.wap.wbmp',
    description: 'Wireless monochrome bitmap',
  },
  {
    label: 'XBM',
    extension: 'xbm',
    mimeType: 'image/x-xbitmap',
    description: 'X11 monochrome bitmap',
  },
  {
    label: 'XPM',
    extension: 'xpm',
    mimeType: 'image/x-xpixmap',
    description: 'X11 color pixmap',
  },
  {
    label: 'SGI',
    extension: 'sgi',
    mimeType: 'image/sgi',
    description: 'Silicon Graphics image',
  },
  {
    label: 'SUN',
    extension: 'sun',
    mimeType: 'image/x-sun-raster',
    description: 'Sun raster image',
  },
  {
    label: 'RAS',
    extension: 'ras',
    mimeType: 'image/x-sun-raster',
    description: 'Sun raster format',
  },
  {
    label: 'AVS',
    extension: 'avs',
    mimeType: 'image/avs',
    description: 'AVS X image',
  },
  {
    label: 'VIFF',
    extension: 'viff',
    mimeType: 'image/x-viff',
    description: 'Visualization image format',
  },
  {
    label: 'AAI',
    extension: 'aai',
    mimeType: 'image/aai',
    description: 'AAI Dune image',
  },
  {
    label: 'ART',
    extension: 'art',
    mimeType: 'image/art',
    description: 'AOL ART image',
  },
  {
    label: 'WPG',
    extension: 'wpg',
    mimeType: 'image/x-wpg',
    description: 'WordPerfect graphics',
  },
  {
    label: 'VICAR',
    extension: 'vicar',
    mimeType: 'image/x-vicar',
    description: 'NASA planetary image',
  },
  {
    label: 'HRZ',
    extension: 'hrz',
    mimeType: 'image/x-hrz',
    description: 'Slow-scan TV format',
  },
  {
    label: 'FARBFELD',
    extension: 'farbfeld',
    mimeType: 'image/vnd.farbfeld',
    description: 'Minimal raw image format',
  },
  {
    label: 'OTB',
    extension: 'otb',
    mimeType: 'image/x-otb',
    description: 'Over-the-air mobile bitmap',
  },
  {
    label: 'CIP',
    extension: 'cip',
    mimeType: 'image/vnd.cns.inf2',
    description: 'Cisco IP phone image',
  },
  {
    label: 'PICON',
    extension: 'picon',
    mimeType: 'image/picon',
    description: 'Personal icon format',
  },

  // -- GIMP ------------------------------------------------------------------
  {
    label: 'XCF',
    extension: 'xcf',
    mimeType: 'image/x-xcf',
    description: 'GIMP image',
  },

  // -- Photoshop -------------------------------------------------------------
  {
    label: 'PSD',
    extension: 'psd',
    mimeType: 'image/vnd.adobe.photoshop',
    description: 'Photoshop layered document',
  },
  {
    label: 'PSB',
    extension: 'psb',
    mimeType: 'image/vnd.adobe.photoshop',
    description: 'Photoshop large document',
  },

  // -- TIFF ------------------------------------------------------------------
  {
    label: 'TIFF',
    extension: 'tiff',
    mimeType: 'image/tiff',
    description: 'Tagged image, print quality',
  },
  {
    label: 'TIF',
    extension: 'tif',
    mimeType: 'image/tiff',
    description: 'Tagged image format',
  },
  {
    label: 'TIFF64',
    extension: 'tiff64',
    mimeType: 'image/tiff',
    description: 'BigTIFF large file format',
  },
  {
    label: 'PTIF',
    extension: 'ptif',
    mimeType: 'image/ptif',
    description: 'Pyramid tiled TIFF',
  },

  // -- Portable Bitmap / Pixmap -----------------------------------------------
  {
    label: 'PBM',
    extension: 'pbm',
    mimeType: 'image/x-portable-bitmap',
    description: 'Portable black & white',
  },
  {
    label: 'PGM',
    extension: 'pgm',
    mimeType: 'image/pgm',
    description: 'Portable grayscale map',
  },
  {
    label: 'PPM',
    extension: 'ppm',
    mimeType: 'image/x-portable-pixmap',
    description: 'Portable pixel map',
  },
  {
    label: 'PNM',
    extension: 'pnm',
    mimeType: 'image/x-portable-anymap',
    description: 'Portable any-map format',
  },
  {
    label: 'PAM',
    extension: 'pam',
    mimeType: 'image/x-pam',
    description: 'Portable arbitrary map',
  },
  {
    label: 'PFM',
    extension: 'pfm',
    mimeType: 'image/pfm',
    description: 'Portable float map',
  },
  {
    label: 'PHM',
    extension: 'phm',
    mimeType: 'image/phm',
    description: 'Portable half map',
  },

  // -- Vector / PostScript ---------------------------------------------------
  {
    label: 'SVG',
    extension: 'svg',
    mimeType: 'image/svg+xml',
    description: 'Scalable vector graphics',
  },
  {
    label: 'SVGZ',
    extension: 'svgz',
    mimeType: 'image/svg+xml',
    description: 'Compressed SVG vector',
  },
  {
    label: 'AI',
    extension: 'ai',
    mimeType: 'application/postscript',
    description: 'Adobe Illustrator artwork',
  },
  {
    label: 'EPS',
    extension: 'eps',
    mimeType: 'application/postscript',
    description: 'Encapsulated PostScript',
  },
  {
    label: 'EPS2',
    extension: 'eps2',
    mimeType: 'application/postscript',
    description: 'PostScript level 2',
  },
  {
    label: 'EPS3',
    extension: 'eps3',
    mimeType: 'application/postscript',
    description: 'PostScript level 3',
  },
  {
    label: 'EPSF',
    extension: 'epsf',
    mimeType: 'application/postscript',
    description: 'PostScript with preview',
  },
  {
    label: 'EPSI',
    extension: 'epsi',
    mimeType: 'application/postscript',
    description: 'PostScript interchange format',
  },
  {
    label: 'EPI',
    extension: 'epi',
    mimeType: 'application/postscript',
    description: 'Encapsulated PostScript interchange format',
  },
  {
    label: 'EPT',
    extension: 'ept',
    mimeType: 'application/postscript',
    description: 'EPS with TIFF preview',
  },
  {
    label: 'PS',
    extension: 'ps',
    mimeType: 'application/postscript',
    description: 'PostScript document',
  },
  {
    label: 'PS2',
    extension: 'ps2',
    mimeType: 'application/postscript',
    description: 'PostScript level 2 doc',
  },
  {
    label: 'PS3',
    extension: 'ps3',
    mimeType: 'application/postscript',
    description: 'PostScript level 3 doc',
  },
  {
    label: 'MVG',
    extension: 'mvg',
    description: 'Magick Vector Graphics',
    mimeType: 'image/x-magick-mvg',
  },

  // -- Document --------------------------------------------------------------
  {
    label: 'PDF',
    extension: 'pdf',
    mimeType: 'application/pdf',
    description: 'Portable document format',
  },
  {
    label: 'EPDF',
    extension: 'epdf',
    mimeType: 'image/x-epdf',
    description: 'Embedded PDF format',
  },
  {
    label: 'PICT',
    extension: 'pict',
    mimeType: 'image/pict',
    description: 'Mac QuickDraw picture',
  },
  {
    label: 'PCL',
    extension: 'pcl',
    mimeType: 'application/vnd.hp-pcl',
    description: 'HP printer language',
  },

  // -- HDR / Scientific ------------------------------------------------------
  {
    label: 'EXR',
    extension: 'exr',
    mimeType: 'image/x-exr',
    description: 'HDR film/VFX format',
  },
  {
    label: 'HDR',
    extension: 'hdr',
    mimeType: 'image/vnd.radiance',
    description: 'Radiance HDR image',
  },
  {
    label: 'RGBE',
    extension: 'rgbe',
    mimeType: 'image/vnd.radiance',
    description: 'Radiance exposure format',
  },
  {
    label: 'DPX',
    extension: 'dpx',
    mimeType: 'image/x-dpx',
    description: 'Digital cinema exchange',
  },
  {
    label: 'CIN',
    extension: 'cin',
    mimeType: 'image/x-cin',
    description: 'Kodak Cineon film scan',
  },
  {
    label: 'FITS',
    extension: 'fits',
    mimeType: 'image/fits',
    description: 'Astronomy image format',
  },
  {
    label: 'FTS',
    extension: 'fts',
    mimeType: 'image/fts',
    description: 'FITS scientific image',
  },
  {
    label: 'FL32',
    extension: 'fl32',
    mimeType: 'image/fl32',
    description: '32-bit float image',
  },

  // --- Raw Digital Camera -------------------------------------------------------
  {
    label: 'CR2',
    extension: 'cr2',
    mimeType: 'image/x-canon-cr2',
    description: 'Canon RAW format',
  },
  {
    label: 'CR3',
    extension: 'cr3',
    mimeType: 'image/x-canon-cr3',
    description: 'Canon RAW format',
  },
  {
    label: 'NEF',
    extension: 'nef',
    mimeType: 'image/x-nikon-nef',
    description: 'Nikon RAW format',
  },
  {
    label: 'ARW',
    extension: 'arw',
    mimeType: 'image/x-sony-arw',
    description: 'Sony RAW format',
  },
  {
    label: 'DNG',
    extension: 'dng',
    mimeType: 'image/x-adobe-dng',
    description: 'Adobe Digital Negative',
  },
  {
    label: 'ORF',
    extension: 'orf',
    description: 'Olympus RAW Format',
    mimeType: 'image/x-olympus-orf',
  },
  {
    label: 'RW2',
    extension: 'rw2',
    description: 'Panasonic RAW 2',
    mimeType: 'image/x-panasonic-rw2',
  },
  {
    label: 'PEF',
    extension: 'pef',
    description: 'Pentax Electronic Format',
    mimeType: 'image/x-pentax-pef',
  },
  {
    label: 'SRW',
    extension: 'srw',
    description: 'Samsung RAW',
    mimeType: 'image/x-samsung-srw',
  },
  {
    label: 'X3F',
    extension: 'x3f',
    description: 'Sigma RAW',
    mimeType: 'image/x-sigma-x3f',
  },
  {
    label: 'MRW',
    extension: 'mrw',
    description: 'Minolta RAW',
    mimeType: 'image/x-minolta-mrw',
  },
  {
    label: 'DCR',
    extension: 'dcr',
    description: 'Kodak RAW',
    mimeType: 'image/x-kodak-dcr',
  },
  {
    label: 'MDC',
    extension: 'mdc',
    description: 'Minolta DiMAGE RAW',
    mimeType: 'image/x-minolta-mdc',
  },
  {
    label: 'SRF',
    extension: 'srf',
    description: 'Sony RAW Format',
    mimeType: 'image/x-sony-srf',
  },
  {
    label: 'SR2',
    extension: 'sr2',
    description: 'Sony RAW 2',
    mimeType: 'image/x-sony-sr2',
  },
  {
    label: 'RAF',
    extension: 'raf',
    description: 'Fujifilm RAW',
    mimeType: 'image/x-fuji-raf',
  },
  {
    label: 'CRW',
    extension: 'crw',
    description: 'Canon RAW original',
    mimeType: 'image/x-canon-crw',
  },
  {
    label: 'MEF',
    extension: 'mef',
    description: 'Mamiya RAW',
    mimeType: 'image/x-mamiya-mef',
  },
  {
    label: 'IIQ',
    extension: 'iiq',
    description: 'Phase One RAW',
    mimeType: 'image/x-phaseone-iiq',
  },

  // -- Fax / Compression -----------------------------------------------------
  {
    label: 'FAX',
    extension: 'fax',
    mimeType: 'image/fax',
    description: 'Group 3 fax image',
  },
  {
    label: 'G3',
    extension: 'g3',
    mimeType: 'image/g3fax',
    description: 'Group 3 fax compression',
  },
  {
    label: 'G4',
    extension: 'g4',
    mimeType: 'image/g4fax',
    description: 'Group 4 fax compression',
  },
  {
    label: 'GROUP4',
    extension: 'group4',
    mimeType: 'image/group4',
    description: 'CCITT Group 4 bilevel',
  },
  {
    label: 'CALS',
    extension: 'cals',
    mimeType: 'image/x-cals',
    description: 'Military raster format',
  },

  // -- Game / DirectX --------------------------------------------------------
  {
    label: 'DDS',
    extension: 'dds',
    mimeType: 'image/vnd-ms.dds',
    description: 'DirectX GPU texture',
  },

  // -- Medical --------------------------------------------------------------
  {
    label: 'DCM',
    extension: 'dcm',
    description: 'Digital Imaging and Communications in Medicine',
    mimeType: 'application/dicom',
  },

  // -- Raw Color Spaces ------------------------------------------------------
  {
    label: 'RGB',
    extension: 'rgb',
    mimeType: 'image/x-rgb',
    description: 'Raw RGB pixel data',
  },
  {
    label: 'RGBA',
    extension: 'rgba',
    mimeType: 'image/x-rgba',
    description: 'Raw RGB with alpha',
  },
  {
    label: 'RGBO',
    extension: 'rgbo',
    mimeType: 'image/x-rgbo',
    description: 'RGB opacity channel',
  },
  {
    label: 'RGB565',
    extension: 'rgb565',
    mimeType: 'image/x-rgb565',
    description: 'Packed 16-bit RGB',
  },
  {
    label: 'GRAY',
    extension: 'gray',
    mimeType: 'image/x-gray',
    description: 'Raw grayscale samples',
  },
  {
    label: 'GRAYA',
    extension: 'graya',
    mimeType: 'image/x-graya',
    description: 'Grayscale with alpha',
  },
  {
    label: 'CMYK',
    extension: 'cmyk',
    mimeType: 'image/x-cmyk',
    description: 'Raw CMYK print data',
  },
  {
    label: 'CMYKA',
    extension: 'cmyka',
    mimeType: 'image/x-cmyka',
    description: 'CMYK with alpha channel',
  },
  {
    label: 'YUV',
    extension: 'yuv',
    mimeType: 'image/x-yuv',
    description: 'Raw YUV video data',
  },
  {
    label: 'YCBCR',
    extension: 'ycbcr',
    mimeType: 'image/x-ycbcr',
    description: 'YCbCr color space',
  },
  {
    label: 'YCBCRA',
    extension: 'ycbcra',
    mimeType: 'image/x-ycbcra',
    description: 'YCbCr with alpha',
  },
  {
    label: 'UYVY',
    extension: 'uyvy',
    mimeType: 'image/x-uyvy',
    description: 'Packed YUV 4:2:2',
  },
  {
    label: 'MONO',
    extension: 'mono',
    mimeType: 'image/x-mono',
    description: '1-bit monochrome bitmap',
  },

  // -- Icon & System ---------------------------------------------------------
  {
    label: 'ICO',
    extension: 'ico',
    mimeType: 'image/x-icon',
    description: 'Windows icon format',
  },
  {
    label: 'CUR',
    extension: 'cur',
    mimeType: 'image/x-cursor',
    description: 'Windows cursor format',
  },
  {
    label: 'PALM',
    extension: 'palm',
    mimeType: 'image/palm',
    description: 'Palm Pilot image',
  },
  {
    label: 'PLAM',
    extension: 'plam',
    mimeType: 'image/plam',
    description: 'Palm Pilot image',
  },
  {
    label: 'PDB',
    extension: 'pdb',
    mimeType: 'image/x-pdb',
    description: 'Palm database image',
  },
  {
    label: 'PCD',
    extension: 'pcd',
    mimeType: 'image/x-pcd',
    description: 'Kodak Photo CD',
  },
  {
    label: 'PCDS',
    extension: 'pcds',
    mimeType: 'image/x-pcds',
    description: 'Photo CD selector scan',
  },

  // -- Braille / Accessibility -----------------------------------------------
  {
    label: 'BRF',
    extension: 'brf',
    mimeType: 'image/x-bitmap',
    description: 'Braille ready format',
  },
  {
    label: 'UBRL',
    extension: 'ubrl',
    mimeType: 'image/x-ubrl',
    description: 'Unicode braille pattern',
  },
  {
    label: 'UBRL6',
    extension: 'ubrl6',
    mimeType: 'image/x-ubrl6',
    description: '6-dot unicode braille',
  },
  {
    label: 'UIL',
    extension: 'uil',
    mimeType: 'image/x-uil',
    description: 'Motif UI language bitmap',
  },
  {
    label: 'ISOBRL',
    extension: 'isobrl',
    mimeType: 'text/plain',
    description: 'ISO standard braille',
  },
  {
    label: 'ISOBRL6',
    extension: 'isobrl6',
    mimeType: 'text/plain',
    description: 'ISO 6-dot braille',
  },

  // -- Text / Metadata Output ------------------------------------------------
  {
    label: 'TXT',
    extension: 'txt',
    mimeType: 'text/plain',
    description: 'Image as pixel text',
  },
  {
    label: 'FTXT',
    extension: 'ftxt',
    mimeType: 'text/plain',
    description: 'Formatted pixel text',
  },
  {
    label: 'INFO',
    extension: 'info',
    mimeType: 'text/plain',
    description: 'Image metadata output',
  },
  {
    label: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    description: 'Image data as JSON',
  },
  {
    label: 'YAML',
    extension: 'yaml',
    mimeType: 'text/x-yaml',
    description: 'Image data as YAML',
  },
  {
    label: 'SHTML',
    extension: 'shtml',
    mimeType: 'text/html',
    description: 'Image as HTML table',
  },

  // -- Magick Internal -------------------------------------------------------
  {
    label: 'MIFF',
    extension: 'miff',
    mimeType: 'image/x-miff',
    description: 'Magick native format',
  },
  {
    label: 'MPC',
    extension: 'mpc',
    mimeType: 'image/x-mpc',
    description: 'Magick pixel cache',
  },
  {
    label: 'MAT',
    extension: 'mat',
    mimeType: 'application/octet-stream',
    description: 'MATLAB matrix image',
  },
  {
    label: 'SF3',
    extension: 'sf3',
    mimeType: 'image/x-sf3',
    description: 'FilmLight color format',
  },
  {
    label: 'MTV',
    extension: 'mtv',
    mimeType: 'image/x-mtv',
    description: 'MTV ray-trace format',
  },
  {
    label: 'SPARSECOLOR',
    extension: 'sparsecolor',
    mimeType: 'image/x-sparsecolor',
    description: 'Sparse color fill data',
  },
];

// --- Conversion Matrix --------------------------------------------------------

export type ConversionRule =
  | { mode: 'all' }
  | { mode: 'allow'; formats: string[] }
  | { mode: 'block'; formats: string[] };

const SOURCE_ONLY_EXTS = [
  'heic',
  'heif',
  'cr2',
  'cr3',
  'crw',
  'nef',
  'arw',
  'srf',
  'sr2',
  'raf',
  'orf',
  'rw2',
  'pef',
  'srw',
  'x3f',
  'mrw',
  'dcr',
  'mdc',
  'mef',
  'iiq',
  'dng',
  'dcm',
] as const;

export const CONVERSION_MATRIX: Record<string, ConversionRule> = {
  // -- Tier 1: Universal raster - block only browser-unencodable targets -------
  jpg: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jpeg: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jfif: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jpe: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png8: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png24: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png32: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png48: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png64: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  png00: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  webp: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  avif: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jxl: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  gif: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  bmp: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  bmp2: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  bmp3: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  tiff: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  tif: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  tiff64: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  ptif: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  tga: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  sgi: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  psd: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  psb: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  xcf: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  exr: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  hdr: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  rgbe: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  dpx: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  cin: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  dds: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  qoi: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  ico: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  cur: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jps: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  pjpeg: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  mng: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },
  jng: { mode: 'block', formats: [...SOURCE_ONLY_EXTS] },

  // -- HEIC / HEIF - source only, browser cannot encode back to HEIC -----------
  heic: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif'],
  },
  heif: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'tiff', 'bmp', 'gif'],
  },

  // -- JPEG 2000 family - raster output only ------------------------------------
  jp2: {
    mode: 'allow',
    formats: [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'png8',
      'png24',
      'png32',
      'tga',
      'sgi',
      'ppm',
      'pgm',
      'pbm',
    ],
  },
  jpg2: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  jpc: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  j2k: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  j2c: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  jpm: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },

  // -- RAW digital camera - raster output only ----------------------------------
  cr2: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  cr3: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  nef: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  arw: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  dng: {
    mode: 'allow',
    formats: [
      'jpg',
      'jpeg',
      'png',
      'png24',
      'png32',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'tga',
    ],
  },
  orf: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  rw2: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  pef: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  srw: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  x3f: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  mrw: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  dcr: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  mdc: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff'] },
  srf: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff'] },
  sr2: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff'] },
  raf: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },
  crw: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  mef: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp'],
  },
  iiq: {
    mode: 'allow',
    formats: ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'bmp', 'avif'],
  },

  // -- Vector / PostScript - raster + PDF/EPS output ----------------------------
  svg: {
    mode: 'allow',
    formats: [
      'png',
      'png8',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'pdf',
      'eps',
      'tga',
      'ppm',
      'ico',
    ],
  },
  svgz: {
    mode: 'allow',
    formats: [
      'png',
      'png8',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'pdf',
      'eps',
    ],
  },
  ai: {
    mode: 'allow',
    formats: [
      'png',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'tiff',
      'pdf',
      'eps',
      'bmp',
      'gif',
      'tga',
    ],
  },
  eps: {
    mode: 'allow',
    formats: [
      'png',
      'png8',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'pdf',
      'tga',
      'ppm',
      'ico',
    ],
  },
  eps2: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif', 'pdf'],
  },
  eps3: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif', 'pdf'],
  },
  epsf: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif', 'pdf'],
  },
  epsi: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif', 'pdf'],
  },
  epi: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  ept: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  ps: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif', 'pdf'],
  },
  ps2: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  ps3: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'pdf'],
  },
  mvg: {
    mode: 'allow',
    formats: [
      'png',
      'png8',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'pdf',
      'eps',
      'svg',
      'tga',
      'ppm',
      'ico',
    ],
  },

  // -- PDF - raster output + EPS passthrough ------------------------------------
  pdf: {
    mode: 'allow',
    formats: [
      'png',
      'png8',
      'png24',
      'png32',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'tga',
      'ppm',
      'ico',
      'eps',
    ],
  },
  epdf: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif'],
  },

  // -- Document / Print - limited raster output ---------------------------------
  pict: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'gif'],
  },
  pcl: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'] },

  // -- Portable bitmap family - raster targets only -----------------------------
  pbm: {
    mode: 'allow',
    formats: [
      'png',
      'jpg',
      'jpeg',
      'bmp',
      'tiff',
      'gif',
      'webp',
      'pgm',
      'ppm',
      'pnm',
    ],
  },
  pgm: {
    mode: 'allow',
    formats: [
      'png',
      'jpg',
      'jpeg',
      'bmp',
      'tiff',
      'gif',
      'webp',
      'pbm',
      'ppm',
      'pnm',
    ],
  },
  ppm: {
    mode: 'allow',
    formats: [
      'png',
      'jpg',
      'jpeg',
      'bmp',
      'tiff',
      'gif',
      'webp',
      'pbm',
      'pgm',
      'pnm',
    ],
  },
  pnm: {
    mode: 'allow',
    formats: [
      'png',
      'jpg',
      'jpeg',
      'bmp',
      'tiff',
      'gif',
      'webp',
      'pbm',
      'pgm',
      'ppm',
    ],
  },
  pam: {
    mode: 'allow',
    formats: ['png', 'png32', 'jpg', 'jpeg', 'tiff', 'webp', 'bmp'],
  },
  pfm: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'exr', 'hdr'] },
  phm: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'exr', 'hdr'] },

  // -- Raw color spaces - limited raster output ---------------------------------
  rgb: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'],
  },
  rgba: { mode: 'allow', formats: ['png', 'png32', 'webp', 'tiff', 'bmp'] },
  rgbo: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] },
  rgb565: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp'] },
  gray: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pgm', 'webp'],
  },
  graya: { mode: 'allow', formats: ['png', 'png32', 'webp', 'tiff'] },
  cmyk: { mode: 'allow', formats: ['jpg', 'jpeg', 'tiff', 'png', 'pdf'] },
  cmyka: { mode: 'allow', formats: ['tiff', 'png', 'pdf'] },
  yuv: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'bmp'] },
  ycbcr: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'tiff'] },
  ycbcra: { mode: 'allow', formats: ['png', 'tiff', 'webp'] },
  uyvy: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'bmp'] },
  mono: { mode: 'allow', formats: ['png', 'bmp', 'tiff', 'pbm', 'gif'] },

  // -- HDR / Scientific - raster output only ------------------------------------
  fits: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'],
  },
  fts: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] },
  fl32: {
    mode: 'allow',
    formats: ['png', 'tiff', 'exr', 'hdr', 'jpg', 'jpeg'],
  },

  // -- Fax / Compression --------------------------------------------------------
  fax: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf', 'gif'],
  },
  g3: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'] },
  g4: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'] },
  group4: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'pdf'],
  },
  cals: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] },

  // -- Legacy / Specialty -------------------------------------------------------
  pcx: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif', 'webp'],
  },
  dcx: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif'] },
  wbmp: { mode: 'allow', formats: ['png', 'bmp', 'jpg', 'jpeg', 'gif'] },
  xbm: { mode: 'allow', formats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'] },
  xpm: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff'] },
  sun: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif'] },
  ras: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif'] },
  avs: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'gif'] },
  viff: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] },
  aai: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp'] },
  art: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'gif'] },
  wpg: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff'] },
  vicar: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'fits', 'fts'],
  },
  hrz: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp'] },
  farbfeld: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff'] },
  otb: { mode: 'allow', formats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'] },
  picon: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'ico'],
  },
  cip: { mode: 'allow', formats: ['png', 'bmp', 'gif'] },

  // -- Icon / Palm / System -----------------------------------------------------
  palm: { mode: 'allow', formats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'] },
  plam: { mode: 'allow', formats: ['png', 'bmp', 'gif', 'jpg', 'jpeg'] },
  pdb: { mode: 'allow', formats: ['png', 'bmp', 'jpg', 'jpeg'] },
  pcd: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'tiff', 'bmp'] },
  pcds: { mode: 'allow', formats: ['jpg', 'jpeg', 'png', 'tiff', 'bmp'] },

  // -- Medical (DCM) -------------------------------------------------------------
  dcm: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'],
  },

  // -- Text / Metadata output ---------------------------------------------------
  txt: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff'] },
  ftxt: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp', 'tiff'] },
  info: { mode: 'allow', formats: ['json', 'txt', 'yaml'] },
  json: { mode: 'allow', formats: ['yaml', 'txt'] },
  yaml: { mode: 'allow', formats: ['json', 'txt'] },
  shtml: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp'] },

  // -- Magick internal ----------------------------------------------------------
  miff: {
    mode: 'allow',
    formats: [
      'png',
      'jpg',
      'jpeg',
      'webp',
      'avif',
      'tiff',
      'bmp',
      'gif',
      'tga',
    ],
  },
  mpc: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'bmp', 'gif'],
  },
  mat: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff'] },
  mtv: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'bmp'] },
  sf3: { mode: 'allow', formats: ['png', 'jpg', 'jpeg', 'tiff', 'exr'] },
  sparsecolor: {
    mode: 'allow',
    formats: ['png', 'jpg', 'jpeg', 'tiff', 'miff'],
  },

  // -- Braille / Accessibility --------------------------------------------------
  brf: { mode: 'allow', formats: ['png', 'bmp'] },
  ubrl: { mode: 'allow', formats: ['png', 'bmp'] },
  ubrl6: { mode: 'allow', formats: ['png', 'bmp'] },
  uil: { mode: 'allow', formats: ['png', 'bmp', 'xpm'] },
  isobrl: { mode: 'allow', formats: ['txt'] },
  isobrl6: { mode: 'allow', formats: ['txt'] },
};

// --- Helpers ------------------------------------------------------------------

export const getFormatByExtension = (ext: string): ImageFormat | undefined =>
  IMAGE_FORMATS.find((f) => f.extension === ext.toLowerCase());

export const getAllowedTargetFormats = (
  sourceExtension: string,
): ImageFormat[] => {
  const allowed = getAllowedTargets(sourceExtension);
  return IMAGE_FORMATS.filter(
    (f) =>
      f.extension !== sourceExtension.toLowerCase() && allowed.has(f.extension),
  );
};

export const getConversionHref = (source: string, target: string): string =>
  `/image/convert/${source}-to-${target}`;

export const isAcceptedByFormat = (
  fileExt: string,
  sourceExtension: string,
): boolean => {
  const format = getFormatByExtension(sourceExtension);
  if (!format) return false;
  const extensions = format.extension;
  return extensions.includes(fileExt.toLowerCase());
};

export function getAllowedTargets(sourceExt: string): Set<string> {
  const rule = CONVERSION_MATRIX[sourceExt.toLowerCase()];

  // No rule defined - default to all (safe fallback)
  if (!rule) return new Set(IMAGE_FORMATS.map((f) => f.extension));

  if (rule.mode === 'all') {
    return new Set(IMAGE_FORMATS.map((f) => f.extension));
  }

  if (rule.mode === 'allow') {
    return new Set(rule.formats);
  }

  // mode === 'block'
  const blocked = new Set(rule.formats);
  return new Set(
    IMAGE_FORMATS.map((f) => f.extension).filter((ext) => !blocked.has(ext)),
  );
}

export function isConversionAllowed(source: string, target: string): boolean {
  if (source === target) return false;
  const allowed = getAllowedTargets(source);
  return allowed.has(target.toLowerCase());
}

// --- Format category detection ------------------------------------------------

const isLossless = (ext: string) =>
  [
    // PNG family
    'png',
    'png8',
    'png24',
    'png32',
    'png48',
    'png64',
    'png00',
    // TIFF family
    'tiff',
    'tif',
    'tiff64',
    'ptif',
    // Bitmap
    'bmp',
    'bmp2',
    'bmp3',
    // Photoshop / GIMP
    'psd',
    'psb',
    'xcf',
    // Modern web (lossless modes)
    'webp',
    'avif',
    'jxl',
    // HDR / scientific
    'exr',
    'hdr',
    'rgbe',
    'dpx',
    'cin',
    'fits',
    'fts',
    'fl32',
    // Portable bitmap/pixmap
    'pam',
    'pbm',
    'pgm',
    'ppm',
    'pnm',
    'pfm',
    'phm',
    // Raw color spaces
    'rgb',
    'rgba',
    'rgbo',
    'gray',
    'graya',
    'cmyk',
    'cmyka',
    'mono',
    // Icon & system
    'ico',
    'cur',
    // Other lossless
    'qoi',
    'miff',
    'mpc',
    'sgi',
    'tga',
    'dds',
    'farbfeld',
    'xbm',
    'xpm',
    'wbmp',
    'sun',
    'ras',
    'avs',
    'viff',
    'aai',
    'vicar',
    'otb',
    'picon',
    'hrz',
    'wpg',
    'fax',
    'g3',
    'g4',
    'group4',
    'cals',
  ].includes(ext.toLowerCase());

const isCompressed = (ext: string) =>
  [
    // Lossy photo
    'jpg',
    'jpeg',
    'jpe',
    'jfif',
    'pjpeg',
    'jps',
    // Modern lossy
    'webp',
    'avif',
    'jxl',
    'heic',
    'heif',
    // Legacy compressed
    'gif',

    // Other compressed
    'mng',
    'jng',
    'pcx',
    'dcx',
    'art',
    'dcm',
  ].includes(ext.toLowerCase());

const isVector = (ext: string) =>
  [
    'svg',
    'svgz',
    'eps',
    'eps2',
    'eps3',
    'epsf',
    'epsi',
    'epi',
    'ept',
    'epdf',
    'ai',
    'ps',
    'ps2',
    'ps3',
    'mvg',
    'pdf',
    'pcl',
  ].includes(ext.toLowerCase());

const isRaw = (ext: string) =>
  [
    // Canon
    'cr2',
    'cr3',
    'crw',
    // Adobe
    'dng',
    // Nikon
    'nef',
    'nrw',
    // Sony
    'arw',
    'srf',
    'sr2',
    // Fujifilm
    'raf',
    // Olympus
    'orf',
    // Panasonic
    'rw2',
    // Pentax
    'pef',
    // Samsung
    'srw',
    // Sigma
    'x3f',
    // Minolta
    'mrw',
    'mdc',
    // Kodak
    'dcr',
    'kdc',
    // Hasselblad
    '3fr',
    // Leica
    'rwl',
    'raw',
    // Phase One
    'iiq',
    // Mamiya
    'mef',
    // Generic
    'erf',
    'mos',
  ].includes(ext.toLowerCase());

const isDocument = (ext: string) =>
  [
    'pdf',
    'epdf',
    'eps',
    'eps2',
    'eps3',
    'epsf',
    'epsi',
    'ept',
    'ps',
    'ps2',
    'ps3',
    'ai',
    'pcl',
    'pict',
  ].includes(ext.toLowerCase());

const isWebOptimized = (ext: string) =>
  ['webp', 'avif', 'jxl', 'heic', 'heif'].includes(ext.toLowerCase());

// --- Smart feature generation -------------------------------------------------

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
      description: `Powered by a professional WASM engine for accurate ${source} to ${target} conversion every time.`,
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

// --- Smart FAQ generation -----------------------------------------------------

const DEFAULT_FAQS = (source: string, target: string) => {
  const src = source.toLowerCase();
  const tgt = target.toLowerCase();

  const faqs = [
    {
      q: `How do I convert ${source} to ${target}?`,
      a: `Upload your ${source} files by dragging them into the drop zone or clicking Browse. Select up to 20 files at once, then click Convert. Your files are processed locally in your browser and ready to download in seconds - no account or internet connection needed after the page loads.`,
    },
    {
      q: `Is it safe to convert my ${source} files here?`,
      a: `Yes, completely safe. Unlike most online converters that upload your files to a remote server, this tool runs entirely in your browser using WebAssembly. Your files never leave your device and are never stored, logged, or transmitted anywhere.`,
    },
  ];

  // Quality-specific FAQ
  if (isLossless(tgt) && isCompressed(src)) {
    faqs.push({
      q: `Will converting ${source} to ${target} improve quality?`,
      a: `Converting from ${source} to ${target} won't recover quality that was already lost during ${source} compression, but the output ${target} file will not introduce any new compression artifacts. From this point forward, editing and re-saving the ${target} file will preserve quality perfectly.`,
    });
  } else if (isCompressed(tgt) && isLossless(src)) {
    faqs.push({
      q: `Will my image lose quality when converting ${source} to ${target}?`,
      a: `${target} uses lossy compression, so there will be some quality reduction compared to your original ${source} file. However, the compression is optimized to minimize visible differences. For web use the quality is typically excellent; for print or archival use, keep the original ${source} file.`,
    });
  } else if (isVector(src)) {
    faqs.push({
      q: `What resolution will the ${target} output be?`,
      a: `When converting from a vector format like ${source}, the engine renders at the dimensions defined in the file. For best results, ensure your ${source} file has an explicit width and height set. You can also pre-scale the vector before converting if you need a specific pixel size.`,
    });
  } else if (isRaw(src)) {
    faqs.push({
      q: `Does this support all ${source} camera files?`,
      a: `${source} support depends on the WebAssembly build of the image engine included in this tool. Most common ${source} variants are supported. If your file fails, try converting it first using your camera's software or a desktop RAW editor, then use the resulting TIFF or JPG here.`,
    });
  } else if (isDocument(tgt)) {
    faqs.push({
      q: `What size will the ${target} output be?`,
      a: `The ${target} output preserves your image at its original pixel dimensions. For print use, the physical size depends on your printer's DPI setting. For best print results, ensure your source image is at least 300 DPI at the intended print size.`,
    });
  } else {
    faqs.push({
      q: `What is the difference between ${source} and ${target}?`,
      a: `${source} and ${target} are different image formats optimized for different use cases. The best choice depends on your specific needs - file size, quality requirements, transparency support, and where the image will be used.`,
    });
  }

  // Batch FAQ always included
  faqs.push({
    q: `Can I convert multiple ${source} files to ${target} at once?`,
    a: `Yes - you can upload up to 20 ${source} files at once. They all convert simultaneously and you can download them individually or as a single ZIP bundle.`,
  });

  return faqs;
};

// --- Route-specific SEO overrides ---------------------------------------------

const ROUTE_OVERRIDES: Partial<Record<string, Partial<ConversionRoute>>> = {
  'jpg-to-png': {
    title: 'JPG to PNG Converter',
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
      'jpg to png transparent',
      'convert jpg to png free',
      'jpeg to png converter online',
      'bulk jpg to png conversion',
      'high quality jpg to png',
      'convert jpeg to png desktop',
      'offline jpg to png tool',
      'client side jpg to png',
      'transform jpg to png transparent',
      'free image converter jpg to png',
      'save jpeg as png format',
      'browser based jpg to png',
      'image file converter jpg png',
    ],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter',
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
      'png to jpg converter online',
      'batch png to jpeg tool',
      'reduce png to jpg file size',
      'free png to jpg converter without upload',
      'convert transparent png to jpg',
      'png to jpg high resolution',
      'client side png to jpg',
      'offline png to jpeg',
      'mass png to jpg converter',
      'best png to jpg conversion',
      'png format to jpg converter',
      'convert png file to jpeg format',
      'browser png to jpg compressor',
    ],
  },
  'jpg-to-webp': {
    title: 'JPG to WebP Converter',
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
      'jpg to webp conversion free',
      'convert jpeg to webp high quality',
      'batch jpg to webp compressor',
      'client side jpg to webp tool',
      'offline jpeg to webp converter',
      'optimize jpg to webp browser',
      'core web vitals image converter',
      'speed up website jpg to webp',
      'webp image maker from jpg',
      'save jpg as webp online',
      'free jpeg to webp converter',
      'mass jpg to webp conversion',
      'local browser jpg to webp',
    ],
  },
  'png-to-webp': {
    title: 'PNG to WebP Converter',
    description:
      'Convert PNG files to WebP format while preserving alpha channel transparency. Shrink PNG file sizes up to 80% directly in your browser.',
    keywords: [
      'png to webp',
      'convert png to webp transparent',
      'png to webp online free',
      'reduce png size webp',
      'mass png to webp converter',
      'lossless png to webp conversion',
      'png transparent to webp tool',
      'convert png to webp high quality',
      'batch png to webp creator',
      'client side png to webp',
      'offline png to webp conversion',
      'save transparent png as webp',
      'shrink png to webp online',
      'free png to webp converter',
      'browser based png to webp',
      'convert png images to webp format',
      'next gen png to webp optimization',
      'alpha channel png to webp',
      'bulk png to webp converter free',
      'local png to webp extension',
    ],
  },
  'jpg-to-ico': {
    title: 'JPG to ICO Converter',
    description:
      'Convert JPG images to Windows ICO format. Easily generate app icons, website favicons, and desktop shortcut icons instantly and privately.',
    keywords: [
      'jpg to ico',
      'jpeg to ico',
      'convert jpg to favicon',
      'create ico from jpg online',
      'free favicon generator',
      'convert image to windows icon file',
      'jpg to ico converter free',
      'make favicon from jpeg',
      'batch jpg to ico converter',
      'ico file generator from jpg',
      'client side jpg to ico',
      'offline jpeg to ico tool',
      'convert image to icon 16x16 32x32',
      'website icon maker from jpg',
      'app icon creator from jpeg',
      'windows 10 icon converter jpg',
      'convert photo to ico file',
      'browser based favicon creator',
      'save jpg as ico format',
      'secure favicon maker online',
    ],
  },
  'heic-to-jpg': {
    title: 'HEIC to JPG Converter',
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
      'heic to jpg online free',
      'bulk iphone photo converter',
      'convert heif to jpg',
      'heic to jpeg converter tool',
      'view heic on windows 10',
      'client side heic to jpg',
      'offline apple image converter',
      'mass heic to jpg free',
      'safe heic to jpg processing',
      'convert apple live photos to jpg',
      'heic to jpg high resolution',
      'browser heic to jpeg converter',
      'fix heic format to jpg',
    ],
  },
  'png-to-pdf': {
    title: 'PNG to PDF Converter',
    description:
      'Convert and export PNG images into clean, print-ready PDF files. Safe, browser-side rendering ensures your documents remain completely private.',
    keywords: [
      'png to pdf',
      'convert png to pdf document',
      'png to pdf online free no upload',
      'image to pdf converter tool',
      'save multiple png as one pdf',
      'turn png into pdf',
      'png to pdf converter online',
      'merge png into pdf document',
      'bulk png to pdf converter',
      'free image to pdf compiler',
      'client side png to pdf generator',
      'offline png to pdf reader',
      'convert transparent png to pdf',
      'high quality png to pdf print',
      'combine png photos into pdf',
      'convert image file to pdf format',
      'secure png to pdf workflow',
      'browser based png to pdf tool',
      'convert png graphics to pdf',
      'mass png to pdf software free',
    ],
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF Converter',
    description:
      'Convert JPG and JPEG photos into secure PDF files. Perfect for printing, scanning, and portfolio assembly. Complete privacy with zero server uploads.',
    keywords: [
      'jpg to pdf',
      'jpeg to pdf converter',
      'convert jpg to pdf online',
      'photo to pdf document creator',
      'image to pdf free client side',
      'combine jpegs into pdf',
      'jpg to pdf converter online free',
      'merge jpeg images into single pdf',
      'bulk photo to pdf converter',
      'convert jpg layout to pdf file',
      'offline jpg to pdf compiler',
      'secure scanner image to pdf',
      'high resolution jpg to pdf printable',
      'convert camera photos to pdf document',
      'make pdf from multiple jpegs',
      'browser based photo to pdf',
      'save jpeg as pdf document',
      'free jpg to pdf software online',
      'mass jpeg to pdf optimization',
      'convert picture files to pdf document',
    ],
  },
  'svg-to-png': {
    title: 'SVG to PNG Converter',
    description:
      'Rasterize vector SVG graphics into high-quality pixel-perfect PNG images. Preserves clear paths and transparent backgrounds. Safe and instant.',
    keywords: [
      'svg to png',
      'convert svg to png',
      'svg to png online high resolution',
      'vector to png converter',
      'render svg to png transparent',
      'change .svg to .png',
      'svg to png converter online free',
      'rasterize svg to transparent png',
      'batch svg to png renderer',
      'client side vector graphic rasterizer',
      'offline svg to png application',
      'convert svg paths to png pixels',
      'high fidelity svg to png scaling',
      'export svg as png icon',
      'browser based svg to png converter',
      'convert xml vector svg to png image',
      'save svg file as png format',
      'mass svg to png conversion utility',
      'vector scaling tool svg to png',
      'secure vector asset converter',
    ],
  },
  'webp-to-jpg': {
    title: 'WebP to JPG Converter',
    description:
      'Convert modern web-native WebP images to universal JPG format. Easily save website graphics as traditional files. Fast, secure, and private.',
    keywords: [
      'webp to jpg',
      'webp to jpeg',
      'convert webp to jpg online',
      'unblock webp image to jpg',
      'save webp as jpg',
      'change webp file to jpeg format',
      'webp to jpg converter free',
      'bulk webp to jpg compression',
      'convert webp image to traditional jpg',
      'client side webp to jpeg tool',
      'offline webp to jpg downloader',
      'fix webp image save as jpg',
      'mass webp to jpeg conversion',
      'high resolution webp to jpg converter',
      'browser native webp to jpg encoder',
      'convert extension webp to jpg',
      'unblock google webp images to jpeg',
      'free webp to jpg conversion script',
      'convert .webp to .jpg image',
      'secure webp to jpg processor',
    ],
  },
  'webp-to-png': {
    title: 'WebP to PNG Converter',
    description:
      'Convert WebP images to lossless PNG format with transparency channels intact. Fast browser processing via high-fidelity WASM engine.',
    keywords: [
      'webp to png',
      'convert webp to png transparent',
      'webp to png online free',
      'extract webp to png lossless',
      'change webp to png',
      'webp to png converter online high quality',
      'batch webp to transparent png',
      'client side webp to png extractor',
      'offline webp to png software',
      'save webp file as transparent png',
      'convert animated webp to png sequence',
      'wasm webp to png decoder',
      'mass webp to png lossless converter',
      'browser based webp to png render',
      'unblock webp transparency to png',
      'convert google image webp to png',
      'extract alpha channel webp to png',
      'free webp to png conversion tool',
      'local desktop quality webp to png',
      'convert extension .webp to .png',
    ],
  },
  'bmp-to-jpg': {
    title: 'BMP to JPG Converter',
    description:
      'Convert raw uncompressed BMP bitmap images to optimized, lightweight JPG files. Instant conversion with no data files ever leaving your computer.',
    keywords: [
      'bmp to jpg',
      'bmp to jpeg',
      'convert bmp to jpg online',
      'compress windows bitmap to jpg',
      'bmp file size reduction',
      'bmp to jpg converter online free',
      'batch bmp to jpeg compression',
      'client side bitmap to jpeg',
      'offline bmp to jpg tool',
      'convert legacy bmp to compressed jpg',
      'mass bmp to jpeg converter browser',
      'reduce uncompressed bitmap size',
      'save microsoft bmp as jpeg file',
      'free bmp to jpg encoder',
      'convert device independent bitmap to jpg',
      'high fidelity bmp to jpg extraction',
      'compress raw bmp to web friendly jpg',
      'browser based bmp to jpeg application',
      'convert extension .bmp to .jpg',
      'secure legacy asset converter bmp',
    ],
  },
  'tiff-to-jpg': {
    title: 'TIFF to JPG Converter',
    description:
      'Convert heavy print-quality TIFF or TIF files to standard web-friendly compressed JPG format. Fast, private bulk processing directly in-browser.',
    keywords: [
      'tiff to jpg',
      'tif to jpg converter',
      'convert tiff to jpg online',
      'compress print tiff to jpeg',
      'batch tif to jpg',
      'tiff to jpeg converter online free',
      'bulk raw tiff to compressed jpg',
      'client side tif to jpeg converter',
      'offline tiff to jpg compression',
      'convert print format tif to web jpg',
      'reduce multi page tiff to jpeg images',
      'mass tiff to jpg conversion',
      'save high res tiff as web image',
      'free tiff to jpg software browser',
      'convert extension .tiff to .jpg',
      'high dynamic range tiff to jpeg',
      'uncompressed tif file to jpeg size reduction',
      'wasm tiff to jpg',
      'secure master graphic file converter',
      'convert print ready tif to compressed jpeg',
    ],
  },
  'gif-to-png': {
    title: 'GIF to PNG Converter',
    description:
      'Convert static or animated GIF files to clear, alpha-transparent PNG layouts. Clean up visual distortion from legacy compression channels.',
    keywords: [
      'gif to png',
      'convert gif to png online',
      'gif to png transparent background',
      'extract frames from gif to png',
      'gif to png converter online free',
      'batch gif to transparent png conversion',
      'client side gif frame extractor to png',
      'offline animated gif to png layout',
      'turn static gif into crisp png',
      'remove artifact lines convert gif to png',
      'save graphical gif as alpha channel png',
      'free gif to png optimization script',
      'mass gif to png converter browser',
      'wasm powered gif to png texturing',
      'convert legacy graphics interchange format to png',
      'extract single layer from gif to png file',
      'unblock alpha layer convert gif png',
      'high definition pixel layout gif to png',
      'local file processing gif to png tool',
      'convert extension .gif to .png transparent',
    ],
  },
  'psd-to-jpg': {
    title: 'PSD to JPG Converter',
    description:
      'Convert Adobe Photoshop PSD layers into standard JPG flat files without needing a costly Creative Cloud subscription. local, private execution.',
    keywords: [
      'psd to jpg',
      'photoshop to jpg',
      'convert psd to jpg online free',
      'flatten psd to jpeg',
      'view psd files without photoshop',
      'psd to jpg converter online high resolution',
      'batch adobe psd to compressed jpeg',
      'client side psd layer flattener',
      'offline photoshop design to jpg converter',
      'extract layers preview psd as jpeg',
      'unblock layered psd to flat jpg asset',
      'mass psd to jpg layout configuration',
      'save big cloud psd as lightweight jpeg',
      'free photoshop utility to convert psd to jpg',
      'convert extension .psd to .jpg browser',
      'wasm script to open psd file as jpeg',
      'convert secure proprietary psd to open jpeg',
      'photoshop creative cloud free alternative psd jpg',
      'extract artboards from psd to separate jpgs',
      'high accuracy color workspace psd to jpeg conversion',
    ],
  },
  'psd-to-png': {
    title: 'PSD to PNG Converter',
    description:
      'Convert Adobe Photoshop PSD files into clean PNG formats, retaining transparent composition elements. Quick browser-side extraction.',
    keywords: [
      'psd to png',
      'photoshop to png converter',
      'convert psd to png online',
      'psd to png transparent background',
      'extract layers from psd to png',
      'psd to png converter online free',
      'batch photoshop to transparent png compiler',
      'client side layered psd to alpha channel png',
      'offline psd document file to png layout',
      'flatten adobe canvas layers to transparent png',
      'unblock photoshop creative asset to open png file',
      'mass export psd components to separate png graphics',
      'save print project psd to web ready transparent png',
      'free script file to render psd into clean png',
      'convert extension .psd to .png transparent layer',
      'wasm parsing engine psd to png profile',
      'secure layered format to single transparency web graphic',
      'photoshop mockup file extractor to png asset',
      'render smart objects inside psd as individual png files',
      'high bit depth color profile rendering psd to png',
    ],
  },
  'avif-to-jpg': {
    title: 'AVIF to JPG Converter',
    description:
      'Convert highly compressed next-generation AVIF images into standard JPG layouts compatible across older operating systems and device displays.',
    keywords: [
      'avif to jpg',
      'convert avif to jpg online',
      'avif to jpeg format decoder',
      'change avif image to jpg',
      'avif converter tool free',
      'avif to jpg converter online batch',
      'bulk decode next gen avif to compressed jpeg',
      'client side avif to universal jpg extractor',
      'offline aomedia video format image to standard jpeg',
      'fix unreadable avif file extension by saving as jpg',
      'mass avif compression reversal to regular jpeg',
      'free next generation web image decoder profile browser',
      'save responsive layout avif as cross platform jpeg',
      'high dynamic range avif map to standard srgb jpg',
      'convert extension .avif to .jpg image viewer',
      'wasm powered avif file extractor to legacy device layout',
      'unblock hidden avif downloads into standard photograph layout',
      'open media compression standard avif to base jpeg conversion',
      'secure browser rendering engine convert avif to plain jpeg',
      'batch process smart device native avif to web jpeg output',
    ],
  },
  'ico-to-png': {
    title: 'ICO to PNG Converter',
    description:
      'Convert Windows ICO files into high-resolution PNG transparent assets. Deconstruct complex system icons down to crisp graphic layouts instantly.',
    keywords: [
      'ico to png',
      'convert ico to png online',
      'extract icon file to transparent png',
      'ico layout converter',
      'favicon asset extractor',
      'ico to png converter online free',
      'batch decompose windows shortcut ico to clear png',
      'client side multi size ico package to individual png files',
      'offline desktop layout icon asset to alpha layer png',
      'unblock legacy system icon file properties to native png structure',
      'mass extraction tool extract multi bitmap icon container to single png',
      'free development utility split composite icon directory down to raw png',
      'save windows standard executable icon layer as high transparency web png',
      'browser script reverse compiling binary icon matrices to standard transparent graphics',
      'convert extension .ico to .png layout resource pipeline',
      'web assembly runtime decoding proprietary microsoft icon packages',
      'secure developer toolkit disassemble layout configuration ico matrices',
      'extract highest resolution bitmap from website favicon stream to local file system',
      'deconstruct desktop template asset to raw design component png structure',
      'web resource converter unpack server profile favicons to master file array png',
    ],
  },
  'avif-to-png': {
    title: 'AVIF to PNG Converter',
    description:
      'Convert high-efficiency AVIF images into lossless PNG assets, completely keeping transparency parameters intact. Local browser compilation protects workflow file security.',
    keywords: [
      'avif to png',
      'convert avif to png',
      'avif to png transparent',
      'convert avif to png online',
      'avif to png converter free',
      'batch avif to transparent png',
      'client side avif to lossless png extractor',
      'offline avif decoder script',
      'save next gen avif as alpha channel png',
      'extract transparency layer from compressed avif file',
      'bulk next-gen web formatting conversion to png format',
      'unblock modern device snapshot avif files down to open png graphic',
      'high dynamic color range avif processing layer transparency mapping',
      'mass map collection processing converter tool asset extraction',
      'free browser application compile secure data format vector container',
      'convert extension .avif to .png lossless data asset optimization',
      'assembly container framework pipeline extraction',
      'secure visual infrastructure convert modern vector compression matrix',
      'render complex layout asset array raw image asset array structure',
      'unlimited free desktop level file handling automation package profiles',
    ],
  },
  'pdf-to-png': {
    title: 'PDF to PNG Converter',
    description:
      'Convert document PDF files into clear high-resolution PNG graphics inside your browser interface. Extract document pages into distinct transparent image layouts easily.',
    keywords: [
      'pdf to png',
      'convert pdf to png',
      'pdf to png online',
      'pdf page extractor to png format',
      'convert pdf page to transparent png image asset',
      'batch process pdf document formatting matrix to flat images',
      'client side software tool transform printable document vector map',
      'offline system layout optimization parse layout file data layers',
      'rasterize layout structure convert design elements down to pixel metrics',
      'extract visual assets hidden within composite database publishing stream array',
      'unblock vector blueprints build crystal clear display screens png profile',
      'mass export operations process legal documentation records local file system',
      'save presentation template pages individual clean graphics structure assets',
      'free web assembly framework interface parsing portable document profiles directly',
      'convert extension .pdf text grids to alpha layer png output assets',
      'secure privacy protocol handling sensitive financial calculation layouts safely offline',
      'extract high resolution architectural schemes from canvas vectors cleanly',
      'convert digital booklet sheets down to single image sequence configurations',
      'high fidelity document processing library engine extract background components',
      'desktop alternative application interface run background task compilation engines',
    ],
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG Converter',
    description:
      'Deconstruct multipage PDF layout sheets into highly optimized flat JPG photographs instantly. Zero server upload pipelines guarantee total data compliance protocols.',
    keywords: [
      'pdf to jpg',
      'pdf to jpeg',
      'convert pdf to jpg online',
      'save pdf document pages flat photos',
      'pdf to jpg converter online free batch processing profile',
      'bulk turn portable document layout configuration compressed picture matrix',
      'client side database file handling transform paperwork structures directly',
      'offline document viewing pipeline extract graphic sheets universal file arrays',
      'rasterize printing workspace specifications standard photo metadata tags',
      'mass map transformation procedures convert structural documentation layers plain files',
      'unblock administrative records change design layouts high resolution picture assets',
      'free script pipeline process digital scanned folders single layout records',
      'convert text layouts structural drawings flat pixel matrices easily',
      'browser native compilation library extract page frames high speed script',
      'convert extension .pdf schema definitions universal camera image profile arrays',
      'secure financial audit trail image capture run fully private client side',
      'flatten administrative book sheets compressed web image viewports cleanly',
      'convert digital manuals schematic sketches basic image files online free',
      'high efficiency data decoding engines flatten corporate contracts baseline files',
      'portable application toolset replace cloud conversion tools local safe scripts',
    ],
  },
  'eps-to-png': {
    title: 'EPS to PNG Converter',
    description:
      'Convert graphic design vector EPS files down to high-definition alpha-channel transparent PNG graphics. Zero cloud transmission ensures complete intellectual asset protection.',
    keywords: [
      'eps to png',
      'convert eps to png',
      'eps to png online high resolution',
      'vector postscript rasterizer',
      'convert encapsulated postscript file transparent png layout',
      'batch design artwork conversion process eps vectors flat images',
      'client side typography rendering engine transform printing assets directly',
      'offline structural layout interpreter compile postscript paths pixel matrices',
      'rasterize professional branding logo configurations crisp open graphic frames',
      'mass conversion utility scale complex vector shapes without loss asset layers',
      'unblock legacy printing press formats transform publishing files modern assets',
      'free developer resource compile industrial plotting file profiles raw png output',
      'save high end publication layouts individual design component graphics structure',
      'browser based dynamic graphics pipeline render high precision printing matrices natively',
      'convert extension .eps asset streams directly alpha channel transparent image',
      'secure corporate intellectual property processing shield premium creative mockups safely',
      'extract source design elements clear transparent background layer structure assets',
      'convert specialized vector print templates clean isolated web site resources',
      'high engine fidelity parsing modules interpret path descriptions color data spaces',
      'desktop application alternative translate mathematical coordinate geometries raster maps',
    ],
  },
  'ai-to-png': {
    title: 'AI to PNG Converter',
    description:
      'Convert proprietary Adobe Illustrator AI layout documents into standard transparent web-friendly PNG images. Perfect framework to unpack raw artwork assets.',
    keywords: [
      'ai to png',
      'illustrator to png',
      'convert ai to png online',
      'flatten illustrator vector layers transparent',
      'convert adobe illustrator file raw open graphic asset component profile',
      'batch process design layouts export artwork layers standalone files safely',
      'client side processing script render vector node coordinates pixel layouts',
      'offline creative asset translation engine change native drawing formats open structures',
      'rasterize professional vector artwork configurations high crisp alpha layer masks',
      'mass asset conversion pipeline export layered marketing banners clear transparent graphics',
      'unblock proprietary creative workspace formats change graphic designs standard file resources',
      'free digital art optimization framework extract path illustrations layout canvas arrays',
      'save complex logo pattern elements individual high definition asset cards',
      'browser platform rendering suite trace internal postscript mapping definitions engine elements',
      'convert extension .ai draft files directly high fidelity transparent web output',
      'secure privacy architecture render unpublished corporate identity frameworks completely hidden local',
      'extract canvas illustration compositions clean transparent boundary background configurations layouts',
      'convert high resolution vector sketches direct to isolated pixel precise images',
      'high grade engine translation logic parse bezier mathematical curves raster parameters',
      'desktop independent workflow script open illustration data sets without active license profiles',
    ],
  },
  'dng-to-jpg': {
    title: 'DNG to JPG Converter',
    description:
      'Develop high bit depth Adobe Digital Negative DNG camera RAW files into universal web compressed standard JPG photographs. Total local exposure mapping manipulation.',
    keywords: [
      'dng to jpg',
      'dng to jpeg',
      'convert dng to jpg online',
      'develop digital negative camera raw',
      'convert raw dng snapshot standard compressed photograph profile layout',
      'batch processing camera negative matrices export srgb color space files',
      'client side demosaicing script extract photography sensor maps baseline images',
      'offline development workflow engine decode high dynamic sensor range metrics',
      'compress raw archive negatives highly optimized lightweight camera picture formats',
      'mass photo translation processing scale heavy exposure snapshots fast browser viewports',
      'unblock universal raw format files look at high dynamic print documentation',
      'free photography tool processing engine convert master sensor maps standard layout',
      'save uncompressed landscape profiles individual web optimized preview graphics structures',
      'browser engine color mapping lookup tables translate professional color matrix spaces',
      'convert extension .dng archive structures directly cross platform standard jpg images',
      'secure metadata conservation pipeline protect exif geo tags while flattening locally',
      'extract integrated preview thumbnails large camera raw format packages safely online',
      'convert high bit depth sensor captures basic compressed consumer display configurations',
      'high precision translation algorithm process baseline exposure levels dynamic frame ranges',
      'desktop alternative photo development utility process raw digital assets without subscription profiles',
    ],
  },
  'cr2-to-jpg': {
    title: 'CR2 to JPG Converter',
    description:
      'Process and convert Canon RAW CR2 photo files into standard universal compressed JPG images. Local image processing algorithms render pure sensor inputs.',
    keywords: [
      'cr2 to jpg',
      'cr2 to jpeg',
      'convert canon raw to jpg',
      'develop cr2 files online',
      'convert canon digital camera negative standard web compressed photo profile',
      'batch process professional photography assets export high precision srgb jpeg arrays',
      'client side digital darkroom toolkit render raw camera frames directly browser',
      'offline photography translation software decode specialized canon sensor file configurations',
      'compress heavy uncompressed camera master files optimized small layout formats',
      'mass image rendering pipelines transform high bit depth raw exposures fast',
      'unblock proprietary camera manufacturer files modify raw configuration file matrices instantly',
      'free photography utility script extract image matrix profiles standard picture records',
      'save high dynamic sensor captures individual clear presentation graphics files',
      'browser development module interpret raw camera exposure layers native color fields',
      'convert extension .cr2 photography streams directly cross platform compressed jpg assets',
      'secure client side metadata processing strip or retain hardware configuration details',
      'extract full resolution embedded jpeg sheets out of large camera containers',
      'convert raw sensor output fields baseline consumer device image configurations safely',
      'high grade demosaicing processing infrastructure map specialized bayer pattern array values',
      'desktop professional software alternative transcode camera photography portfolios serverless scripts',
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

  const baseKeywords = [
    // --- Core Combinations ---
    `${source} to ${target}`,
    `${source} to ${target} converter`,
    `convert ${source} to ${target}`,
    `change ${source} to ${target}`,
    `${source} to ${target} online`,
    `convert ${source} to ${target} online`,
    `${source} to ${target} tool`,
    `${source} to ${target} software`,
    `${source} to ${target} free`,
    `${source} to ${target} online free`,
    `${source} to ${target} converter free`,
    `${source} to ${target} converter online free`,
    `${source} to ${target} tool free`,
    `${source} to ${target} tool online free`,
    `client side ${source} to ${target}`,
    `offline ${source} to ${target} converter`,
    `secure ${source} to ${target} online`,
    `private ${source} to ${target} conversion`,
    `batch ${source} to ${target} converter`,
    `wasm ${source} to ${target} tool`,

    // --- Bulk & Performance Multipliers ---
    `bulk ${source} to ${target} online`,
    `mass ${source} to ${target} converter`,
    `fast ${source} to ${target} tool`,
    `high quality ${source} to ${target}`,
    `lossless ${source} to ${target} conversion`,
    `instant ${source} to ${target} converter`,
    `multiple ${source} to ${target} transform`,

    // --- Platform & Web Ecosystem Intent ---
    `best ${source} to ${target} online`,
    `optimize ${source} to ${target} for web`,
    `browser based ${source} to ${target}`,
    `html5 ${source} to ${target} application`,
    `responsive ${source} to ${target} utility`,
    `web app ${source} to ${target}`,

    // --- Developer & API Design Targets ---
    `convert ${source} file to ${target}`,
    `script ${source} to ${target} generator`,
    `clean ${source} to ${target} rendering`,
    `local storage ${source} to ${target}`,

    // --- Privacy & Sandbox Positioning ---
    `no upload ${source} to ${target} free`,
    `zero server ${source} to ${target}`,
    `sandbox ${source} to ${target} converter`,
  ];

  return {
    source,
    target,
    title: override.title ?? `${sourceLabel} to ${targetLabel} Converter`,
    description:
      override.description ??
      `Convert ${sourceLabel} images to ${targetLabel} format free, fast, and privately in your browser.`,
    keywords: override.keywords
      ? [...new Set([...baseKeywords, ...override.keywords])]
      : baseKeywords,
    features: override.features ?? DEFAULT_FEATURES(sourceLabel, targetLabel),
    faqs: override.faqs ?? DEFAULT_FAQS(sourceLabel, targetLabel),
  };
};

// All valid conversion pairs for static generation
export const ALL_CONVERSION_PAIRS = IMAGE_FORMATS.flatMap((source) => {
  const allowed = getAllowedTargets(source.extension);
  return IMAGE_FORMATS.filter(
    (target) =>
      target.extension !== source.extension && allowed.has(target.extension),
  ).map((target) => ({
    source: source.extension,
    target: target.extension,
  }));
});
