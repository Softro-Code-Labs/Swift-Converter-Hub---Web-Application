export {
  VIDEO_FORMATS,
  getFormatByExtension,
  isConversionAllowed,
  getConversionHref,
  getFFmpegArgsForTarget,
} from '@/features/video/shared/config/formats';
export type { VideoFormat } from '@/features/video/shared/config/formats';

import {
  VIDEO_FORMATS,
  getFormatByExtension,
} from '@/features/video/shared/config/formats';

// --- SEO route content ------------------------------------------------------

export interface ConversionRoute {
  source: string;
  target: string;
  title: string;
  description: string;
  keywords: string[];
  features: { icon: string; title: string; description: string }[];
  faqs: { q: string; a: string }[];
}

// Derived from VIDEO_FORMATS (rather than a hardcoded extension list) so
// every newly supported format is automatically covered here, in the
// sitemap, and in generateStaticParams - nothing to remember to keep in sync.
export const ALL_CONVERSION_PAIRS = VIDEO_FORMATS.flatMap((source) =>
  VIDEO_FORMATS.filter((target) => target.extension !== source.extension).map(
    (target) => ({ source: source.extension, target: target.extension }),
  ),
);

// Pre-rendered at build time via generateStaticParams
export const HIGH_TRAFFIC_PAIRS = new Set([
  'mov-to-mp4',
  'mp4-to-mov',
  'webm-to-mp4',
  'mp4-to-webm',
  'avi-to-mp4',
  'mp4-to-avi',
  'mkv-to-mp4',
  'mp4-to-mkv',
  'mov-to-webm',
  'webm-to-mov',
]);

// Pre-rendered (and kept indexable) alongside HIGH_TRAFFIC_PAIRS, but ranked
// a notch below it - see app/video/convert/[conversion]/page.tsx and
// app/sitemap.ts.
export const MEDIUM_TRAFFIC_PAIRS = new Set([
  'mp4-to-m4v',
  'm4v-to-mp4',
  'mp4-to-3gp',
  '3gp-to-mp4',
  'mp4-to-flv',
  'flv-to-mp4',
  'mp4-to-ts',
  'ts-to-mp4',
  'mp4-to-wmv',
  'wmv-to-mp4',
  'mp4-to-ogv',
  'ogv-to-mp4',
  'mp4-to-mpg',
  'mpg-to-mp4',
  'webm-to-mkv',
  'mkv-to-webm',
  'mov-to-mkv',
  'mkv-to-mov',
]);

const DEFAULT_FEATURES = (source: string, target: string) => [
  {
    icon: 'Lock',
    title: '100% private',
    description: `Your ${source} files convert entirely in your browser - nothing is ever uploaded to a server.`,
  },
  {
    icon: 'Film',
    title: 'Preserves resolution',
    description: `Your video's original resolution and aspect ratio are kept - this tool changes format, not size (use Compress for that).`,
  },
  {
    icon: 'Zap',
    title: 'Fast encoding preset',
    description: `Uses a speed-optimized encoding preset so conversion doesn't take longer than necessary in your browser.`,
  },
  {
    icon: 'Gauge',
    title: 'No file size limits',
    description:
      "Since nothing uploads to a server, there's no artificial cap on how large a file you can convert - just your device's own memory.",
  },
];

const DEFAULT_FAQS = (source: string, target: string) => [
  {
    q: `Is converting ${source} to ${target} free?`,
    a: `Yes - conversion happens locally in your browser using FFmpeg compiled to WebAssembly, so there's no per-file cost, watermark, or account required.`,
  },
  {
    q: `Will converting ${source} to ${target} take a long time?`,
    a: `Video encoding is more CPU-intensive than audio or image conversion, so larger or longer files take longer - this tool uses a fast encoding preset to keep it as quick as possible, but a multi-minute video may take a couple of minutes.`,
  },
  {
    q: `Will the quality be reduced?`,
    a: `Converting between compressed video formats always involves some re-encoding, which has a quality trade-off inherent to any lossy video codec - not specific to this tool. The original resolution is preserved, and default quality settings are tuned to avoid a visible difference for most content.`,
  },
  {
    q: `Do you store or see my video files?`,
    a: `No. The conversion runs with FFmpeg compiled to WebAssembly directly in your browser tab - your files are never transmitted anywhere.`,
  },
];

const ROUTE_OVERRIDES: Partial<Record<string, Partial<ConversionRoute>>> = {
  'mov-to-mp4': {
    keywords: [
      'mov to mp4 converter',
      'convert mov to mp4 online free',
      'iphone mov to mp4',
      'quicktime to mp4 converter',
      'mov mp4 no upload',
      'batch mov to mp4',
      'mov to mp4 private converter',
      'iphone video to mp4',
    ],
  },
  'webm-to-mp4': {
    keywords: [
      'webm to mp4 converter',
      'convert webm to mp4 online',
      'webm mp4 no upload',
      'browser webm to mp4',
      'batch webm to mp4',
      'webm to mp4 private converter',
    ],
  },
  'mp4-to-webm': {
    keywords: [
      'mp4 to webm converter',
      'convert mp4 to webm online',
      'mp4 webm no upload',
      'compress mp4 to webm',
      'mp4 to webm private converter',
    ],
  },
  'mp4-to-3gp': {
    keywords: [
      'mp4 to 3gp converter',
      'convert mp4 to 3gp online free',
      'mp4 to 3gp for old phones',
      '3gp mobile video converter',
      'batch mp4 to 3gp',
    ],
  },
  'mp4-to-wmv': {
    keywords: [
      'mp4 to wmv converter',
      'convert mp4 to wmv online',
      'windows media video converter',
      'mp4 wmv no upload',
      'batch mp4 to wmv',
    ],
  },
};

export const getConversionRoute = (
  source: string,
  target: string,
): ConversionRoute => {
  const sourceFmt = getFormatByExtension(source);
  const targetFmt = getFormatByExtension(target);
  const sourceLabel = sourceFmt?.label ?? source.toUpperCase();
  const targetLabel = targetFmt?.label ?? target.toUpperCase();

  const key = `${source}-to-${target}`;
  const override = ROUTE_OVERRIDES[key] ?? {};

  const baseKeywords = [
    `${source} to ${target}`,
    `${source} to ${target} converter`,
    `convert ${source} to ${target}`,
    `${source} to ${target} online`,
    `${source} to ${target} free`,
    `free ${source} to ${target} converter`,
    `batch ${source} to ${target} converter`,
    `browser based ${source} to ${target} converter`,
    `private ${source} to ${target} conversion`,
    `${source} to ${target} converter no upload`,
  ];

  return {
    source,
    target,
    title: override.title ?? `${sourceLabel} to ${targetLabel} Converter`,
    description:
      override.description ??
      `Convert ${sourceLabel} video to ${targetLabel} instantly in your browser. Batch convert, preserve resolution, and download - zero uploads, 100% private.`,
    keywords: override.keywords
      ? Array.from(new Set([...baseKeywords, ...override.keywords])).slice(
          0,
          14,
        )
      : baseKeywords,
    features: override.features ?? DEFAULT_FEATURES(sourceLabel, targetLabel),
    faqs: override.faqs ?? DEFAULT_FAQS(sourceLabel, targetLabel),
  };
};
