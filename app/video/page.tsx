import { Metadata } from 'next';
import VideoStudioClient from './VideoStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/video',
  title: 'Free Online Video Tools - Convert, Compress & Trim',
  description:
    'Convert, compress, trim and turn videos into GIFs free in your browser. MP4, WebM, MOV, MKV, AVI and more. No upload, no watermark, no sign-up.',
  keywords: [
    'video converter online free',
    'free browser video converter',
    'mp4 webm converter browser',
    'convert mov to mp4 free',
    'trim video online no upload',
    'compress video file size online',
    'video to gif converter free',
    'extract audio from video online',
    'video to mp3 converter free',
    'webassembly video converter',
    'private video conversion tool',
    'batch video converter online',
    'free video editor online',
    'no signup video tools',
  ],
});

export default function VideoStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
          ]),
          studioToolsJsonLd('video'),
          softwareApplicationJsonLd({
            name: 'Video Studio',
            description:
              'Convert, trim, compress, and extract audio from video files, or turn a clip into a GIF - entirely in your browser.',
            path: '/video',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <VideoStudioClient />
    </>
  );
}
