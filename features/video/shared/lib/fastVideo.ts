'use client';

/* ---------------------------------------------------------------------------
   Hardware-accelerated video path.

   FFmpeg compiled to WebAssembly runs on the CPU only - a browser gives
   WebAssembly no access to the GPU. Browsers do, however, expose the device's
   hardware video encoder and decoder through the WebCodecs API (the same
   engine used for video calls). This module uses it, via mediabunny, for the
   common cases: MP4, MOV, MKV and WebM output.

   - Encoding happens on the GPU / media engine when the device has one,
     otherwise in the browser's native (still much faster than WASM) encoder.
   - When the source codecs already fit the target container, streams are
     copied without re-encoding at all (e.g. H.264 MP4 -> MOV is near-instant).
   - Anything this path can't handle (no WebCodecs, an unsupported codec, a
     track that would be dropped) returns null, and callers fall back to the
     FFmpeg engine. People never see a failure caused by this path.
--------------------------------------------------------------------------- */

export type FastTarget = 'mp4' | 'm4v' | 'mov' | 'mkv' | 'webm';

export const FAST_TARGETS = new Set<string>([
  'mp4',
  'm4v',
  'mov',
  'mkv',
  'webm',
]);

const MIME: Record<FastTarget, string> = {
  mp4: 'video/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  mkv: 'video/x-matroska',
  webm: 'video/webm',
};

export interface FastVideoOptions {
  target: FastTarget;
  /** Cut to this range, in seconds. */
  trim?: { start: number; end: number };
  /** Scale down (never up) so the height is at most this. */
  maxHeight?: number | null;
  /** Target video bitrate in bits per second. */
  videoBitrate?: number;
  /** Target audio bitrate in bits per second. */
  audioBitrate?: number;
  frameRate?: number | null;
  /** Re-encode video even if it could be copied (needed for exact trims and
   *  for compression). */
  forceTranscode?: boolean;
  onProgress?: (ratio: number) => void;
}

export function isWebCodecsAvailable(): boolean {
  // Audio encoding support is checked per file below: Safari can encode
  // video but (before Safari 26) not audio, and many files only need their
  // audio copied anyway.
  return (
    typeof window !== 'undefined' &&
    'VideoEncoder' in window &&
    'VideoDecoder' in window
  );
}

/**
 * Convert with the hardware path. Resolves to the output Blob, or null if
 * this file/browser combination isn't supported (caller then uses FFmpeg).
 */
