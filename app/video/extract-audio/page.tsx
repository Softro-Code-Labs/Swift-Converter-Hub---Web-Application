import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { AudioLines, Shield, Zap, FileAudio } from 'lucide-react';
import ExtractAudioTool from '@/features/video/extract-audio/components';
import { AUDIO_FORMATS } from '@/features/audio/shared/config/formats';
import {
  StepList,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Extract Audio from Video',
  description:
    'Pull the audio track out of MP4, WEBM, MOV, AVI, MKV and other video files and save it as MP3, WAV, OGG, FLAC, AAC, M4A, OPUS and more. Batch process, no uploads, 100% browser-based.',
  keywords: [
    'extract audio from video online',
    'video to mp3 converter free',
    'get audio from mp4 online',
    'save video audio track browser',
    'mp4 to mp3 no upload',
    'rip audio from video free',
    'video sound extractor online',
    'convert video to audio private',
  ],
  alternates: { canonical: `${SITE_URL}/video/extract-audio` },
  openGraph: {
    title: 'Extract Audio from Video | Video Studio',
    description:
      'Pull the audio track out of any video file and save it as MP3, WAV, and more - fully processed in your browser.',
    url: `${SITE_URL}/video/extract-audio`,
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: FileAudio,
    label: `${AUDIO_FORMATS.length} audio formats`,
    desc: AUDIO_FORMATS.map((f) => f.label).join(', '),
  },
  { icon: AudioLines, label: 'Adjustable bitrate', desc: 'Control quality vs. file size' },
  { icon: Zap, label: 'Batch processing', desc: 'Extract from up to 5 videos at once' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const EXTRACT_FAQS = [
  {
    q: 'What if my video has no audio track?',
    a: "The extraction will fail with an error for that file - there's simply no audio to pull out. Every other queued file is unaffected.",
  },
  {
    q: 'Which output format should I choose?',
    a: 'MP3 is the safest default for wide compatibility. Choose WAV or FLAC if you plan to edit the audio further and want to avoid extra quality loss, or OPUS/AAC for the best quality-per-file-size if the audio is just for listening.',
  },
  {
    q: 'Does extraction re-encode the audio?',
    a: "Yes - the audio track is decoded from the video container and re-encoded into your chosen format, since video containers (MP4, MKV, etc.) don't store audio in a way that can just be copied out directly into most standalone audio formats.",
  },
  {
    q: 'Is there a video length or size limit?',
    a: "No hard limit is imposed by this tool, since files never leave your device - very large files are bounded only by your browser's available memory.",
  },
];

export default function ExtractAudioPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Extract Audio', path: '/video/extract-audio' },
          ]),
          softwareApplicationJsonLd({
            name: 'Extract Audio from Video',
            description:
              'Pull the audio track out of a video file and save it as MP3, WAV, or another audio format, entirely in your browser.',
            path: '/video/extract-audio',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(EXTRACT_FAQS),
        ]}
      />
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/video" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Video Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Extract Audio</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black">
              EXTRACT AUDIO
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Extract Audio from Video
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Pull the audio track out of any video file and save it as
              MP3, WAV, or another format - batch process up to 5 videos,
              fully in your browser.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Icon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <ExtractAudioTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-purple-500"
        steps={[
          { step: '01', title: 'Upload video files', desc: 'Drop up to 5 files at once.' },
          { step: '02', title: 'Pick an audio format', desc: 'MP3, WAV, OGG, FLAC, AAC, M4A, or OPUS.' },
          { step: '03', title: 'Download the audio', desc: 'Individually, or as a ZIP bundle.' },
        ]}
      />

      <TechnicalNote
        title="How this works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool reuses the same FFmpeg engine and audio encoders as Audio Studio's Format Converter - the video's audio stream is decoded and re-encoded into your chosen format, while the video stream is simply discarded, all inside your browser tab.",
        ]}
      />

      <FaqAccordion title="Frequently asked questions" accentColor="bg-purple-500" items={EXTRACT_FAQS} />
    </div>
  );
}
