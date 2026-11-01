import { Metadata } from 'next';
import { AudioLines, Shield, Zap, FileAudio } from 'lucide-react';
import ExtractAudioTool from '@/features/video/extract-audio/components';
import { AUDIO_FORMATS } from '@/features/audio/shared/config/formats';
import {
  StepList,
  TechnicalNote,
  FaqAccordion,
  ToolPageHeader,
} from '@/features/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/video/extract-audio',
  title: 'Extract Audio from Video - MP4 to MP3 Online',
  description:
    'Save the soundtrack of any video as MP3, WAV, M4A or another format. Works with MP4, MOV, WebM and MKV. Free and private - nothing is uploaded.',
  keywords: [
    'extract audio from video online',
    'video to mp3 converter free',
    'get audio from mp4 online',
    'save video audio track browser',
    'mp4 to mp3 no upload',
    'rip audio from video free',
    'video sound extractor online',
    'convert video to audio private',
    'mp4 to wav converter free',
    'strip audio from video online',
    'video audio track saver',
    'podcast audio extractor free',
  ],
});

const FEATURES = [
  {
    icon: FileAudio,
    label: `${AUDIO_FORMATS.length} audio formats`,
    desc: AUDIO_FORMATS.map((f) => f.label).join(', '),
  },
  {
    icon: AudioLines,
    label: 'Adjustable bitrate',
    desc: 'Control quality vs. file size',
  },
  {
    icon: Zap,
    label: 'Batch processing',
    desc: 'Extract from up to 5 videos at once',
  },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
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
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Video Studio', path: '/video' },
          { name: 'Extract Audio', path: '/video/extract-audio' },
        ]}
        title={'Extract Audio from Video'}
        description={
          'Pull the audio track out of any video file and save it as MP3, WAV, or another format - batch process up to 5 videos, fully in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <ExtractAudioTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-purple-500"
        steps={[
          {
            step: '01',
            title: 'Upload video files',
            desc: 'Drop up to 5 files at once.',
          },
          {
            step: '02',
            title: 'Pick an audio format',
            desc: 'MP3, WAV, OGG, FLAC, AAC, M4A, or OPUS.',
          },
          {
            step: '03',
            title: 'Download the audio',
            desc: 'Individually, or as a ZIP bundle.',
          },
        ]}
      />

      <TechnicalNote
        title="How this works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool reuses the same FFmpeg engine and audio encoders as Audio Studio's Format Converter - the video's audio stream is decoded and re-encoded into your chosen format, while the video stream is simply discarded, all inside your browser tab.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={EXTRACT_FAQS}
      />
    </div>
  );
}
