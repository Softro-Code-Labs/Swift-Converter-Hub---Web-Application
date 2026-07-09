'use client';

import {
  FileText,
  Layers,
  Scissors,
  FileDown,
  RefreshCw,
  FileSignature,
  Zap,
  Lock,
  FilePlus,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // --- PDF group ------------------------------------------------------------
  {
    id: 'pdf-merge',
    icon: Layers,
    title: 'Merge PDF Files',
    desc: 'Combine multiple PDFs into a single document - reorder pages by drag and drop.',
    color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
    accentBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    accentText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    href: '/file/pdf-merge',
    status: 'live',
    group: 'pdf',
    featured: true,
    tags: ['merge', 'combine', 'pdf', 'join', 'pages', 'documents'],
  },
  {
    id: 'pdf-split',
    icon: Scissors,
    title: 'Split PDF Pages',
    desc: 'Extract specific pages or split a PDF into separate files by page range.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/file/pdf-split',
    status: 'live',
    group: 'pdf',
    featured: true,
    tags: ['split', 'extract', 'pdf', 'pages', 'separate', 'range'],
  },
  {
    id: 'pdf-compress',
    icon: FileDown,
    title: 'Compress PDF',
    desc: 'Reduce file size for easier sharing and email attachments without visible quality loss.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/file/pdf-compress',
    status: 'live',
    group: 'pdf',
    featured: false,
    tags: ['compress', 'reduce', 'size', 'optimize', 'pdf', 'shrink'],
  },
  {
    id: 'pdf-rotate',
    icon: FileSignature,
    title: 'PDF Page Rotator',
    desc: 'Rotate individual pages 90°, 180°, or 270° without re-uploading the whole file.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/file/pdf-rotate',
    status: 'soon',
    group: 'pdf',
    featured: false,
    tags: ['rotate', 'flip', 'pdf', 'pages', 'orientation', '90', '180'],
  },

  // --- Convert group ----------------------------------------------------------
  {
    id: 'word-to-pdf',
    icon: RefreshCw,
    title: 'Word / Excel to PDF',
    desc: 'Convert .docx and .xlsx files to print-ready PDF documents - all formatting preserved.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/file/office-to-pdf',
    status: 'soon',
    group: 'convert',
    featured: true,
    tags: ['word', 'excel', 'docx', 'xlsx', 'pdf', 'convert', 'office'],
  },
  {
    id: 'pdf-watermark',
    icon: FilePlus,
    title: 'PDF Watermark',
    desc: 'Add text or image watermarks to every page of a PDF - set opacity, angle, and position.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/file/pdf-watermark',
    status: 'soon',
    group: 'convert',
    featured: false,
    tags: [
      'watermark',
      'stamp',
      'pdf',
      'text',
      'image',
      'overlay',
      'confidential',
    ],
  },
];

// --- Groups -------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'pdf',
    label: 'PDF Tools',
    desc: 'Merge, split, compress, and rotate PDF files',
    dot: 'bg-cyan-400',
  },
  {
    id: 'convert',
    label: 'Convert & Enhance',
    desc: 'Office to PDF, watermarks, and document transformations',
    dot: 'bg-amber-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: FileText,
  iconColor: 'text-cyan-600 dark:text-cyan-400',
  iconBg:
    'bg-cyan-100 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800',
  title: 'Document Suite',
  subtitle: 'PDF tools · Office conversion · Sensitive docs stay private',
  description:
    "We're building PDF manipulation using pdf-lib - merge, split, compress, and rotate pages without a server. Document conversion to PDF reuses the same engine that powers our Word and Excel rendering.",
  privacyNote:
    '🔒 Sensitive documents never leave your browser - processed entirely client-side.',
  accentFrom: 'from-cyan-400',
  accentTo: 'to-cyan-500',
  badgeColor:
    'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  pills: [
    {
      icon: Lock,
      label: 'Documents stay private',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'Powered by pdf-lib',
      color:
        'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800',
    },
    {
      icon: FileText,
      label: '6 document tools',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
  ],
};

// --- Page ---------------------------------------------------------------------

export default function DocumentSuiteClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'merge', 'compress', 'word'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-cyan-600 dark:hover:text-cyan-400"
      footerNote="Need a document tool we haven't listed?"
      footerCta={{ label: 'Tell us', href: '/contact' }}
    />
  );
}
