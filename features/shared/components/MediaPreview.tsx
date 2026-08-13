'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useTheme } from 'next-themes';
import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from '@vidstack/react';
import {
  DefaultAudioLayout,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import { useFFmpegEngine } from '@/features/shared/hooks/useFFmpegEngine';
import {
  runFFmpegWithProgress,
  cleanupFFmpegFiles,
} from '@/features/shared/lib/ffmpegUtils';
import {
  getFileExtension,
  toStandaloneBuffer,
} from '@/features/shared/lib/format';
import { cn } from '@/lib/utils';

// SSR-safe subscribe used only to gate the very first client render - see
// the `mounted` guard below for why this needs to match `resolvedTheme`.
const emptySubscribe = () => () => {};

export interface MediaPreviewHandle {
  seek: (time: number) => void;
  getCurrentTime: () => number;
}

interface MediaPreviewProps {
  kind: 'video' | 'audio';
  /** Provide either a raw File (source, not yet uploaded anywhere) ... */
  file?: File | null;
  /** ...or an existing URL (e.g. an already-converted output blob URL). */
  src?: string | null;
  /** Extension hint for the `src` case, where there's no File.name to read
   * from - helps FFmpeg's demuxer if a transcode fallback is needed. */
  srcExt?: string;
  className?: string;
}

type PlayState = 'idle' | 'probing' | 'transcoding' | 'ready' | 'error';

function probeNativePlayback(
  url: string,
  kind: 'video' | 'audio',
): Promise<boolean> {
  return new Promise((resolve) => {
    const el = document.createElement(kind);
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      el.removeAttribute('src');
      el.load();
      resolve(ok);
    };

    const timer = setTimeout(() => finish(false), 5000);
    el.preload = 'metadata';
    el.onloadedmetadata = () => finish(true);
    el.onerror = () => finish(false);
    el.src = url;
  });
}

async function transcodePreview(
  ffmpeg: FFmpeg,
  blob: Blob,
  kind: 'video' | 'audio',
  sourceExt: string,
): Promise<Blob> {
  const uid = Math.random().toString(36).slice(2);
  const inputPath = `preview_in_${uid}.${sourceExt || 'bin'}`;
  const outputPath =
    kind === 'video' ? `preview_out_${uid}.mp4` : `preview_out_${uid}.mp3`;

  await ffmpeg.writeFile(inputPath, await fetchFile(blob));

  const args =
    kind === 'video'
      ? [
          '-i',
          inputPath,
          '-c:v',
          'libx264',
          '-preset',
          'veryfast',
          '-crf',
          '30',
          '-vf',
          "scale='min(854,iw)':-2",
          '-c:a',
          'aac',
          '-b:a',
          '96k',
          '-movflags',
          '+faststart',
          outputPath,
        ]
      : ['-i', inputPath, '-c:a', 'libmp3lame', '-b:a', '128k', outputPath];

  const exitCode = await runFFmpegWithProgress(ffmpeg, args);
  if (exitCode !== 0) {
    await cleanupFFmpegFiles(ffmpeg, [inputPath]);
    throw new Error('Preview transcode failed');
  }

  const data = await ffmpeg.readFile(outputPath);
  const bytes =
    typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const resultBlob = new Blob([toStandaloneBuffer(bytes)], {
    type: kind === 'video' ? 'video/mp4' : 'audio/mp3',
  });

  await cleanupFFmpegFiles(ffmpeg, [inputPath, outputPath]);
  return resultBlob;
}

export const MediaPreview = forwardRef<MediaPreviewHandle, MediaPreviewProps>(
  function MediaPreview({ kind, file, src, srcExt, className }, ref) {
    const { ffmpeg, isFFmpegLoaded } = useFFmpegEngine();
    const playerRef = useRef<MediaPlayerInstance>(null);
    const [state, setState] = useState<PlayState>('idle');
    const [playableUrl, setPlayableUrl] = useState<string | null>(null);
    const ownedUrlsRef = useRef<string[]>([]);

    // `resolvedTheme` is undefined during SSR/first paint, so the player's
    // color scheme is pinned to 'default' until we know the real theme -
    // matches the pattern already used by ThemeToggle to dodge a hydration
    // mismatch.
    const { resolvedTheme } = useTheme();
    const themeMounted = useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false,
    );
    const colorScheme = !themeMounted
      ? 'default'
      : resolvedTheme === 'dark'
        ? 'dark'
        : 'light';

    useImperativeHandle(ref, () => ({
      seek: (time: number) => {
        if (playerRef.current) playerRef.current.currentTime = time;
      },
      getCurrentTime: () => playerRef.current?.currentTime ?? 0,
    }));

    useEffect(() => {
      const originalUrl = file ? URL.createObjectURL(file) : src;
      if (file) ownedUrlsRef.current.push(originalUrl!);

      let cancelled = false;
      setState('idle');
      setPlayableUrl(null);

      if (!originalUrl) return;

      (async () => {
        setState('probing');
        const nativelyPlayable = await probeNativePlayback(originalUrl, kind);
        if (cancelled) return;

        if (nativelyPlayable) {
          setPlayableUrl(originalUrl);
          setState('ready');
          return;
        }

        // Native playback failed - fall back to an FFmpeg-generated preview.
        // Wait for the shared engine if it hasn't finished loading yet.
        setState('transcoding');
        while (!isFFmpegLoaded && !cancelled) {
          await new Promise((r) => setTimeout(r, 200));
        }
        if (cancelled || !ffmpeg) return;

        try {
          const sourceBlob = file ?? (await (await fetch(originalUrl)).blob());
          const ext = file ? getFileExtension(file.name) : (srcExt ?? '');
          const previewBlob = await transcodePreview(
            ffmpeg,
            sourceBlob,
            kind,
            ext,
          );
          if (cancelled) return;
          const url = URL.createObjectURL(previewBlob);
          ownedUrlsRef.current.push(url);
          setPlayableUrl(url);
          setState('ready');
        } catch {
          if (!cancelled) setState('error');
        }
      })();

      return () => {
        cancelled = true;
        ownedUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
        ownedUrlsRef.current = [];
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, src, kind, isFFmpegLoaded]);

    if (state === 'idle') return null;

    if (state === 'probing' || state === 'transcoding') {
      return (
        <div
          className={`flex items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-medium ${kind === 'video' ? 'h-48' : 'h-14'} ${className ?? ''}`}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {state === 'transcoding'
            ? "Preparing preview - this format isn't natively supported by your browser…"
            : 'Loading preview…'}
        </div>
      );
    }

    if (state === 'error') {
      return (
        <div
          className={`flex items-center justify-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 text-xs font-medium ${kind === 'video' ? 'h-48' : 'h-14'} ${className ?? ''}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          Preview isn&apos;t available for this file - the download will still
          work.
        </div>
      );
    }

    if (!playableUrl) return null;

    return (
      <MediaPlayer
        ref={playerRef}
        title={file?.name}
        src={{
          src: playableUrl,
          type: kind === 'video' ? 'video/mp4' : 'audio/mpeg',
        }}
        viewType={kind}
        playsInline
        className={cn(
          kind === 'video'
            ? 'w-full rounded-lg bg-black overflow-hidden'
            : 'w-full overflow-visible rounded-lg',
          className,
        )}
      >
        <MediaProvider />
        {kind === 'video' ? (
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            colorScheme={colorScheme}
          />
        ) : (
          <DefaultAudioLayout
            icons={defaultLayoutIcons}
            colorScheme={colorScheme}
          />
        )}
      </MediaPlayer>
    );
  },
);
