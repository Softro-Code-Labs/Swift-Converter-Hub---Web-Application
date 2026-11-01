/**
 * Tool registry - the single source of truth for every studio and tool.
 *
 * Navigation (header menu, mobile drawer, Cmd+K search), studio hub pages,
 * the in-studio tool rail, "related tools" blocks, the footer and the home
 * page directory all read from this file. Add a tool here once and it shows
 * up everywhere.
 */
import {
  AlignLeft,
  ArrowUpDown,
  AudioLines,
  Binary,
  Braces,
  CaseSensitive,
  Clapperboard,
  Code,
  Combine,
  Cpu,
  Crop,
  Database,
  Eraser,
  FileCheck,
  FileDown,
  FileImage,
  FileJson,
  FileSearch,
  FileSpreadsheet,
  FileText,
  FileType2,
  Film,
  Fingerprint,
  GitCompare,
  Hash,
  KeyRound,
  ImageIcon,
  Layers,
  Link2,
  Minimize2,
  Package,
  RefreshCw,
  RotateCw,
  ScanText,
  Scissors,
  SlidersHorizontal,
  Stamp,
  Type,
  Volume2,
  type LucideIcon,
} from 'lucide-react';

export type StudioId =
  | 'image'
  | 'audio'
  | 'video'
  | 'file'
  | 'data'
  | 'character';

export interface Tool {
  id: string;
  studio: StudioId;
  /** Short, scannable name used in menus and the tool rail. */
  name: string;
  /** Full page title. */
  title: string;
  /** One sentence describing what the tool does, in plain language. */
  desc: string;
  href: string;
  icon: LucideIcon;
  group: string;
  /** Extra search terms (formats, synonyms). */
  keywords: string[];
  popular?: boolean;
}

export interface StudioGroupDef {
  id: string;
  label: string;
  desc: string;
}

export interface Studio {
  id: StudioId;
  name: string;
  href: string;
  icon: LucideIcon;
  /** What you can do here, in one line. */
  tagline: string;
  description: string;
  /** What the studio works on - shown in menus. */
  handles: string;
  /** How the processing happens, for the privacy note. */
  engine: string;
  groups: StudioGroupDef[];
}

