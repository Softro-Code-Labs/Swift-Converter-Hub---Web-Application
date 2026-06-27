'use client';

import {
  Music,
  Disc,
  Scissors,
  Sliders,
  FileAudio,
  Shield,
  Zap,
  Headphones,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // --- Convert group ------------------------------------------------------------
  {
    id: 'audio-converter',
    icon: Disc,
    title: 'Audio Format Converter',
    desc: 'Convert between MP3, WAV, FLAC, OGG, and M4A using a professional WebAssembly audio engine.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/audio/convert',
    status: 'soon',
    group: 'convert',
    featured: true,
    tags: ['mp3', 'wav', 'flac', 'ogg', 'm4a', 'convert', 'format', 'audio'],
  },
  {
    id: 'audio-extractor',
    icon: FileAudio,
    title: 'Audio Extractor from Video',
    desc: 'Pull the audio track out of an MP4 or MOV file and save it as MP3 or WAV.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/audio/extract',
    status: 'soon',
    group: 'convert',
    featured: false,
    tags: ['extract', 'video', 'mp4', 'mov', 'mp3', 'wav', 'audio track'],
  },

  // --- Edit group ------------------------------------------------------------
  {
    id: 'audio-trimmer',
    icon: Scissors,
    title: 'Audio Trimmer',
    desc: 'Cut clips or trim silence with a visual waveform editor - set in/out points precisely.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/audio/trim',
    status: 'soon',
    group: 'edit',
    featured: true,
    tags: ['trim', 'cut', 'clip', 'silence', 'waveform', 'audio'],
  },
  {
    id: 'audio-bitrate',
    icon: Sliders,
    title: 'Bitrate & Volume Adjuster',
    desc: 'Change export bitrate or boost and normalize volume levels across your audio file.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/audio/adjust',
    status: 'soon',
    group: 'edit',
    featured: false,
    tags: ['bitrate', 'volume', 'normalize', 'boost', 'quality', 'audio'],
  },
  {
    id: 'audio-merger',
    icon: Headphones,
    title: 'Audio Merger',
    desc: 'Join multiple audio files end-to-end into a single track with crossfade options.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/audio/merge',
    status: 'soon',
    group: 'edit',
    featured: false,
    tags: ['merge', 'join', 'combine', 'crossfade', 'tracks', 'audio'],
  },
];

// --- Groups -------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'convert',
    label: 'Convert & Extract',
    desc: 'Change audio formats or pull audio from video files',
    dot: 'bg-emerald-400',
  },
  {
    id: 'edit',
    label: 'Edit & Adjust',
    desc: 'Trim, merge, normalize, and fine-tune audio',
    dot: 'bg-blue-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: Music,
  iconColor: 'text-emerald-600 dark:text-emerald-400',
  iconBg:
    'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800',
  title: 'Audio Studio',
  subtitle: 'WebAssembly audio engine · 100% private · No account needed',
  description:
    "We're building a full audio toolkit using a high-performance WebAssembly engine - the same approach that powers our image tools - so conversion, trimming, and bitrate control happen entirely on your device.",
  privacyNote:
    '🔒 Audio files never leave your browser - all processing happens locally.',
  accentFrom: 'from-emerald-400',
  accentTo: 'to-emerald-500',
  badgeColor:
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  pills: [
    {
      icon: Shield,
      label: 'Files never leave your device',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'Powered by WebAssembly',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
    {
      icon: Music,
      label: '5 audio tools',
      color:
        'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    },
  ],
};

// --- Page --------------------------------------------------------------------

export default function AudioStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'mp3', 'trim', 'extract'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-emerald-600 dark:hover:text-emerald-400"
      footerNote="Want to be notified when Audio Studio launches?"
      footerCta={{ label: 'Get in touch', href: '/contact' }}
    />
  );
}
