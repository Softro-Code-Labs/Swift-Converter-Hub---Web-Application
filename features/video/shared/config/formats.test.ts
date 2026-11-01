import { describe, it, expect } from 'vitest';
import {
  getFormatByExtension,
  isConversionAllowed,
  canRemux,
  getRemuxArgs,
  getCompressBitrates,
  getFFmpegArgsForTarget,
  QUALITY_PRESETS,
} from './formats';

describe('getFormatByExtension', () => {
  it('finds a known video format case-insensitively', () => {
    expect(getFormatByExtension('MP4')?.extension).toBe('mp4');
  });

  it('returns undefined for an unknown extension', () => {
    expect(getFormatByExtension('not-a-format')).toBeUndefined();
  });
});

describe('isConversionAllowed', () => {
  it('allows converting between two distinct known formats', () => {
    expect(isConversionAllowed('mp4', 'webm')).toBe(true);
  });

  it('rejects converting a format to itself', () => {
    expect(isConversionAllowed('mp4', 'mp4')).toBe(false);
  });

  it('rejects same-format conversions regardless of casing', () => {
    expect(isConversionAllowed('MP4', 'mp4')).toBe(false);
  });

  it('rejects unknown formats', () => {
    expect(isConversionAllowed('mp4', 'not-a-format')).toBe(false);
    expect(isConversionAllowed('not-a-format', 'mp4')).toBe(false);
  });
});

describe('canRemux', () => {
  const h264aac = { video: 'h264', audio: 'aac', audioStreams: 1 };
  it('copies H.264/AAC into MP4, MOV and MKV', () => {
    for (const t of ['mp4', 'mov', 'mkv', 'm4v']) {
      expect(canRemux(t, h264aac)).toBe(true);
    }
  });
  it('refuses containers that cannot hold the codecs', () => {
    expect(canRemux('webm', h264aac)).toBe(false);
    expect(canRemux('avi', h264aac)).toBe(false);
    expect(
      canRemux('mp4', { video: 'vp8', audio: 'vorbis', audioStreams: 1 }),
    ).toBe(false);
  });
  it('copies VP9/Opus into WebM, and silent video too', () => {
    expect(
      canRemux('webm', { video: 'vp9', audio: 'opus', audioStreams: 1 }),
    ).toBe(true);
    expect(
      canRemux('webm', { video: 'vp9', audio: null, audioStreams: 0 }),
    ).toBe(true);
  });
  it('never drops a second soundtrack', () => {
    expect(canRemux('mp4', { ...h264aac, audioStreams: 2 })).toBe(false);
  });
});

describe('getRemuxArgs', () => {
  it('stream-copies with faststart for MP4 and tags HEVC for Apple players', () => {
    const args = getRemuxArgs('mp4', 'hevc');
    expect(args).toContain('copy');
    expect(args.join(' ')).toContain('-tag:v hvc1');
    expect(args.join(' ')).toContain('+faststart');
  });
});

describe('getFFmpegArgsForTarget (webm)', () => {
  it('uses the fast libvpx speed settings', () => {
    const args = getFFmpegArgsForTarget('webm').join(' ');
    expect(args).toContain('-deadline good');
    expect(args).toContain('-cpu-used 5');
  });
});

describe('getCompressBitrates', () => {
  const balanced = QUALITY_PRESETS.find((p) => p.id === 'balanced')!;
  it('uses the same ceiling as the FFmpeg path', () => {
    // 5000 kbps source * 0.6 = 3000 total, minus 96 audio
    expect(getCompressBitrates(balanced, 5000)).toEqual({
      videoKbps: 2904,
      audioKbps: 96,
    });
  });
  it('honours the floor on an already-small source', () => {
    expect(getCompressBitrates(balanced, 500)?.videoKbps).toBe(800);
  });
  it('uses the explicit target in bitrate mode', () => {
    expect(
      getCompressBitrates(balanced, undefined, {
        mode: 'bitrate',
        targetBitrateKbps: 1200,
      })?.videoKbps,
    ).toBe(1200);
  });
  it('returns null when the source bitrate is unknown', () => {
    expect(getCompressBitrates(balanced)).toBeNull();
  });
});
