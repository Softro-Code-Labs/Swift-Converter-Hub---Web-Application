import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import VideoFormatsClient from './VideoFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Video Format Converter',
  description:
    'Convert between MP4, WEBM, MOV, AVI, MKV, M4V, 3GP, FLV, TS, WMV, OGV and MPG instantly in your browser. Batch convert and download - no uploads, no account, powered by WebAssembly.',
  keywords: [
    'video format converter online',
    'convert video formats free',
    'browser video converter',
    'mp4 mov webm converter',
    'video file format changer',
    'webassembly video converter',
    'private video converter no upload',
    'batch video converter online',
  ],
  alternates: { canonical: `${SITE_URL}/video/convert` },
  openGraph: {
    title: 'Video Format Converter | Video Studio',
    description:
      'Convert between 12 video formats - MP4, WEBM, MOV, AVI, MKV, M4V, 3GP, FLV, TS, WMV, OGV, MPG - instant, private, no server.',
    url: `${SITE_URL}/video/convert`,
    type: 'website',
  },
};

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