export const STUDIOS: Studio[] = [
  {
    id: 'image',
    name: 'Image Studio',
    href: '/image',
    icon: ImageIcon,
    tagline: 'Convert, compress, crop and inspect images',
    description:
      'Convert between 150+ image formats, shrink file sizes, crop and resize, adjust colours, remove backgrounds with on-device AI and read EXIF data. Everything runs inside this tab.',
    handles: 'JPG, PNG, WebP, HEIC, AVIF, SVG and 150+ more',
    engine: 'ImageMagick compiled to WebAssembly',
    groups: [
      {
        id: 'convert',
        label: 'Convert & encode',
        desc: 'Change formats or turn images into Base64',
      },
      {
        id: 'edit',
        label: 'Edit',
        desc: 'Crop, resize, adjust colour and remove backgrounds',
      },
      {
        id: 'optimise',
        label: 'Optimise',
        desc: 'Make files smaller for the web',
      },
      {
        id: 'inspect',
        label: 'Inspect',
        desc: 'Read what a photo knows about itself',
      },
    ],
  },
  {
    id: 'audio',
    name: 'Audio Studio',
    href: '/audio',
    icon: AudioLines,
    tagline: 'Convert, trim, merge and compress audio',
    description:
      'Transcode between MP3, WAV, FLAC, AAC, OGG and more, cut clips, join tracks and fix loudness. FFmpeg runs as WebAssembly in your browser, so there is no upload wait.',
    handles: 'MP3, WAV, FLAC, AAC, M4A, OGG, OPUS',
    engine: 'FFmpeg compiled to WebAssembly',
    groups: [
      { id: 'convert', label: 'Convert', desc: 'Change the audio format' },
      { id: 'edit', label: 'Edit', desc: 'Cut, join and set loudness' },
      { id: 'optimize', label: 'Optimise', desc: 'Make files smaller' },
    ],
  },
  {
    id: 'video',
    name: 'Video Studio',
    href: '/video',
    icon: Clapperboard,
    tagline: 'Convert, trim, compress and make GIFs',
    description:
      'Convert between MP4, WebM, MOV, MKV and more, cut clips, turn moments into GIFs, pull out the soundtrack and shrink large files. FFmpeg runs as WebAssembly in your browser.',
    handles: 'MP4, WebM, MOV, MKV, AVI and more',
    engine: 'FFmpeg compiled to WebAssembly',
    groups: [
      { id: 'convert', label: 'Convert', desc: 'Change the video format' },
      { id: 'edit', label: 'Edit', desc: 'Trim, make GIFs and extract audio' },
      { id: 'optimize', label: 'Optimise', desc: 'Make files smaller' },
    ],
  },
  {
    id: 'file',
    name: 'Document Suite',
    href: '/file',
    icon: FileText,
    tagline: 'Merge, split, compress and convert PDFs',
    description:
      'Merge and split PDFs, rotate pages, add watermarks, shrink file size, turn images into PDFs and convert between PDF, Word and Excel. Sensitive documents stay on your device the whole time.',
    handles: 'PDF, DOCX, XLSX, images',
    engine: 'pdf-lib and PDF.js running in your browser',
    groups: [
      {
        id: 'pdf',
        label: 'Organise PDFs',
        desc: 'Merge, split, rotate and compress',
      },
      {
        id: 'convert',
        label: 'Convert & mark up',
        desc: 'Office to PDF, PDF to Word, watermarks',
      },
    ],
  },
  {
    id: 'data',
    name: 'Data Studio',
    href: '/data',
    icon: Database,
    tagline: 'Convert and format JSON, CSV, XML and YAML',
    description:
      'Move data between CSV, JSON, XML, YAML, TOML and Excel, then format, validate and decode it. Large files process instantly because nothing is sent anywhere.',
    handles: 'JSON, CSV, XML, YAML, TOML, XLSX',
    engine: 'JavaScript parsers running in your browser',
    groups: [
      { id: 'convert', label: 'Convert', desc: 'Move data between formats' },
      {
        id: 'format',
        label: 'Format & validate',
        desc: 'Beautify, minify and check syntax',
      },
      {
        id: 'encode',
        label: 'Encode & decode',
        desc: 'Base64 and token payloads',
      },
    ],
  },
  {
    id: 'character',
    name: 'Text Studio',
    href: '/character',
    icon: Type,
    tagline: 'Count, compare, transform and test text',
    description:
      'Everyday text tools: count words, compare versions, change case, test regular expressions, generate hashes and strong passwords, and spot invisible characters. Every tool is ready the moment it opens.',
    handles: 'Plain text, Markdown, regex, URLs',
    engine: 'Plain JavaScript in your browser',
    groups: [
      { id: 'analysis', label: 'Analyse', desc: 'Count, compare and sort' },
      {
        id: 'writing',
        label: 'Write & format',
        desc: 'Change case, replace, preview, generate',
      },
      {
        id: 'code',
        label: 'Developer & security',
        desc: 'Regex, URLs, hashes and passwords',
      },
      { id: 'inspect', label: 'Inspect', desc: 'Characters and number bases' },
    ],
  },
];

