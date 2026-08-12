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
    description:
      'Compact mobile video format for older phones and low bandwidth',
  },
  {
    label: 'FLV',
    extension: 'flv',
    mimeType: 'video/x-flv',
    description:
      'Flash Video - legacy web format, still used in some streaming pipelines',
  },
  {
    label: 'TS',
    extension: 'ts',
    mimeType: 'video/mp2t',
    description:
      'MPEG transport stream - used for broadcast and HLS video segments',
  },
  {
    label: 'WMV',
    extension: 'wmv',
    mimeType: 'video/x-ms-wmv',
    description:
      'Windows Media Video - the classic Windows Media Player format',
  },
  {
    label: 'OGV',
    extension: 'ogv',
    mimeType: 'video/ogg',
    description:
      'Open, royalty-free format built on Theora video and Vorbis audio',
  },
  {
    label: 'MPG',
    extension: 'mpg',
    mimeType: 'video/mpeg',
    description:
      'Classic MPEG-1 video - maximum compatibility with legacy software',
  },
];

// --- Lookup helpers ----------------------------------------------------------

const VIDEO_FORMAT_BY_EXT: ReadonlyMap<string, VideoFormat> = new Map(
  VIDEO_FORMATS.map((f) => [f.extension, f]),
);

export const getFormatByExtension = (ext: string): VideoFormat | undefined =>
  VIDEO_FORMAT_BY_EXT.get(ext.toLowerCase());

