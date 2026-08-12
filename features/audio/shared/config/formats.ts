export interface AudioFormat {
  label: string;
  extension: string;
  mimeType: string;
  description: string;
  kind: 'lossy' | 'lossless';
}

// --- Supported formats ------------------------------------------------------
// Every format below is fully round-trippable with the codecs ffmpeg.wasm
// ships (PCM, AAC, FLAC, AC-3, MP2, WMA plus libmp3lame/vorbis/opus/theora).
// Decode-only formats (AMR, WavPack, Monkey's Audio) are excluded rather
// than offered as a half-working target - see getFFmpegArgsForTarget below.
//
// NOTE: keep 'mp3' first - features/audio/merge and features/video/extract-audio
// fall back to AUDIO_FORMATS[0] as the default output format.

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
  {
    label: 'WMA',
    extension: 'wma',
    mimeType: 'audio/x-ms-wma',
    description:
      'Windows Media Audio - the classic Windows Media Player default',
    kind: 'lossy',
  },
  {
    label: 'AIFF',
    extension: 'aiff',
    mimeType: 'audio/aiff',
    description: "Uncompressed PCM audio - Apple's equivalent of WAV",
    kind: 'lossless',
  },
  {
    label: 'AC3',
    extension: 'ac3',
    mimeType: 'audio/ac3',
    description:
      'Dolby Digital - surround-capable format used for DVD and broadcast',
    kind: 'lossy',
  },
  {
    label: 'AU',
    extension: 'au',
    mimeType: 'audio/basic',
    description: 'Sun/NeXT audio - a simple, long-standing Unix format',
    kind: 'lossless',
  },
  {
    label: 'MP2',
    extension: 'mp2',
    mimeType: 'audio/mpeg',
    description:
      'MPEG Layer II - MP3\u2019s predecessor, still used in broadcast',
    kind: 'lossy',
  },
];

// --- Lookup helpers ----------------------------------------------------------
// Map built once at module load for O(1) lookups, mirroring the pattern
// used by the larger image format table.

const AUDIO_FORMAT_BY_EXT: ReadonlyMap<string, AudioFormat> = new Map(
  AUDIO_FORMATS.map((f) => [f.extension, f]),
);

export const getFormatByExtension = (ext: string): AudioFormat | undefined =>
  AUDIO_FORMAT_BY_EXT.get(ext.toLowerCase());

export const isConversionAllowed = (
  source: string,
  target: string,
): boolean => {
  const s = source.toLowerCase();
  const t = target.toLowerCase();
  return s !== t && AUDIO_FORMAT_BY_EXT.has(s) && AUDIO_FORMAT_BY_EXT.has(t);
};

export const getConversionHref = (source: string, target: string): string =>
  `/audio/convert/${source}-to-${target}`;

// --- FFmpeg codec mapping ----------------------------------------------------
// All codecs here are either native to FFmpeg (pcm_*, aac, flac, ac3, mp2,
// wmav2) or bundled external libraries already relied on elsewhere in this
// app (libmp3lame, libvorbis, libopus) - nothing here introduces a codec the
// ffmpeg.wasm core doesn't already ship.

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
    case 'wma':
      // Container is auto-detected from the .wma extension (asf muxer).
      return ['-vn', '-acodec', 'wmav2', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'aiff':
      // AIFF is conventionally big-endian PCM (mirrors WAV's little-endian pcm_s16le).
      return ['-vn', '-acodec', 'pcm_s16be'];
    case 'ac3':
      return ['-vn', '-acodec', 'ac3', '-b:a', `${bitrateKbps ?? 192}k`];
    case 'au':
      return ['-vn', '-acodec', 'pcm_s16be'];
    case 'mp2':
      return ['-vn', '-acodec', 'mp2', '-b:a', `${bitrateKbps ?? 192}k`];
    default:
      throw new Error(`Unsupported target format: ${target}`);
  }
}

// --- Compress-specific bitrate clamping --------------------------------------
// getFFmpegArgsForTarget above always encodes at exactly the requested
// bitrate, which is correct for Convert/Volume/Merge/Extract-Audio - the
// user explicitly asked for that bitrate. But blindly doing the same thing
// for "Compress" means re-encoding a file at a preset *higher* than its
// current bitrate doesn't compress it at all - it just adds a second lossy
// pass on top of a bigger target for zero real quality gain. Mirrors the
// video compressor's sourceBitrateKbps/bitrateRatio approach (see
// video/shared/config/formats.ts -> getCompressArgs) so a "compress" always
// actually shrinks the file.
const AUDIO_COMPRESS_RATIO = 0.9; // cap = this fraction of the source's own bitrate
const AUDIO_COMPRESS_FLOOR_KBPS = 48; // floor so a low-bitrate source isn't crushed further
const AUDIO_COMPRESS_OPUS_FLOOR_KBPS = 32; // opus stays intelligible much lower than that

/**
 * @param sourceBitrateKbps - the SOURCE file's own overall bitrate
 * (fileSizeBytes*8 / durationSeconds / 1000), if known. Pass this whenever
 * possible - without it, this falls back to the plain preset bitrate with
 * no ceiling, which cannot guarantee the output is smaller than the input.
 */
export function getAudioCompressArgs(
  target: string,
  presetKbps: number,
  sourceBitrateKbps?: number,
): string[] {
  let effectiveKbps = presetKbps;

  if (sourceBitrateKbps && Number.isFinite(sourceBitrateKbps)) {
    const floor =
      target === 'opus'
        ? AUDIO_COMPRESS_OPUS_FLOOR_KBPS
        : AUDIO_COMPRESS_FLOOR_KBPS;
    effectiveKbps = Math.max(
      floor,
      Math.min(presetKbps, sourceBitrateKbps * AUDIO_COMPRESS_RATIO),
    );
  }

  return getFFmpegArgsForTarget(target, Math.round(effectiveKbps));
}

// --- Custom mode (Compress tool) ----------------------------------------------
// Mirrors video/shared/config/formats.ts's CUSTOM_CRF_* constants: Low/
// Standard/High (from BITRATE_PRESETS in audio/convert/types/converter.ts)
// cover the common cases, and Custom lets the bitrate slider range a bit
// past both ends of those presets.
export const CUSTOM_BITRATE_MIN = 32; // lower than "Low" (96) - fine for spoken word
export const CUSTOM_BITRATE_MAX = 384; // higher than "High" (320)
export const CUSTOM_BITRATE_DEFAULT = 192; // matches "Standard"

// --- Dev-mode consistency check ----------------------------------------------
// Catches drift between AUDIO_FORMATS and getFFmpegArgsForTarget early - the
// same guard the (much larger) image format table already runs.
if (process.env.NODE_ENV === 'development') {
  AUDIO_FORMATS.forEach((f) => {
    try {
      getFFmpegArgsForTarget(f.extension);
    } catch {
      console.warn(
        `[audio/formats] "${f.extension}" is in AUDIO_FORMATS but has no getFFmpegArgsForTarget case`,
      );
    }
  });
}