export async function tryFastVideo(
  file: File,
  opts: FastVideoOptions,
): Promise<Blob | null> {
  if (!isWebCodecsAvailable() || !FAST_TARGETS.has(opts.target)) return null;

  try {
    const mb = await import('mediabunny');

    const input = new mb.Input({
      source: new mb.BlobSource(file),
      formats: mb.ALL_FORMATS,
    });
    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) return null;
    const audioTrack = await input.getPrimaryAudioTrack();

    const format =
      opts.target === 'webm'
        ? new mb.WebMOutputFormat()
        : opts.target === 'mkv'
          ? new mb.MkvOutputFormat()
          : opts.target === 'mov'
            ? new mb.MovOutputFormat({ fastStart: 'in-memory' })
            : new mb.Mp4OutputFormat({ fastStart: 'in-memory' });
    const output = new mb.Output({ format, target: new mb.BufferTarget() });

    // Output size: only ever scale down, keep the aspect ratio, even numbers
    // (required by most hardware encoders).
    let width: number | undefined;
    let height: number | undefined;
    const srcW = videoTrack.displayWidth;
    const srcH = videoTrack.displayHeight;
    if (opts.maxHeight && srcH > opts.maxHeight) {
      height = opts.maxHeight - (opts.maxHeight % 2);
      width = Math.max(2, Math.round((srcW * height) / srcH / 2) * 2);
    }

    // What the container technically accepts, narrowed to what people can
    // actually play: MP4/MOV can hold VP8 or Vorbis, but QuickTime, iPhones
    // and most editors won't open such a file.
    const keep = <T extends string>(all: T[], allowed?: readonly string[]) =>
      allowed ? all.filter((c) => allowed.includes(c)) : all;
    const appleLike = opts.target !== 'webm' && opts.target !== 'mkv';
    const videoSupported = keep(
      format.getSupportedVideoCodecs(),
      appleLike ? ['avc', 'hevc'] : undefined,
    );
    const audioSupported = keep(
      format.getSupportedAudioCodecs(),
      appleLike ? ['aac', 'mp3'] : undefined,
    );
    const mustEncodeVideo =
      !!opts.forceTranscode ||
      !!width ||
      !!opts.videoBitrate ||
      !!opts.frameRate ||
      !videoTrack.codec ||
      !videoSupported.includes(videoTrack.codec);

    // Bitrate when none was asked for: about the source's own video
    // bitrate. A format conversion shouldn't make the file much bigger (or
    // visibly worse) - and every codec offered here is at least as
    // efficient as what it replaces. Sampled from the first ~10 s of
    // packets so huge files aren't scanned end to end.
    let videoBitrate = opts.videoBitrate;
    if (mustEncodeVideo && !videoBitrate) {
      const stats = await videoTrack.computePacketStats(300);
      if (stats.averageBitrate > 0) {
        const outW = width ?? srcW;
        const outH = height ?? srcH;
        const scale = (outW * outH) / (srcW * srcH);
        const fps = opts.frameRate || stats.averagePacketRate || 30;
        // Ceiling: generous high-quality H.264 (~0.15 bits per pixel, e.g.
        // ~9 Mbps for 1080p30), so an intermediate-codec source such as
        // ProRes at 150 Mbps doesn't produce an enormous MP4.
        const ceiling = Math.round(outW * outH * fps * 0.15);
        videoBitrate = Math.min(
          ceiling,
          Math.max(400_000, Math.round(stats.averageBitrate * scale)),
        );
      }
    }

    // Video: copy the stream untouched when the container accepts it and
    // nothing needs changing (a remux, near-instant). Otherwise pick the
    // most compatible codec this device can actually encode at this size.
    let videoCodec: (typeof videoSupported)[number] | undefined;
    if (mustEncodeVideo) {
      const preference: Parameters<typeof mb.getFirstEncodableVideoCodec>[0] =
        opts.target === 'webm'
          ? ['vp9', 'vp8', 'av1']
          : opts.target === 'mkv'
            ? ['avc', 'hevc', 'vp9', 'av1']
            : // MP4/MOV: H.264/HEVC only - VP9/AV1 in MP4 won't open in
              // QuickTime, older iPhones or many editors.
              ['avc', 'hevc'];
      const encodable = await mb.getFirstEncodableVideoCodec(
        preference.filter((c) => videoSupported.includes(c)),
        {
          width: width ?? srcW,
          height: height ?? srcH,
          bitrate: videoBitrate ?? mb.QUALITY_HIGH,
        },
      );
      if (!encodable) return null;
      videoCodec = encodable;
    }

    // Audio: copy when the container accepts it and no bitrate change was
    // asked for; otherwise encode, if this browser can.
    let audioOptions:
      | {
          codec?: (typeof audioSupported)[number];
          bitrate?: number | import('mediabunny').Quality;
        }
      | undefined;
    if (audioTrack) {
      const containerTakesSource =
        !!audioTrack.codec && audioSupported.includes(audioTrack.codec);
      if (!containerTakesSource || opts.audioBitrate) {
        const preference: Parameters<typeof mb.getFirstEncodableAudioCodec>[0] =
          opts.target === 'webm'
            ? ['opus', 'vorbis']
            : opts.target === 'mkv'
              ? ['aac', 'opus']
              : ['aac']; // MP4/MOV: AAC is the only universally playable choice
        const encodable =
          'AudioEncoder' in window
            ? await mb.getFirstEncodableAudioCodec(
                preference.filter((c) => audioSupported.includes(c)),
                { bitrate: opts.audioBitrate ?? mb.QUALITY_HIGH },
              )
            : null;
        if (encodable) {
          audioOptions = {
            codec: encodable,
            bitrate: opts.audioBitrate ?? mb.QUALITY_HIGH,
          };
        } else if (!containerTakesSource) {
          // Losing the soundtrack is never acceptable - let FFmpeg do it.
          return null;
        }
        // else: no suitable encoder, but the source audio fits - copy it.
      }
    }

    const conversion = await mb.Conversion.init({
      input,
      output,
      tracks: 'primary',
      showWarnings: false,
      trim: opts.trim,
      video: mustEncodeVideo
        ? {
            codec: videoCodec,
            width,
            height,
            fit: width && height ? 'contain' : undefined,
            bitrate: videoBitrate ?? mb.QUALITY_HIGH,
            frameRate: opts.frameRate ?? undefined,
            forceTranscode: true,
            // 'no-preference' lets the browser use the GPU/media engine
            // whenever it has one for this codec and size, and fall back to
            // its own native encoder otherwise. 'prefer-hardware' would
            // instead fail outright on devices without that hardware.
            hardwareAcceleration: 'no-preference',
          }
        : undefined,
      audio: audioOptions,
    });

    // Every track must make it through; otherwise fall back to FFmpeg.
    if (!conversion.isValid || conversion.discardedTracks.length > 0) {
      return null;
    }

    conversion.onProgress = (p) =>
      opts.onProgress?.(Math.min(1, Math.max(0, p)));
    await conversion.execute();

    const buffer = output.target.buffer;
    if (!buffer || buffer.byteLength === 0) return null;
    return new Blob([buffer], { type: MIME[opts.target] });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.info('[video] hardware path unavailable, using FFmpeg:', err);
    }
    return null;
  }
}
