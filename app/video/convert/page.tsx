import { Metadata } from 'next';
import VideoFormatsClient from './VideoFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/video/convert',
  title: 'Video Converter - MP4, WebM, MOV, MKV & AVI',
  description:
    'Convert videos between MP4, WebM, MOV, MKV, AVI and more, in batches. Free and private - videos are converted in your browser and never uploaded.',
  keywords: [
    'video format converter online',
    'convert video formats free',
    'browser video converter',
    'mp4 mov webm converter',
    'video file format changer',
    'webassembly video converter',
    'private video converter no upload',
    'batch video converter online',
    'mov to mp4 converter free',
    'mkv to mp4 converter online',
    'video codec converter free',
    'convert video no signup',
  ],
});

export default function VideoFormatsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Format Converter', path: '/video/convert' },
          ]),
          softwareApplicationJsonLd({
            name: 'Video Format Converter',
            description:
              'Convert between 12 video formats, including MP4, WEBM, MOV, AVI, MKV, and WMV, entirely in your browser.',
            path: '/video/convert',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <VideoFormatsClient />
    </>
  );
}
