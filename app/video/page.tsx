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
    'Convert, trim, and compress video files entirely in your browser using a high-performance WebAssembly engine. MP4, WebM, and GIF export - no uploads, completely private.',
  keywords: [
    'video converter online free',
    'video converter online',
    'free browser video converter',
    'convert video files free',
    'mp4 webm converter browser',
    'convert mov to mp4 free',
    'trim video online no upload',
    'online video cutter free',
    'crop and trim video browser',
    'instant video splitter online',
    'compress video file size online',
    'no upload video compressor',
    'reduce mp4 size free browser',
    'shrink video dimensions online',
    'video to gif converter free',
    'convert mp4 to animated gif',
    'make transparent gif browser',
    'webassembly video editor free',
    'private video conversion tool',
    'offline video converter online',
  ],
  alternates: { canonical: `${SITE_URL}/video` },
  openGraph: {
    title: 'Video Studio - Free Online Video Tools',
    description:
      'Convert and edit video entirely in your browser with a professional WebAssembly engine.',
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
              'Convert, trim, and compress video files entirely in your browser - no uploads, completely private.',
            path: '/video',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <VideoStudioClient />
    </>
  );
}