export const TOOLS: Tool[] = [
  // --- Image ----------------------------------------------------------------
  {
    id: 'image-convert',
    studio: 'image',
    name: 'Convert image',
    title: 'Image Format Converter',
    desc: 'Convert between 150+ formats, including JPG, PNG, WebP, AVIF and HEIC.',
    href: '/image/convert',
    icon: RefreshCw,
    group: 'convert',
    keywords: [
      'jpg',
      'jpeg',
      'png',
      'webp',
      'avif',
      'heic',
      'svg',
      'ico',
      'gif',
      'tiff',
      'format',
    ],
    popular: true,
  },
  {
    id: 'image-base64',
    studio: 'image',
    name: 'Image ↔ Base64',
    title: 'Image to Base64 Encoder',
    desc: 'Turn an image into a Base64 data URI, or decode one back into a file.',
    href: '/image/base64',
    icon: Binary,
    group: 'convert',
    keywords: ['base64', 'data uri', 'encode', 'decode', 'embed'],
  },
  {
    id: 'image-crop',
    studio: 'image',
    name: 'Crop & resize',
    title: 'Crop & Resize Images',
    desc: 'Crop to an aspect ratio or exact pixels, or scale by percentage.',
    href: '/image/crop',
    icon: Crop,
    group: 'edit',
    keywords: ['crop', 'resize', 'scale', 'dimensions', 'aspect ratio'],
    popular: true,
  },
  {
    id: 'image-adjust',
    studio: 'image',
    name: 'Adjust & filter',
    title: 'Adjust & Filter Images',
    desc: 'Tune brightness, contrast and saturation, or apply grayscale and sepia.',
    href: '/image/adjust',
    icon: SlidersHorizontal,
    group: 'edit',
    keywords: [
      'brightness',
      'contrast',
      'saturation',
      'filter',
      'grayscale',
      'sepia',
      'blur',
    ],
  },
  {
    id: 'image-remove-background',
    studio: 'image',
    name: 'Remove background',
    title: 'Background Remover',
    desc: 'Cut out the subject of a photo with on-device AI and get a transparent PNG.',
    href: '/image/remove-background',
    icon: Eraser,
    group: 'edit',
    keywords: [
      'remove background',
      'background remover',
      'transparent',
      'cutout',
      'remove bg',
      'png',
      'ai',
    ],
    popular: true,
  },
  {
    id: 'image-compress',
    studio: 'image',
    name: 'Compress image',
    title: 'Compress & Optimize Images',
    desc: 'Shrink images without visible quality loss and see the savings per file.',
    href: '/image/compress',
    icon: Minimize2,
    group: 'optimise',
    keywords: ['compress', 'optimize', 'reduce size', 'smaller', 'quality'],
    popular: true,
  },
  {
    id: 'image-metadata',
    studio: 'image',
    name: 'EXIF viewer',
    title: 'EXIF Metadata Viewer',
    desc: 'Read camera, lens, exposure and GPS data stored inside a photo.',
    href: '/image/metadata',
    icon: FileSearch,
    group: 'inspect',
    keywords: ['exif', 'metadata', 'gps', 'camera', 'iso', 'location'],
  },

  // --- Audio ----------------------------------------------------------------
  {
    id: 'audio-convert',
    studio: 'audio',
    name: 'Convert audio',
    title: 'Audio Format Converter',
    desc: 'Convert between MP3, WAV, FLAC, AAC, M4A, OGG and more, in batches.',
    href: '/audio/convert',
    icon: RefreshCw,
    group: 'convert',
    keywords: [
      'mp3',
      'wav',
      'flac',
      'aac',
      'm4a',
      'ogg',
      'opus',
      'wma',
      'aiff',
    ],
    popular: true,
  },
  {
    id: 'audio-trim',
    studio: 'audio',
    name: 'Trim audio',
    title: 'Trim Audio',
    desc: 'Cut a clip by setting a start and end point, then preview it.',
    href: '/audio/trim',
    icon: Scissors,
    group: 'edit',
    keywords: ['cut', 'clip', 'trim', 'ringtone', 'shorten'],
  },
  {
    id: 'audio-merge',
    studio: 'audio',
    name: 'Merge audio',
    title: 'Merge Audio Files',
    desc: 'Join several audio files into one, in any order and mixed formats.',
    href: '/audio/merge',
    icon: Combine,
    group: 'edit',
    keywords: ['join', 'combine', 'merge', 'concatenate'],
  },
  {
    id: 'audio-volume',
    studio: 'audio',
    name: 'Adjust volume',
    title: 'Adjust Audio Volume',
    desc: 'Boost, lower or normalise loudness to a consistent level.',
    href: '/audio/volume',
    icon: Volume2,
    group: 'edit',
    keywords: ['volume', 'louder', 'quieter', 'normalize', 'gain', 'boost'],
  },
  {
    id: 'audio-compress',
    studio: 'audio',
    name: 'Compress audio',
    title: 'Compress Audio',
    desc: 'Re-encode at a lower bitrate to shrink files, up to 20 at a time.',
    href: '/audio/compress',
    icon: Minimize2,
    group: 'optimize',
    keywords: ['compress', 'bitrate', 'smaller', 'reduce size'],
  },

  // --- Video ----------------------------------------------------------------
  {
    id: 'video-convert',
    studio: 'video',
    name: 'Convert video',
    title: 'Video Format Converter',
    desc: 'Convert between MP4, WebM, MOV, AVI, MKV and more, in batches.',
    href: '/video/convert',
    icon: RefreshCw,
    group: 'convert',
    keywords: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'flv', 'wmv'],
    popular: true,
  },
  {
    id: 'video-trim',
    studio: 'video',
    name: 'Trim video',
    title: 'Trim Video',
    desc: 'Cut a clip by setting a start and end point, then preview it.',
    href: '/video/trim',
    icon: Scissors,
    group: 'edit',
    keywords: ['cut', 'clip', 'trim', 'shorten'],
  },
  {
    id: 'video-gif',
    studio: 'video',
    name: 'Video to GIF',
    title: 'Video to GIF',
    desc: 'Turn a clip into an animated GIF with your own frame rate and size.',
    href: '/video/to-gif',
    icon: Film,
    group: 'edit',
    keywords: ['gif', 'animated', 'meme', 'animation'],
    popular: true,
  },
  {
    id: 'video-extract-audio',
    studio: 'video',
    name: 'Extract audio',
    title: 'Extract Audio from Video',
    desc: 'Save the soundtrack of a video as MP3, WAV or another format.',
    href: '/video/extract-audio',
    icon: AudioLines,
    group: 'edit',
    keywords: ['mp4 to mp3', 'soundtrack', 'extract', 'audio'],
  },
  {
    id: 'video-compress',
    studio: 'video',
    name: 'Compress video',
    title: 'Compress Video',
    desc: 'Shrink videos with a resolution cap and quality preset.',
    href: '/video/compress',
    icon: Minimize2,
    group: 'optimize',
    keywords: ['compress', 'smaller', 'reduce size', 'resolution'],
  },

  // --- Documents ------------------------------------------------------------
  {
    id: 'pdf-merge',
    studio: 'file',
    name: 'Merge PDFs',
    title: 'Merge PDF Files',
    desc: 'Combine several PDFs into one document and set the order.',
    href: '/file/pdf-merge',
    icon: Layers,
    group: 'pdf',
    keywords: ['combine', 'join', 'merge', 'pdf'],
    popular: true,
  },
  {
    id: 'pdf-split',
    studio: 'file',
    name: 'Split PDF',
    title: 'Split PDF Pages',
    desc: 'Pull out specific pages or split a PDF by page range.',
    href: '/file/pdf-split',
    icon: Scissors,
    group: 'pdf',
    keywords: ['extract pages', 'split', 'separate', 'pdf'],
  },
  {
    id: 'pdf-compress',
    studio: 'file',
    name: 'Compress PDF',
    title: 'Compress PDF',
    desc: 'Make a PDF small enough to email without visible quality loss.',
    href: '/file/pdf-compress',
    icon: FileDown,
    group: 'pdf',
    keywords: ['compress', 'reduce size', 'smaller', 'email', 'pdf'],
    popular: true,
  },
  {
    id: 'pdf-rotate',
    studio: 'file',
    name: 'Rotate PDF',
    title: 'Rotate PDF Pages',
    desc: 'Turn individual pages 90°, 180° or 270° and save the result.',
    href: '/file/pdf-rotate',
    icon: RotateCw,
    group: 'pdf',
    keywords: ['rotate', 'turn', 'orientation', 'landscape', 'pdf'],
  },
  {
    id: 'image-to-pdf',
    studio: 'file',
    name: 'Image to PDF',
    title: 'Image to PDF',
    desc: 'Combine JPG, PNG, HEIC and other images into one PDF.',
    href: '/file/image-to-pdf',
    icon: FileImage,
    group: 'convert',
    keywords: [
      'jpg to pdf',
      'png to pdf',
      'heic to pdf',
      'photos',
      'scan',
      'images',
      'picture',
    ],
    popular: true,
  },
  {
    id: 'office-to-pdf',
    studio: 'file',
    name: 'Word / Excel to PDF',
    title: 'Word & Excel to PDF',
    desc: 'Turn .docx and .xlsx files into print-ready PDFs.',
    href: '/file/office-to-pdf',
    icon: FileType2,
    group: 'convert',
    keywords: ['docx', 'xlsx', 'word', 'excel', 'office', 'to pdf'],
  },
  {
    id: 'pdf-to-word',
    studio: 'file',
    name: 'PDF to Word',
    title: 'PDF to Word Converter',
    desc: 'Turn a PDF into an editable .docx with headings and paragraphs.',
    href: '/file/pdf-to-word',
    icon: RefreshCw,
    group: 'convert',
    keywords: ['docx', 'word', 'editable', 'pdf to doc'],
    popular: true,
  },
  {
    id: 'pdf-watermark',
    studio: 'file',
    name: 'Watermark PDF',
    title: 'PDF Watermark',
    desc: 'Stamp text or an image on every page, with opacity and angle.',
    href: '/file/pdf-watermark',
    icon: Stamp,
    group: 'convert',
    keywords: ['watermark', 'stamp', 'confidential', 'draft', 'pdf'],
  },

  // --- Data -----------------------------------------------------------------
  {
    id: 'csv-json',
    studio: 'data',
    name: 'CSV ↔ JSON',
    title: 'CSV to JSON Converter',
    desc: 'Turn spreadsheet rows into JSON objects, or flatten JSON back to CSV.',
    href: '/data/csv-json',
    icon: FileSpreadsheet,
    group: 'convert',
    keywords: ['csv', 'json', 'spreadsheet', 'table'],
    popular: true,
  },
  {
    id: 'json-xml',
    studio: 'data',
    name: 'JSON ↔ XML',
    title: 'JSON to XML Converter',
    desc: 'Convert API payloads between JSON and XML in either direction.',
    href: '/data/json-xml',
    icon: Code,
    group: 'convert',
    keywords: ['xml', 'json', 'soap', 'api'],
  },
  {
    id: 'yaml-json',
    studio: 'data',
    name: 'YAML ↔ JSON',
    title: 'YAML to JSON Converter',
    desc: 'Convert configs, CI pipelines and API specs between YAML and JSON.',
    href: '/data/yaml-json',
    icon: Braces,
    group: 'convert',
    keywords: ['yaml', 'yml', 'json', 'config', 'kubernetes', 'openapi'],
  },
  {
    id: 'excel-json',
    studio: 'data',
    name: 'Excel to JSON',
    title: 'Excel to JSON',
    desc: 'Read every sheet of an .xlsx workbook into structured JSON.',
    href: '/data/excel-json',
    icon: Layers,
    group: 'convert',
    keywords: ['xlsx', 'xls', 'excel', 'spreadsheet', 'json'],
  },
  {
    id: 'toml-json',
    studio: 'data',
    name: 'TOML ↔ JSON',
    title: 'TOML to JSON Converter',
    desc: 'Convert Cargo.toml, pyproject.toml or any TOML file to JSON and back.',
    href: '/data/toml-json',
    icon: Package,
    group: 'convert',
    keywords: ['toml', 'cargo', 'pyproject', 'config'],
  },
  {
    id: 'json-formatter',
    studio: 'data',
    name: 'JSON formatter',
    title: 'JSON Formatter & Validator',
    desc: 'Beautify, minify and validate JSON, and inspect its structure.',
    href: '/data/json-formatter',
    icon: FileJson,
    group: 'format',
    keywords: ['json', 'beautify', 'prettify', 'minify', 'validate', 'lint'],
    popular: true,
  },
  {
    id: 'base64-text',
    studio: 'data',
    name: 'Base64 text',
    title: 'Base64 Encoder / Decoder',
    desc: 'Encode text to Base64 or decode it, including JWT payloads.',
    href: '/data/base64-text',
    icon: Binary,
    group: 'encode',
    keywords: ['base64', 'jwt', 'token', 'encode', 'decode'],
  },

  // --- Text -----------------------------------------------------------------
  {
    id: 'word-counter',
    studio: 'character',
    name: 'Word counter',
    title: 'Word & Character Counter',
    desc: 'Count words, characters and sentences, with an estimated read time.',
    href: '/character/word-counter',
    icon: Hash,
    group: 'analysis',
    keywords: ['word count', 'characters', 'letters', 'reading time'],
    popular: true,
  },
  {
    id: 'text-diff',
    studio: 'character',
    name: 'Text diff',
    title: 'Text Diff Viewer',
    desc: 'Compare two texts and see exactly what was added or removed.',
    href: '/character/text-diff',
    icon: GitCompare,
    group: 'analysis',
    keywords: ['compare', 'diff', 'difference', 'changes'],
  },
  {
    id: 'text-sorter',
    studio: 'character',
    name: 'Sort & dedupe lines',
    title: 'Text Sorter & Deduplicator',
    desc: 'Sort lines A–Z or by length, shuffle, and remove duplicates.',
    href: '/character/text-sorter',
    icon: ArrowUpDown,
    group: 'analysis',
    keywords: ['sort', 'alphabetical', 'duplicates', 'unique', 'lines'],
  },
  {
    id: 'case-converter',
    studio: 'character',
    name: 'Case converter',
    title: 'Case Converter',
    desc: 'Switch between UPPER, lower, Title, camelCase, snake_case and more.',
    href: '/character/case-converter',
    icon: CaseSensitive,
    group: 'writing',
    keywords: [
      'uppercase',
      'lowercase',
      'title case',
      'camelcase',
      'snake case',
    ],
    popular: true,
  },
  {
    id: 'find-replace',
    studio: 'character',
    name: 'Find & replace',
    title: 'Find & Replace',
    desc: 'Replace plain text or regex matches across your content at once.',
    href: '/character/find-replace',
    icon: RefreshCw,
    group: 'writing',
    keywords: ['find', 'replace', 'substitute', 'bulk edit'],
  },
  {
    id: 'markdown-preview',
    studio: 'character',
    name: 'Markdown preview',
    title: 'Markdown Preview',
    desc: 'Write Markdown and see it rendered as you type.',
    href: '/character/markdown-preview',
    icon: FileCheck,
    group: 'writing',
    keywords: ['markdown', 'md', 'readme', 'html'],
  },
  {
    id: 'lorem-ipsum',
    studio: 'character',
    name: 'Lorem ipsum',
    title: 'Lorem Ipsum Generator',
    desc: 'Generate placeholder text by words, sentences or paragraphs.',
    href: '/character/lorem-ipsum',
    icon: AlignLeft,
    group: 'writing',
    keywords: ['placeholder', 'dummy text', 'filler', 'lorem'],
  },
  {
    id: 'regex-tester',
    studio: 'character',
    name: 'Regex tester',
    title: 'Regex Tester',
    desc: 'Test a pattern live with match highlighting and capture groups.',
    href: '/character/regex-tester',
    icon: Binary,
    group: 'code',
    keywords: ['regex', 'regular expression', 'pattern', 'match'],
  },
  {
    id: 'url-encoder',
    studio: 'character',
    name: 'URL encoder',
    title: 'URL Encoder / Decoder',
    desc: 'Encode or decode URL parts and break a URL into its pieces.',
    href: '/character/url-encoder',
    icon: Link2,
    group: 'code',
    keywords: ['url', 'percent encoding', 'query string', 'uri'],
  },
  {
    id: 'hash-generator',
    studio: 'character',
    name: 'Hash generator',
    title: 'Hash Generator',
    desc: 'Create MD5, SHA-1, SHA-256 and SHA-512 hashes of text or files.',
    href: '/character/hash-generator',
    icon: Fingerprint,
    group: 'code',
    keywords: ['md5', 'sha1', 'sha256', 'sha512', 'checksum', 'hash'],
  },
  {
    id: 'password-generator',
    studio: 'character',
    name: 'Password generator',
    title: 'Password Generator',
    desc: 'Create strong random passwords, memorable passphrases and PINs.',
    href: '/character/password-generator',
    icon: KeyRound,
    group: 'code',
    keywords: [
      'password',
      'passphrase',
      'pin',
      'random',
      'strong password',
      'secure',
      'diceware',
    ],
    popular: true,
  },
  {
    id: 'unicode-inspector',
    studio: 'character',
    name: 'Unicode inspector',
    title: 'Unicode Inspector',
    desc: 'See the code point of every character and find invisible ones.',
    href: '/character/unicode-inspector',
    icon: ScanText,
    group: 'inspect',
    keywords: ['unicode', 'code point', 'invisible', 'zero width', 'emoji'],
  },
  {
    id: 'number-base',
    studio: 'character',
    name: 'Number bases',
    title: 'Number Base Converter',
    desc: 'Convert between binary, octal, decimal and hex as you type.',
    href: '/character/number-base',
    icon: Cpu,
    group: 'inspect',
    keywords: ['binary', 'hex', 'octal', 'decimal', 'base'],
  },
];

