'use client';

import {
  Video,
  Film,
  Scissors,
  Tv,
  Zap,
  Shield,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // --- Process group ------------------------------------------------------------
  {
    id: 'video-converter',
    icon: Film,
    title: 'Video Format Converter',
    desc: 'Convert between MP4, WebM, MOV, and AVI containers - powered by a WebAssembly FFmpeg engine.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/video/convert',
    status: 'soon',
    group: 'process',
    featured: true,
    tags: ['mp4', 'webm', 'mov', 'avi', 'convert', 'format', 'video'],
  },
  {
    id: 'video-trimmer',
    icon: Scissors,
    title: 'Video Trimmer',
    desc: 'Cut a clip to an exact start and end timestamp with a visual timeline scrubber.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/video/trim',
    status: 'soon',
    group: 'process',
    featured: true,
    tags: ['trim', 'cut', 'clip', 'timestamp', 'split', 'video'],
  },
  {
    id: 'video-compressor',
    icon: Tv,
    title: 'Video Compressor',
    desc: 'Reduce file size to fit email or messaging app limits without noticeable quality loss.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/video/compress',
    status: 'soon',
    group: 'process',
    featured: false,
    tags: ['compress', 'reduce', 'size', 'optimize', 'shrink', 'video'],
  },

  // --- Export group ------------------------------------------------------------
  {
    id: 'video-to-gif',
    icon: Zap,
    title: 'Video to GIF',
    desc: 'Export any clip as a looping GIF with custom frame rate and resolution controls.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/video/gif',
    status: 'soon',
    group: 'export',
    featured: false,
    tags: ['gif', 'animate', 'loop', 'export', 'frame rate', 'video'],
  },
  {
    id: 'video-to-audio',
    icon: Cpu,
    title: 'Extract Audio from Video',
    desc: 'Pull the audio track out of any MP4, MOV, or WebM file as MP3 or WAV.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/video/extract-audio',
    status: 'soon',
    group: 'export',
    featured: false,
    tags: ['audio', 'extract', 'mp3', 'wav', 'soundtrack', 'video'],
  },
];

// --- Groups ------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'process',
    label: 'Process & Edit',
    desc: 'Convert formats, trim clips, and compress videos',
    dot: 'bg-purple-400',
  },
  {
    id: 'export',
    label: 'Export & Extract',
    desc: 'Turn videos into GIFs or pull out the audio track',
    dot: 'bg-amber-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: Video,
  iconColor: 'text-purple-600 dark:text-purple-400',
  iconBg:
    'bg-purple-100 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800',
  title: 'Video Studio',
  subtitle:
    'WebAssembly-powered · Files stay on device · Best for clips under 10 min',
  description:
    "Video processing is heavier than image work, so we're building these tools carefully on a high-performance WebAssembly engine to ensure they run smoothly even on lower-powered devices.",
  privacyNote:
    '⚠️ Large video files may be slower in-browser than desktop software - best for clips under a few minutes.',
  accentFrom: 'from-purple-400',
  accentTo: 'to-purple-500',
  badgeColor:
    'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  pills: [
    {
      icon: Shield,
      label: 'Videos never leave your device',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'Powered by WebAssembly',
      color:
        'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',
    },
    {
      icon: AlertTriangle,
      label: 'Best for clips under 10 min',
      color:
        'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
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
      searchPlaceholder="Search tools - try 'convert', 'trim', 'gif'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-purple-600 dark:hover:text-purple-400"
      footerNote="Curious about progress?"
      footerCta={{ label: 'Ask us', href: '/contact' }}
    />
  );
}
