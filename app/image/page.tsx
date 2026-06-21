import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools',
  description:
    'Convert, crop, compress, adjust and inspect images entirely in your browser. 120+ formats supported, zero uploads, no account required. A complete image toolkit.',
  keywords: [
    'free image converter online',
    'browser based image tools',
    'image format converter',
    'crop compress adjust images online',
    'convert image formats free',
    'no upload image editor',
    'private image conversion tool',
    'all in one image toolkit',
    'webassembly image converter',
    'batch image converter free',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image' },
  openGraph: {
    title: 'Image Studio - Free Browser-Based Image Tools',
    description:
      'Convert, crop, compress, and adjust images entirely in your browser. 120+ formats, zero uploads.',
    url: 'https://swiftconverterhub.com/image',
    type: 'website',
  },
};

export default function ImageStudioPage() {
  return <ImageStudioClient />;
}
