export interface VideoFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
}

// --- Supported formats ----------------------------------------------------

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
];

export const getFormatByExtension = (ext: string): VideoFormat | undefined =>
  VIDEO_FORMATS.find((f) => f.extension === ext);

export const isConversionAllowed = (source: string, target: string): boolean =>
  source !== target &&
  !!getFormatByExtension(source) &&
  !!getFormatByExtension(target);

export const getConversionHref = (source: string, target: string): string =>
  `/video/convert/${source}-to-${target}`;

// --- FFmpeg codec mapping --------------------------------------------------

export function getFFmpegArgsForTarget(target: string): string[] {
  switch (target) {
    case 'mp4':
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
    default:
      throw new Error(`Unsupported target format: ${target}`);
  }
}

// --- Quality/size presets (used by the Compress tool) ----------------------

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
