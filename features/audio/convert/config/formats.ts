export {
  AUDIO_FORMATS,
  getFormatByExtension,
  isConversionAllowed,
  getConversionHref,
  getFFmpegArgsForTarget,
} from '@/features/audio/shared/config/formats';
export type { AudioFormat } from '@/features/audio/shared/config/formats';

import {
  AUDIO_FORMATS,
  getFormatByExtension,
} from '@/features/audio/shared/config/formats';

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

export const ALL_CONVERSION_PAIRS = AUDIO_FORMATS.flatMap((source) =>
  AUDIO_FORMATS.filter((target) => target.extension !== source.extension).map(
    (target) => ({ source: source.extension, target: target.extension }),
  ),
);

export const HIGH_TRAFFIC_PAIRS = new Set([
  'mp3-to-wav',
  'wav-to-mp3',
  'mp3-to-ogg',
  'ogg-to-mp3',
  'mp3-to-flac',
  'flac-to-mp3',
  'mp3-to-aac',
  'aac-to-mp3',
  'mp3-to-m4a',
  'm4a-to-mp3',
  'wav-to-flac',
  'flac-to-wav',
  'm4a-to-wav',
  'wav-to-m4a',
  'aac-to-wav',
  'ogg-to-wav',
  'wav-to-ogg',
  'm4a-to-aac',
  'mp3-to-opus',
  'opus-to-mp3',
]);

// Pre-rendered (and kept indexable) at build time alongside HIGH_TRAFFIC_PAIRS,
// but ranked a notch below it - see app/audio/convert/[conversion]/page.tsx
// and app/sitemap.ts.
export const MEDIUM_TRAFFIC_PAIRS = new Set([
  'wma-to-mp3',
  'mp3-to-wma',
  'wma-to-wav',
  'wav-to-wma',
  'aiff-to-mp3',
  'mp3-to-aiff',
  'aiff-to-wav',
  'wav-to-aiff',
  'aiff-to-flac',
  'ac3-to-mp3',
  'mp3-to-ac3',
  'ac3-to-wav',
  'au-to-mp3',
  'au-to-wav',
  'mp2-to-mp3',
  'mp3-to-mp2',
  'm4a-to-flac',
  'flac-to-m4a',
  'ogg-to-flac',
  'flac-to-ogg',
  'opus-to-wav',
  'wav-to-opus',
  'aac-to-flac',
  'flac-to-aac',
]);

const DEFAULT_FEATURES = (source: string, target: string) => {
  const sourceFmt = getFormatByExtension(source.toLowerCase());
  const targetFmt = getFormatByExtension(target.toLowerCase());
  const targetLossless = targetFmt?.kind === 'lossless';
  const sourceLossless = sourceFmt?.kind === 'lossless';

  const features = [
    {
      icon: 'Lock',
      title: '100% private',
      description: `Your ${source} files convert entirely in your browser - nothing is ever uploaded to a server.`,
    },
    {
      icon: 'Zap',
      title: 'Batch conversion',
      description: `Convert multiple ${source} files to ${target} at once, then download them all as a ZIP.`,
    },
  ];

  if (targetLossless && !sourceLossless) {
    features.push({
      icon: 'ShieldCheck',
      title: "Won't add extra loss",
      description: `${target} is lossless, so this conversion won't degrade quality further - though it can't restore detail already lost when the source was encoded as ${source}.`,
    });
  } else if (!targetLossless && sourceLossless) {
    features.push({
      icon: 'Sliders',
      title: 'Adjustable bitrate',
      description: `Choose the output bitrate to balance ${target} file size against audio quality.`,
    });
  } else if (!targetLossless && !sourceLossless) {
    features.push({
      icon: 'SlidersHorizontal',
      title: 'Re-encode with control',
      description: `Set a target bitrate for the new ${target} file rather than accepting a default.`,
    });
  } else {
    features.push({
      icon: 'FileAudio',
      title: 'Bit-perfect option',
      description: `Both ${source} and ${target} are lossless, so quality is fully preserved end to end.`,
    });
  }

  features.push({
    icon: 'Gauge',
    title: 'No file size limits',
    description:
      "Since nothing uploads to a server, there's no artificial cap on how large a file you can convert.",
  });

  return features;
};

