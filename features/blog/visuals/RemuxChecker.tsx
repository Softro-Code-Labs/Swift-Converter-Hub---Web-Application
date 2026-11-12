'use client';

import { useState } from 'react';
import { CheckCircle2, Cpu, RefreshCw } from 'lucide-react';
import { ChoiceGroup } from './ChoiceGroup';

type VCodec = 'h264' | 'hevc' | 'vp9' | 'av1' | 'prores';
type ACodec = 'aac' | 'mp3' | 'opus' | 'pcm';
type Target = 'mp4' | 'mov' | 'webm' | 'mkv';

const V_LABEL: Record<VCodec, string> = { h264: 'H.264', hevc: 'HEVC (H.265)', vp9: 'VP9', av1: 'AV1', prores: 'ProRes' };
const A_LABEL: Record<ACodec, string> = { aac: 'AAC', mp3: 'MP3', opus: 'Opus', pcm: 'PCM (uncompressed)' };
const T_LABEL: Record<Target, string> = { mp4: 'MP4', mov: 'MOV', webm: 'WebM', mkv: 'MKV' };

/**
 * Which codecs can go straight into each container without re-encoding.
 * MP4/MOV are kept to what phones, QuickTime and editors open reliably -
 * the same rule our Video converter follows.
 */
const FITS: Record<Target, { video: VCodec[]; audio: ACodec[] }> = {
  mp4: { video: ['h264', 'hevc'], audio: ['aac', 'mp3'] },
  mov: { video: ['h264', 'hevc'], audio: ['aac', 'mp3'] },
  webm: { video: ['vp9', 'av1'], audio: ['opus'] },
  mkv: { video: ['h264', 'hevc', 'vp9', 'av1', 'prores'], audio: ['aac', 'mp3', 'opus', 'pcm'] },
};

const REENCODE_TO: Record<Target, { video: string; audio: string }> = {
  mp4: { video: 'H.264', audio: 'AAC' },
  mov: { video: 'H.264', audio: 'AAC' },
  webm: { video: 'VP9', audio: 'Opus' },
  mkv: { video: 'H.264', audio: 'AAC' },
};

export function RemuxChecker() {
  const [video, setVideo] = useState<VCodec>('h264');
  const [audio, setAudio] = useState<ACodec>('aac');
  const [target, setTarget] = useState<Target>('mp4');

  const vFits = FITS[target].video.includes(video);
  const aFits = FITS[target].audio.includes(audio);
  const T = T_LABEL[target];

  let tone: string;
  let Icon = CheckCircle2;
  let title: string;
  let body: string;
  if (vFits && aFits) {
    tone = 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200';
    title = 'Instant, lossless remux';
    body = `Both tracks are allowed in ${T}, so they are copied into the new container untouched. It takes seconds and the quality is identical.`;
  } else if (vFits) {
    tone = 'bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-200';
    Icon = RefreshCw;
    title = 'Video copied, audio re-encoded';
    body = `The ${V_LABEL[video]} video is copied as-is. Only the audio is converted to ${REENCODE_TO[target].audio}, which is quick because audio is small.`;
  } else {
    tone = 'bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200';
    Icon = Cpu;
    title = 'Full re-encode needed';
    body = `${T} can't hold ${V_LABEL[video]} video${aFits ? '' : ` or ${A_LABEL[audio]} audio`}, so it is rebuilt as ${REENCODE_TO[target].video}${aFits ? '' : ` + ${REENCODE_TO[target].audio}`}. We use your graphics chip when the browser allows it, and FFmpeg otherwise.`;
  }

  return (
    <div className="space-y-5">
      <ChoiceGroup
        label="Video codec in your file"
        value={video}
        onChange={setVideo}
        options={(Object.keys(V_LABEL) as VCodec[]).map((v) => ({ value: v, label: V_LABEL[v] }))}
      />
      <ChoiceGroup
        label="Audio codec in your file"
        value={audio}
        onChange={setAudio}
        options={(Object.keys(A_LABEL) as ACodec[]).map((a) => ({ value: a, label: A_LABEL[a] }))}
      />
      <ChoiceGroup
        label="Convert to"
        value={target}
        onChange={setTarget}
        options={(Object.keys(FITS) as Target[]).map((t) => ({ value: t, label: T_LABEL[t] }))}
      />
      <div className={`flex gap-3 rounded-xl p-4 ${tone}`} aria-live="polite">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-[15px] leading-relaxed opacity-90">{body}</p>
        </div>
      </div>
    </div>
  );
}
