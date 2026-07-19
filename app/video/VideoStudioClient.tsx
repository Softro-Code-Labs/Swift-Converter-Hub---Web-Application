'use client';

import {
  Clapperboard,
  RefreshCw,
  Scissors,
  Minimize2,
  AudioLines,
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
    title: 'Video Format Converter',
    desc: 'Convert between MP4, WEBM, MOV, AVI, MKV, M4V, 3GP, FLV, WMV and more - batch process and download.',
    color: 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/video/convert',
    status: 'live',
    group: 'convert',
    featured: true,
    tags: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'wmv', '3gp', 'convert', 'format'],
  },

  // -- Edit group ------------------------------------------------------
  {
    id: 'trim',
    icon: Scissors,
    title: 'Trim Video',
    desc: 'Cut a clip from any video file - set a start and end point, preview, and download.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/video/trim',
    status: 'live',
    group: 'edit',
    featured: true,
    tags: ['trim', 'cut', 'clip', 'crop video', 'shorten'],
  },
  {
    id: 'to-gif',
    icon: Clapperboard,
    title: 'Video to GIF',
    desc: 'Turn a clip into a high-quality animated GIF - set the range, frame rate, and size.',
    color: 'bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400',
    accentBorder: 'hover:border-pink-300 dark:hover:border-pink-700',
    accentText: 'group-hover:text-pink-600 dark:group-hover:text-pink-400',
    href: '/video/to-gif',
    status: 'live',
    group: 'edit',
    featured: true,
    tags: ['gif', 'animated gif', 'gif maker', 'meme', 'clip to gif'],
  },
  {
    id: 'extract-audio',
    icon: AudioLines,
    title: 'Extract Audio',
    desc: 'Pull the audio track out of a video and save it as MP3, WAV, or another format.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/video/extract-audio',
    status: 'live',
    group: 'edit',
    featured: false,
    tags: ['extract audio', 'video to mp3', 'audio track', 'rip audio', 'sound'],
  },

  // -- Optimize group --------------------------------------------------
  {
    id: 'compress',
    icon: Minimize2,
    title: 'Compress Video',
    desc: 'Shrink file size with a resolution cap and quality preset - batch process up to 5 files.',
    color: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/video/compress',
    status: 'live',
    group: 'optimize',
    featured: false,
    tags: ['compress', 'resolution', 'shrink', 'reduce size', 'optimize'],
  },
];

// --- Groups -------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'convert',
    label: 'Format Conversion',
    desc: 'Convert between MP4, WEBM, MOV, AVI and MKV',
    dot: 'bg-purple-400',
  },
  {
    id: 'edit',
    label: 'Trim, GIF & Extract',
    desc: 'Cut clips, make GIFs, and pull out audio',
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
  icon: Clapperboard,
  iconColor: 'text-purple-600 dark:text-purple-400',
  iconBg:
    'bg-purple-100 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
  title: 'Video Studio',
  subtitle: 'Client-side video processing · No file uploads · Any size',
  description:
    'Every Video Studio tool runs entirely in your browser using FFmpeg compiled to WebAssembly - no server round-trips, no upload wait, no size limit beyond your own device memory.',
  privacyNote:
    '🔒 Your video files never leave your device - processed entirely in-browser.',
  accentFrom: 'from-purple-400',
  accentTo: 'to-purple-500',
  badgeColor:
    'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
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
      icon: Clapperboard,
      label: '5 video tools',
      color:
        'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    },
  ],
};

// --- Page ---------------------------------------------------------------------

export default function VideoStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'mp4', 'trim', 'gif'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-purple-600 dark:hover:text-purple-400"
      footerNote="Need a specific video tool?"
      footerCta={{ label: 'Let us know', href: '/contact' }}
    />
  );
}
