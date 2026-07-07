'use client';

import {
  Image,
  RefreshCw,
  Crop,
  Minimize2,
  SlidersHorizontal,
  FileSearch,
  Binary,
  Shield,
  Zap,
  Lock,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // -- Convert group --------------------------------------------------
  {
    id: 'format-converter',
    icon: RefreshCw,
    title: 'Format Converter',
    desc: 'Convert between 150+ image formats - JPG, PNG, WebP, AVIF, HEIC, SVG, and more. Pick source and target from a searchable dropdown.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/image/convert',
    status: 'live',
    group: 'convert',
    featured: true,
    tags: [
      'convert',
      'jpg',
      'png',
      'webp',
      'avif',
      'heic',
      'svg',
      'format',
      '120 formats',
    ],
  },
  {
    id: 'base64',
    icon: Binary,
    title: 'Image ↔ Base64',
    desc: 'Encode any image to a Base64 data URI, or decode an existing Base64 string back to an image file.',
    color: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400',
    accentBorder: 'hover:border-teal-300 dark:hover:border-teal-700',
    accentText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    href: '/image/base64',
    status: 'live',
    group: 'convert',
    featured: false,
    tags: ['base64', 'encode', 'decode', 'data uri', 'embed', 'image'],
  },

  // -- Edit group -----------------------------------------------------
  {
    id: 'crop',
    icon: Crop,
    title: 'Crop & Resize',
    desc: 'Crop to any aspect ratio or exact pixel dimensions. Free crop, fixed ratio, or percentage-based resize.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/image/crop',
    status: 'live',
    group: 'edit',
    featured: true,
    tags: ['crop', 'resize', 'dimensions', 'aspect ratio', 'scale', 'image'],
  },
  {
    id: 'adjust',
    icon: SlidersHorizontal,
    title: 'Adjust & Filter',
    desc: 'Fine-tune brightness, contrast, saturation, and sharpness. Apply grayscale, sepia, and blur filters.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/image/adjust',
    status: 'live',
    group: 'edit',
    featured: false,
    tags: [
      'brightness',
      'contrast',
      'saturation',
      'filter',
      'grayscale',
      'adjust',
      'image',
    ],
  },

  // -- Optimise group -------------------------------------------------
  {
    id: 'compress',
    icon: Minimize2,
    title: 'Compress & Optimize',
    desc: 'Shrink image file size without visible quality loss. Choose quality level and see before/after file size.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/image/compress',
    status: 'live',
    group: 'optimise',
    featured: true,
    tags: [
      'compress',
      'optimize',
      'reduce',
      'size',
      'quality',
      'minify',
      'image',
    ],
  },

  // -- Inspect group --------------------------------------------------
  {
    id: 'metadata',
    icon: FileSearch,
    title: 'EXIF Metadata Viewer',
    desc: 'Extract camera make, model, lens, shutter speed, ISO, and GPS coordinates from JPEG and TIFF photos.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/image/metadata',
    status: 'live',
    group: 'inspect',
    featured: true,
    tags: [
      'exif',
      'metadata',
      'gps',
      'camera',
      'iso',
      'shutter',
      'photo',
      'inspect',
    ],
  },
];

// --- Groups ------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'convert',
    label: 'Convert & Encode',
    desc: 'Change image formats or encode to Base64',
    dot: 'bg-blue-400',
  },
  {
    id: 'edit',
    label: 'Edit & Transform',
    desc: 'Crop, resize, and apply visual adjustments',
    dot: 'bg-emerald-400',
  },
  {
    id: 'optimise',
    label: 'Optimise',
    desc: 'Reduce file size for web and sharing',
    dot: 'bg-amber-400',
  },
  {
    id: 'inspect',
    label: 'Inspect & Browse',
    desc: 'View metadata and explore supported formats',
    dot: 'bg-rose-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: Image,
  iconColor: 'text-blue-600 dark:text-blue-400',
  iconBg:
    'bg-blue-100 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800',
  title: 'Image Studio',
  subtitle: 'WebAssembly-powered · 150+ formats · Zero uploads',
  description:
    'Every Image Studio tool runs entirely in your browser using a high-performance WebAssembly engine. Convert, crop, compress, and inspect images with no uploads, no accounts, and no file size limits.',
  privacyNote:
    '🔒 Your images never leave your device - all processing is local.',
  accentFrom: 'from-blue-400',
  accentTo: 'to-blue-500',
  badgeColor:
    'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  pills: [
    {
      icon: Shield,
      label: 'Images stay on device',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'WebAssembly engine',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
    {
      icon: Lock,
      label: '150+ formats supported',
      color:
        'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800',
    },
  ],
};

// --- Page --------------------------------------------------------------

export default function ImageStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'crop', 'webp', 'exif'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-blue-600 dark:hover:text-blue-400"
      footerNote="Missing an image tool?"
      footerCta={{ label: 'Suggest it', href: '/contact' }}
    />
  );
}