const DEFAULT_FAQS = (source: string, target: string) => {
  const sourceFmt = getFormatByExtension(source.toLowerCase());
  const targetFmt = getFormatByExtension(target.toLowerCase());
  const faqs: { q: string; a: string }[] = [
    {
      q: `Is converting ${source} to ${target} free?`,
      a: `Yes - conversion happens locally in your browser using FFmpeg compiled to WebAssembly, so there's no per-file cost, watermark, or account required.`,
    },
    {
      q: `Will converting ${source} to ${target} reduce audio quality?`,
      a:
        targetFmt?.kind === 'lossless' && sourceFmt?.kind === 'lossless'
          ? `No - both formats are lossless, so no audio data is discarded during conversion.`
          : targetFmt?.kind === 'lossless'
            ? `The output won't lose any additional quality during this conversion, but it also can't restore detail that was already discarded if the original ${source} file was itself compressed lossy.`
            : `Converting to ${target} re-encodes the audio, which involves some quality loss - this is inherent to any lossy format, not specific to this tool. Use a higher bitrate for better quality at the cost of file size.`,
    },
    {
      q: `Is there a file size or duration limit?`,
      a: `No hard limit is imposed by this tool, since files never leave your device. Very large files are bounded only by your browser's available memory.`,
    },
    {
      q: `Do you store or see my audio files?`,
      a: `No. The conversion runs with FFmpeg compiled to WebAssembly directly in your browser tab - your files are never transmitted anywhere.`,
    },
  ];
  return faqs;
};

const ROUTE_OVERRIDES: Partial<Record<string, Partial<ConversionRoute>>> = {
  'mp3-to-wav': {
    keywords: [
      'mp3 to wav converter',
      'mp3 to wav online free',
      'convert mp3 to wav browser',
      'mp3 wav no upload',
      'mp3 to wav for editing',
      'batch mp3 to wav',
      'mp3 wav private converter',
      'mp3 to uncompressed wav',
    ],
  },
  'wav-to-mp3': {
    keywords: [
      'wav to mp3 converter',
      'wav to mp3 online free',
      'convert wav to mp3 browser',
      'wav mp3 no upload',
      'compress wav to mp3',
      'batch wav to mp3',
      'wav mp3 private converter',
      'reduce wav file size',
    ],
  },
  'm4a-to-mp3': {
    keywords: [
      'm4a to mp3 converter',
      'convert m4a to mp3 online',
      'iphone m4a to mp3',
      'apple music m4a to mp3',
      'm4a mp3 no upload',
      'voice memo m4a to mp3',
      'batch m4a to mp3',
      'm4a mp3 private converter',
    ],
  },
  'mp3-to-flac': {
    keywords: [
      'mp3 to flac converter',
      'convert mp3 to flac online',
      'mp3 flac no upload',
      'mp3 to lossless flac',
      'batch mp3 to flac',
      'mp3 flac private converter',
    ],
  },
  'wma-to-mp3': {
    keywords: [
      'wma to mp3 converter',
      'convert wma to mp3 online free',
      'old windows media audio to mp3',
      'wma mp3 no upload',
      'batch wma to mp3',
      'wma to mp3 private converter',
    ],
  },
  'aiff-to-wav': {
    keywords: [
      'aiff to wav converter',
      'convert aiff to wav online',
      'apple lossless aiff to wav',
      'aiff wav no upload',
      'batch aiff to wav',
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
    `how to convert ${source} to ${target}`,
    `${source} to ${target} converter no signup`,
    `best ${source} to ${target} converter online`,
  ];

  return {
    source,
    target,
    title: override.title ?? `${sourceLabel} to ${targetLabel} Converter`,
    description:
      override.description ??
      `Convert ${sourceLabel} audio to ${targetLabel} instantly in your browser. Batch convert multiple files, adjust bitrate, and download - zero uploads, 100% private.`,
    // Hand-crafted override keywords go first so they always survive the cap;
    // the templated base keywords fill in behind them and get deduped.
    keywords: override.keywords
      ? Array.from(new Set([...override.keywords, ...baseKeywords])).slice(
          0,
          20,
        )
      : baseKeywords,
    features: override.features ?? DEFAULT_FEATURES(sourceLabel, targetLabel),
    faqs: override.faqs ?? DEFAULT_FAQS(sourceLabel, targetLabel),
  };
};