export const isConversionAllowed = (
  source: string,
  target: string,
): boolean => {
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
        'veryfast',
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
        'veryfast',
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
        'veryfast',
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
        'veryfast',
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
        'veryfast',
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
        'veryfast',
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
      return ['-c:v', 'wmv2', '-b:v', '2M', '-c:a', 'wmav2', '-b:a', '192k'];
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
      return ['-c:v', 'mpeg1video', '-q:v', '5', '-c:a', 'mp2', '-b:a', '192k'];
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

// --- Video-only codec lookup (used by Trim) ----------------------------------
// Trim needs to re-encode the video stream to cut cleanly at an arbitrary,
// non-keyframe point (see useVideoTrim.ts) while keeping the SAME container
// as the source, so it can't just always reach for libx264 the way a "convert
// to mp4" target can - every container here only accepts certain codecs
// (webm can't hold H.264, wmv's own player expects wmv2, etc). This mirrors
// the codec choice getFFmpegArgsForTarget already uses for each container,
// just isolated to the video stream so Trim can pair it with '-c:a copy'
// instead of also re-encoding audio, which never had the keyframe problem.
export function getVideoCodecArgsForContainer(ext: string): string[] {
  switch (ext) {
    case 'mp4':
    case 'm4v':
    case 'mov':
    case 'mkv':
    case 'flv':
    case 'ts':
      return [
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-crf',
        '20',
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
        'veryfast',
        '-crf',
        '20',
        '-pix_fmt',
        'yuv420p',
      ];
    case 'webm':
      return ['-c:v', 'libvpx', '-crf', '10', '-b:v', '1M'];
    case 'avi':
      return ['-c:v', 'mpeg4', '-q:v', '5'];
    case 'wmv':
      return ['-c:v', 'wmv2', '-b:v', '2M'];
    case 'ogv':
      return ['-c:v', 'libtheora', '-qscale:v', '7'];
    case 'mpg':
      return ['-c:v', 'mpeg1video', '-q:v', '5'];
    default:
      // getFormatByExtension() in the caller already guards against
      // genuinely unrecognized extensions before this is ever reached.
      return [
        '-c:v',
        'libx264',
        '-preset',
        'veryfast',
        '-crf',
        '20',
        '-pix_fmt',
        'yuv420p',
      ];
  }
}

// --- Quality/size presets (used by the Compress tool) ------------------------

export interface QualityPreset {
  id: 'low' | 'balanced' | 'high' | 'custom';
  label: string;
  hint: string;
  maxHeight: number | null; // null = no resize, keep original resolution
  crf: number; // lower = higher quality/larger file
  // The fields below cap the encoder's bitrate relative to the SOURCE
  // file's own bitrate. CRF alone only targets a perceptual quality level -
  // it has no idea how compressed the source already is, so on a source
  // that's already efficiently encoded, CRF can happily ask for *more*
  // bits than the source used and produce a larger output file. These
  // fields fix that by giving the encoder a hard ceiling to stay under.
  bitrateRatio: number; // cap = this fraction of the source's own overall bitrate
  minVideoKbps: number; // floor so an already-tiny source isn't crushed further
  audioKbps: number; // this preset's target audio bitrate
}

export const QUALITY_PRESETS: QualityPreset[] = [
  {
    id: 'low',
    label: 'Small',
    hint: 'Smallest file, 480p cap',
    maxHeight: 480,
    crf: 30,
    bitrateRatio: 0.4,
    minVideoKbps: 400,
    audioKbps: 64,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    hint: '720p cap, good quality',
    maxHeight: 720,
    crf: 26,
    bitrateRatio: 0.6,
    minVideoKbps: 800,
    audioKbps: 96,
  },
  {
    id: 'high',
    label: 'High quality',
    hint: 'Original resolution',
    maxHeight: null,
    crf: 20,
    bitrateRatio: 0.85,
    minVideoKbps: 1500,
    audioKbps: 128,
  },
];

// --- Custom mode --------------------------------------------------------------
//
// Lets someone pick their own CRF (quality) and resolution cap instead of
// one of the 3 fixed presets above. It still needs a bitrateRatio/
// minVideoKbps/audioKbps to plug into the same bitrate-safety-net that the
// fixed presets use (see getCompressArgs) - rather than making the user
// tune those directly (far too technical for what should be a simple
// slider), they're interpolated from the 3 tuned presets above, keyed off
// wherever the chosen CRF falls between them.

export const CUSTOM_CRF_MIN = 16; // a little higher quality than "High quality"
export const CUSTOM_CRF_MAX = 34; // a little smaller than "Small"
export const CUSTOM_CRF_DEFAULT = 26;

export const CUSTOM_RESOLUTION_OPTIONS: {
  label: string;
  maxHeight: number | null;
}[] = [
  { label: 'Original', maxHeight: null },
  { label: '1080p', maxHeight: 1080 },
  { label: '720p', maxHeight: 720 },
  { label: '480p', maxHeight: 480 },
  { label: '360p', maxHeight: 360 },
];

export const CUSTOM_FPS_OPTIONS: { label: string; fps: number | null }[] = [
  { label: 'Original', fps: null },
  { label: '30 fps', fps: 30 },
  { label: '24 fps', fps: 24 },
  { label: '15 fps', fps: 15 },
];

export type CustomEncodeMode = 'quality' | 'bitrate';

export const CUSTOM_BITRATE_MIN_KBPS = 300;
export const CUSTOM_BITRATE_MAX_KBPS = 20000;
export const CUSTOM_BITRATE_DEFAULT_KBPS = 2500;

export function buildCustomPreset(
  crf: number,
  maxHeight: number | null,
): QualityPreset {
  const anchors = [...QUALITY_PRESETS].sort((a, b) => a.crf - b.crf);
  const clampedCrf = Math.min(
    Math.max(crf, anchors[0].crf),
    anchors[anchors.length - 1].crf,
  );

  let lower = anchors[0];
  let upper = anchors[anchors.length - 1];
  for (let i = 0; i < anchors.length - 1; i++) {
    if (clampedCrf >= anchors[i].crf && clampedCrf <= anchors[i + 1].crf) {
      lower = anchors[i];
      upper = anchors[i + 1];
      break;
    }
  }

  const t =
    upper.crf === lower.crf
      ? 0
      : (clampedCrf - lower.crf) / (upper.crf - lower.crf);
  const lerp = (a: number, b: number) => a + (b - a) * t;

  return {
    id: 'custom',
    label: 'Custom',
    hint: 'Pick your own settings',
    maxHeight,
    crf,
    bitrateRatio: lerp(lower.bitrateRatio, upper.bitrateRatio),
    minVideoKbps: Math.round(lerp(lower.minVideoKbps, upper.minVideoKbps)),
    audioKbps: Math.round(lerp(lower.audioKbps, upper.audioKbps)),
  };
}

export interface CustomEncodeOptions {
  fps?: number | null;
  mode?: CustomEncodeMode;
  targetBitrateKbps?: number;
}

/**
 * @param sourceBitrateKbps - the SOURCE file's own overall bitrate
 * (fileSizeBytes*8 / durationSeconds / 1000), if known. Pass this whenever
 * possible - without it, encoding falls back to plain CRF with no ceiling,
 * which cannot guarantee the output is smaller than the input. Ignored
 * when customOptions specifies bitrate mode, since the target bitrate
 * itself is already an explicit, user-chosen ceiling.
 * @param customOptions - only used by Custom mode. `mode: 'bitrate'` swaps
 * CRF-based encoding for a direct bitrate target (mirrors most editors'
 * "Constant Quality" vs "Average Bitrate" choice - the two are alternate
 * strategies, not something you'd combine). `fps` applies to either mode.
 */
export function getCompressArgs(
  preset: QualityPreset,
  sourceBitrateKbps?: number,
  customOptions?: CustomEncodeOptions,
): string[] {
  const useBitrateMode =
    customOptions?.mode === 'bitrate' && !!customOptions.targetBitrateKbps;

  const args = ['-c:v', 'libx264', '-preset', 'veryfast'];

  if (useBitrateMode) {
    const targetKbps = customOptions!.targetBitrateKbps!;
    // 1.5x target is a standard, widely-used maxrate ratio (same guidance
    // YouTube's own encoding recommendations use) - gives the encoder
    // headroom for complex scenes while keeping the average near target.
    args.push(
      '-b:v',
      `${targetKbps}k`,
      '-maxrate',
      `${Math.round(targetKbps * 1.5)}k`,
      '-bufsize',
      `${targetKbps * 2}k`,
    );
  } else {
    args.push('-crf', String(preset.crf));

    if (sourceBitrateKbps && Number.isFinite(sourceBitrateKbps)) {
      // -maxrate/-bufsize is a ceiling layered on top of CRF, not a target -
      // it only ever pulls the bitrate DOWN when CRF would otherwise exceed
      // it, never pushes it up. So it's always safe to apply: on a source
      // that's already efficient it forces real compression, and on a source
      // with room to spare it simply never binds.
      const targetTotalKbps = Math.max(
        preset.minVideoKbps + preset.audioKbps,
        sourceBitrateKbps * preset.bitrateRatio,
      );
      const videoCeilingKbps = Math.round(targetTotalKbps - preset.audioKbps);
      args.push(
        '-maxrate',
        `${videoCeilingKbps}k`,
        '-bufsize',
        `${videoCeilingKbps * 2}k`,
      );
    }
  }

  args.push(
    '-c:a',
    'aac',
    '-b:a',
    `${preset.audioKbps}k`,
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
  );

  if (customOptions?.fps) {
    args.push('-r', String(customOptions.fps));
  }

  if (preset.maxHeight !== null) {
    // -2 keeps width even (required by yuv420p) while preserving aspect ratio
    args.push('-vf', `scale=-2:'min(${preset.maxHeight},ih)'`);
  }
  return args;
}
