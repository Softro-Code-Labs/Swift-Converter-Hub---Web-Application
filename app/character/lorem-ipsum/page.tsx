import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import LoremIpsumTool from '@/features/character/lorem-ipsum/components';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator',
  description:
    'Generate classic Lorem Ipsum or random English placeholder text by words, sentences, or paragraphs - instantly in your browser. No server, 100% private.',
  keywords: [
    // Core intent
    'lorem ipsum generator',
    'lorem ipsum online',
    'placeholder text generator',
    'dummy text generator',
    'filler text generator online',
    'random text generator free',
    'lorem ipsum paragraphs',
    'lorem ipsum sentences',
    'lorem ipsum words',
    'generate lorem ipsum online',

    // Classic vs random
    'classic lorem ipsum generator',
    'latin placeholder text',
    'cicero lorem ipsum tool',
    'random english placeholder',
    'english dummy text generator',
    'realistic placeholder text',
    'fake paragraph generator',
    'sample text generator browser',
    'mock content generator online',
    'blind text generator free',

    // Design & dev use cases
    'placeholder text for design',
    'wireframe placeholder text',
    'ui mockup text generator',
    'figma placeholder text tool',
    'sketch dummy content filler',
    'web design filler text',
    'html placeholder paragraph',
    'css layout filler text',
    'bootstrap dummy content',
    'react placeholder text hook',

    // Count / control features
    'generate n paragraphs lorem',
    'custom word count lorem ipsum',
    'lorem ipsum by sentence count',
    'lorem ipsum variable length',
    'lorem ipsum bulk generator',
    'copy lorem ipsum one click',
    'download lorem ipsum txt',
    'lorem ipsum instant no delay',
    'lorem ipsum regenerate shuffle',
    'lorem ipsum start classic',

    // Privacy & client-side
    'lorem ipsum no server',
    'offline lorem ipsum tool',
    'private placeholder generator',
    'client side text generator',
    'browser lorem ipsum tool',
    'secure dummy text generator',
    'no upload lorem ipsum',
    'instant lorem ipsum browser',
    'free lorem ipsum unlimited',
    'lorem ipsum tool no login',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/lorem-ipsum`,
  },
  openGraph: {
    title:
      'Lorem Ipsum Generator - Classic & Random Placeholder Text | Character Studio',
    description:
      'Paragraphs, sentences, or words - classic Latin or random English, instant copy and download, no server.',
    url: `${SITE_URL}/character/lorem-ipsum`,
    type: 'website',
  },
};

export default function LoremIpsumPage() {
  return <LoremIpsumTool />;
}
