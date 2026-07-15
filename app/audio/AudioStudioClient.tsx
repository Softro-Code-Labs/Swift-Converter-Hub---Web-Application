'use client';

import {
  AudioLines,
  RefreshCw,
  Scissors,
  Minimize2,
  Volume2,
  Combine,
  Shield,
  Zap,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // -- Convert group -------------------------------------------------
  {
    id: 'convert',
    icon: RefreshCw,
    title: 'Audio Format Converter',
    desc: 'Convert between MP3, WAV, OGG, FLAC, AAC, M4A and OPUS - batch process and adjust bitrate.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/audio/convert',
    status: 'live',
    group: 'convert',
    featured: true,
    tags: [
      'mp3',
      'wav',
      'ogg',
      'flac',
      'aac',
      'm4a',
      'opus',
      'convert',
      'format',
    ],
  },

  // -- Edit group ------------------------------------------------------
  {
    id: 'trim',
    icon: Scissors,
    title: 'Trim Audio',
    desc: 'Cut a clip from any audio file - set a start and end point, preview, and download.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/audio/trim',
    status: 'live',
    group: 'edit',
    featured: true,
    tags: ['trim', 'cut', 'clip', 'crop audio', 'shorten'],
  },
  {
    id: 'merge',
    icon: Combine,
    title: 'Merge Audio Files',
    desc: 'Combine multiple audio files into one, in any order - even mixed formats.',
    color:
      'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    accentBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    accentText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    href: '/audio/merge',
    status: 'live',
    group: 'edit',
    featured: true,
    tags: ['merge', 'combine', 'join', 'concatenate', 'stitch'],
  },
  {
    id: 'volume',
    icon: Volume2,
    title: 'Adjust Volume',
    desc: 'Boost, lower, or auto-normalize loudness to a consistent level.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/audio/volume',
    status: 'live',
    group: 'edit',
    featured: false,
    tags: ['volume', 'normalize', 'gain', 'loudness', 'boost'],
  },

  // -- Optimize group --------------------------------------------------
  {
    id: 'compress',
    icon: Minimize2,
    title: 'Compress Audio',
    desc: 'Shrink file size by re-encoding at a lower bitrate - batch process up to 20 files.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/audio/compress',
    status: 'live',
    group: 'optimize',
    featured: false,
    tags: ['compress', 'bitrate', 'shrink', 'reduce size', 'optimize'],
  },
];

// --- Groups -------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'convert',
    label: 'Format Conversion',
    desc: 'Convert between MP3, WAV, OGG, FLAC, AAC, M4A and OPUS',
    dot: 'bg-emerald-400',
  },
  {
    id: 'edit',
    label: 'Trim, Merge & Adjust',
    desc: 'Cut clips, combine files, and control loudness',
    dot: 'bg-rose-400',
  },
  {
    id: 'optimize',
    label: 'Compress',
    desc: 'Reduce file size for sharing and storage',
    dot: 'bg-amber-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: AudioLines,
  iconColor: 'text-emerald-600 dark:text-emerald-400',
  iconBg:
    'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
  title: 'Audio Studio',
  subtitle: 'Client-side audio processing · No file uploads · Any size',
  description:
    'Every Audio Studio tool runs entirely in your browser using FFmpeg compiled to WebAssembly - no server round-trips, no upload wait, no size limit beyond your own device memory.',
  privacyNote:
    '🔒 Your audio files never leave your device - processed entirely in-browser.',
  accentFrom: 'from-emerald-400',
  accentTo: 'to-emerald-500',
  badgeColor:
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  pills: [
    {
      icon: Shield,
      label: 'Files stay on your device',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'No file size limits',
      color:
        'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    },
    {
      icon: AudioLines,
      label: '5 audio tools',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
  ],
};

// --- Page ---------------------------------------------------------------------

export default function AudioStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'mp3', 'trim', 'merge'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-emerald-600 dark:hover:text-emerald-400"
      footerNote="Need a specific audio tool?"
      footerCta={{ label: 'Let us know', href: '/contact' }}
    />
  );
}
