export interface AudioFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  kind: 'lossy' | 'lossless';
}

// --- Supported formats ----------------------------------------------------

export const AUDIO_FORMATS: AudioFormat[] = [
  {
    label: 'MP3',
    extension: 'mp3',
    mimeType: 'audio/mpeg',
    description: 'The most widely compatible lossy audio format',
    kind: 'lossy',
  },
  {
    label: 'WAV',
    extension: 'wav',
    mimeType: 'audio/wav',
    description: 'Uncompressed, lossless - the standard for audio editing',
    kind: 'lossless',
  },
  {
    label: 'OGG',
    extension: 'ogg',
    mimeType: 'audio/ogg',
    description: 'Open-source lossy format (Vorbis codec)',
    kind: 'lossy',
  },
  {
    label: 'FLAC',
    extension: 'flac',
    mimeType: 'audio/flac',
    description: 'Lossless compression - smaller than WAV, same quality',
    kind: 'lossless',
  },
  {
    label: 'AAC',
    extension: 'aac',
    mimeType: 'audio/aac',
    description: 'Efficient lossy codec used by YouTube, streaming services',
    kind: 'lossy',
  },
  {
    label: 'M4A',
    extension: 'm4a',
    mimeType: 'audio/mp4',
    description: 'AAC audio in an MP4 container - the Apple ecosystem default',
    kind: 'lossy',
  },
  {
    label: 'OPUS',
    extension: 'opus',
    mimeType: 'audio/opus',
    description: 'Modern, highly efficient codec built for the web',
    kind: 'lossy',
  },
];

export const getFormatByExtension = (ext: string): AudioFormat | undefined =>
  AUDIO_FORMATS.find((f) => f.extension === ext);

export const isConversionAllowed = (source: string, target: string): boolean =>
  source !== target &&
  !!getFormatByExtension(source) &&
  !!getFormatByExtension(target);

export const getConversionHref = (source: string, target: string): string =>
  `/audio/convert/${source}-to-${target}`;

// --- FFmpeg codec mapping --------------------------------------------------

export function getFFmpegArgsForTarget(
  target: string,
  bitrateKbps?: number,
): string[] {
  switch (target) {
    case 'mp3':
      return ['-vn', '-acodec', 'libmp3lame', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'wav':
      return ['-vn', '-acodec', 'pcm_s16le'];
    case 'ogg':
      return ['-vn', '-acodec', 'libvorbis', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'flac':
      return ['-vn', '-acodec', 'flac'];
    case 'aac':
      return ['-vn', '-acodec', 'aac', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'm4a':
      return ['-vn', '-acodec', 'aac', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'opus':
      return ['-vn', '-acodec', 'libopus', '-b:a', `${bitrateKbps ?? 128}k`];
    default:
      throw new Error(`Unsupported target format: ${target}`);
  }
}
