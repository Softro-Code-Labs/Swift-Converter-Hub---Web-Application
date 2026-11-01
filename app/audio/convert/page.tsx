import { Metadata } from 'next';
import AudioFormatsClient from './AudioFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/audio/convert',
  title: 'Audio Converter - MP3, WAV, FLAC, M4A, AAC & OGG',
  description:
    'Convert audio between MP3, WAV, FLAC, M4A, AAC, OGG, OPUS and more. Choose the bitrate and batch convert up to 20 files. Free, private, no upload.',
  keywords: [
    'audio format converter online',
    'convert audio formats free',
    'browser audio converter',
    'batch audio converter online',
    'audio file format changer',
    'mp3 wav flac converter',
    'wma to mp3 converter',
    'webassembly audio converter',
    'private audio converter no upload',
    'aiff to wav converter',
    'convert audio no signup',
    'multi format audio converter',
    'ac3 to mp3 converter',
    'convert podcast audio format',
  ],
});

export default function AudioFormatsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Format Converter', path: '/audio/convert' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Format Converter',
            description:
              'Convert between 12 audio formats, including MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, and AIFF, entirely in your browser.',
            path: '/audio/convert',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <AudioFormatsClient />
    </>
  );
}
