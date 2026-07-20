import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import VideoStudioClient from './VideoStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Video Studio - Free Online Video Tools',
  description:
    'Convert, trim, compress, and extract audio from video files, or turn a clip into a GIF - entirely in your browser. MP4, WEBM, MOV, AVI, MKV, WMV, 3GP and more - no uploads, no account required.',
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
    'video studio browser based',
    'edit video without software',
  ],
  alternates: { canonical: `${SITE_URL}/video` },
  openGraph: {
    title: 'Video Studio - Free Online Video Tools',
    description:
      'Convert, trim, compress, and extract audio from video - or make a GIF - entirely in your browser.',
    url: `${SITE_URL}/video`,
    type: 'website',
  },
};

export default function VideoStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
          ]),
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
