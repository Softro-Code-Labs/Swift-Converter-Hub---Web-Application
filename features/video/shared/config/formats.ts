export interface VideoFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
}

// --- Supported formats ------------------------------------------------------
// As with audio, every format here is fully round-trippable using codecs
// already confirmed to ship in the standard ffmpeg.wasm core: libx264 (H.264),
// libvpx (VP8/WebM), native mpeg1video/mpeg2video, native msmpeg4-family
// wmv2/wmav2, and libtheora/libvorbis for Ogg. See getFFmpegArgsForTarget for
// the exact codec used per target.

export const VIDEO_FORMATS: VideoFormat[] = [
  {
    label: 'MP4',
    extension: 'mp4',
    mimeType: 'video/mp4',
    description: 'The most widely compatible video format (H.264 + AAC)',
  },
  {
    label: 'WEBM',
    extension: 'webm',
    mimeType: 'video/webm',
    description: 'Open, web-native format - smaller files, great for browsers',
  },
  {
    label: 'MOV',
    extension: 'mov',
    mimeType: 'video/quicktime',
    description: 'Apple QuickTime container - common from iPhone/Mac',
  },
  {
    label: 'AVI',
    extension: 'avi',
    mimeType: 'video/x-msvideo',
    description: 'Older Windows format - still widely supported',
  },
  {
    label: 'MKV',
    extension: 'mkv',
    mimeType: 'video/x-matroska',
    description: 'Flexible open container - supports almost any codec',
  },
  {
    label: 'M4V',
    extension: 'm4v',
    mimeType: 'video/x-m4v',
    description: "Apple's MP4 variant, used for iTunes video downloads",
  },
  {
    label: '3GP',
    extension: '3gp',
    mimeType: 'video/3gpp',
    description: 'Compact mobile video format for older phones and low bandwidth',
  },
  {
    label: 'FLV',
    extension: 'flv',
    mimeType: 'video/x-flv',
    description: 'Flash Video - legacy web format, still used in some streaming pipelines',
  },
  {
    label: 'TS',
    extension: 'ts',
    mimeType: 'video/mp2t',
    description: 'MPEG transport stream - used for broadcast and HLS video segments',
  },
  {
    label: 'WMV',
    extension: 'wmv',
    mimeType: 'video/x-ms-wmv',
    description: 'Windows Media Video - the classic Windows Media Player format',
  },
  {
    label: 'OGV',
    extension: 'ogv',
    mimeType: 'video/ogg',
    description: 'Open, royalty-free format built on Theora video and Vorbis audio',
  },
  {
    label: 'MPG',
    extension: 'mpg',
    mimeType: 'video/mpeg',
    description: 'Classic MPEG-1 video - maximum compatibility with legacy software',
  },
];

// --- Lookup helpers ----------------------------------------------------------

const VIDEO_FORMAT_BY_EXT: ReadonlyMap<string, VideoFormat> = new Map(
  VIDEO_FORMATS.map((f) => [f.extension, f]),
);

export const getFormatByExtension = (ext: string): VideoFormat | undefined =>
  VIDEO_FORMAT_BY_EXT.get(ext.toLowerCase());

export const isConversionAllowed = (source: string, target: string): boolean => {
  const s = source.toLowerCase();
  const t = target.toLowerCase();
  return s !== t && VIDEO_FORMAT_BY_EXT.has(s) && VIDEO_FORMAT_BY_EXT.has(t);
};

export const getConversionHref = (source: string, target: string): string =>
  `/video/convert/${source}-to-${target}`;

// --- FFmpeg codec mapping ----------------------------------------------------

export function getFFmpegArgsForTarget(target: string): string[] {
  switch (target) {
    case 'mp4':
    case 'm4v':
      // Same codec pairing for both - m4v is just Apple's MP4 variant, and
      // FFmpeg picks the right muxer automatically from the output extension.
      return [
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-movflags',
        '+faststart', // moov atom at the front - lets browsers start playback before the whole file downloads
        '-pix_fmt',
        'yuv420p', // widest playback compatibility
      ];
    case 'webm':
      return [
        '-c:v',
        'libvpx',
        '-crf',
        '10',
        '-b:v',
        '1M',
        '-c:a',
        'libvorbis',
      ];
    case 'mov':
      return [
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-pix_fmt',
        'yuv420p',
      ];
    case 'avi':
      return [
        '-c:v',
        'mpeg4',
        '-q:v',
        '5',
        '-c:a',
        'libmp3lame',
        '-b:a',
        '128k',
      ];
    case 'mkv':
      return [
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-pix_fmt',
        'yuv420p',
      ];
    case '3gp':
      return [
        '-c:v',
        'libx264',
        '-profile:v',
        'baseline',
        '-level',
        '3.0',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '96k',
        '-pix_fmt',
        'yuv420p',
      ];
    case 'flv':
      return [
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-pix_fmt',
        'yuv420p',
      ];
    case 'ts':
      return [
        '-c:v',
        'libx264',
        '-preset',
        'ultrafast',
        '-crf',
        '23',
        '-c:a',
        'aac',
        '-b:a',
        '128k',
        '-pix_fmt',
        'yuv420p',
      ];
    case 'wmv':
      // wmv2/wmav2 are native FFmpeg encoders (the msmpeg4/Windows Media
      // family) - bitrate-based rate control rather than CRF, matching how
      // these codecs are conventionally driven.
      return [
        '-c:v',
        'wmv2',
        '-b:v',
        '2M',
        '-c:a',
        'wmav2',
        '-b:a',
        '192k',
      ];
    case 'ogv':
      return [
        '-c:v',
        'libtheora',
        '-qscale:v',
        '7',
        '-c:a',
        'libvorbis',
        '-qscale:a',
        '5',
      ];
    case 'mpg':
      return [
        '-c:v',
        'mpeg1video',
        '-q:v',
        '5',
        '-c:a',
        'mp2',
        '-b:a',
        '192k',
      ];
    default:
      throw new Error(`Unsupported target format: ${target}`);
  }
}

// --- Dev-mode consistency check ----------------------------------------------
if (process.env.NODE_ENV === 'development') {
  VIDEO_FORMATS.forEach((f) => {
    try {
      getFFmpegArgsForTarget(f.extension);
    } catch {
      console.warn(
        `[video/formats] "${f.extension}" is in VIDEO_FORMATS but has no getFFmpegArgsForTarget case`,
      );
    }
  });
}

// --- Quality/size presets (used by the Compress tool) ------------------------

export interface QualityPreset {
  id: 'low' | 'balanced' | 'high';
  label: string;
  hint: string;
  maxHeight: number | null; // null = no resize, keep original resolution
  crf: number; // lower = higher quality/larger file
}

export const QUALITY_PRESETS: QualityPreset[] = [
  {
    id: 'low',
    label: 'Small',
    hint: 'Smallest file, 480p cap',
    maxHeight: 480,
    crf: 30,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    hint: '720p cap, good quality',
    maxHeight: 720,
    crf: 26,
  },
  {
    id: 'high',
    label: 'High quality',
    hint: 'Original resolution',
    maxHeight: null,
    crf: 20,
  },
];

export function getCompressArgs(preset: QualityPreset): string[] {
  const args = [
    '-c:v',
    'libx264',
    '-preset',
    'ultrafast',
    '-crf',
    String(preset.crf),
    '-c:a',
    'aac',
    '-b:a',
    '96k',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
  ];
  if (preset.maxHeight !== null) {
    // -2 keeps width even (required by yuv420p) while preserving aspect ratio
    args.push('-vf', `scale=-2:'min(${preset.maxHeight},ih)'`);
  }
  return args;
}