// --- Helpers ------------------------------------------------------------------

export const getStudio = (id: StudioId): Studio =>
  STUDIOS.find((s) => s.id === id)!;

export const getStudioTools = (id: StudioId): Tool[] =>
  TOOLS.filter((t) => t.studio === id);

/** Find the studio a pathname belongs to (e.g. /image/crop -> image). */
export function studioForPath(pathname: string | null): Studio | undefined {
  if (!pathname) return undefined;
  return STUDIOS.find(
    (s) => pathname === s.href || pathname.startsWith(`${s.href}/`),
  );
}

/** Find the tool a pathname belongs to. Format sub-pages such as
 *  /image/convert/jpg-to-png resolve to their parent tool. */
export function toolForPath(pathname: string | null): Tool | undefined {
  if (!pathname) return undefined;
  return [...TOOLS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((t) => pathname === t.href || pathname.startsWith(`${t.href}/`));
}

export const POPULAR_TOOLS = TOOLS.filter((t) => t.popular);

export const TOOL_COUNT = TOOLS.length;

/** Ranked search across every tool. */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored = TOOLS.map((tool) => {
    const studio = getStudio(tool.studio);
    const name = tool.name.toLowerCase();
    const title = tool.title.toLowerCase();
    const hay = [
      name,
      title,
      tool.desc.toLowerCase(),
      studio.name.toLowerCase(),
      ...tool.keywords,
    ].join(' ');
    let score = 0;
    for (const term of terms) {
      if (!hay.includes(term)) return { tool, score: -1 };
      if (name.startsWith(term) || title.startsWith(term)) score += 6;
      else if (name.includes(term) || title.includes(term)) score += 4;
      else if (tool.keywords.some((k) => k.startsWith(term))) score += 3;
      else score += 1;
    }
    if (tool.popular) score += 0.5;
    return { tool, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.tool);
}
