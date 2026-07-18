import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import WordCounterTool from '@/features/character/word-counter/components';

export const metadata: Metadata = {
  title: 'Word & Character Counter',
  description:
    'Count words, characters, sentences, and paragraphs in real time. Get reading time, speaking time, and keyword density - all in your browser, nothing sent to any server.',
  keywords: [
    'word counter online',
    'character counter free',
    'word count tool',
    'character count online',
    'sentence counter',
    'paragraph counter',
    'reading time estimator',
    'speaking time calculator',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/word-counter`,
  },
  openGraph: {
    title: 'Word & Character Counter - Free Online Tool | Character Studio',
    description:
      'Real-time word, character, sentence, and reading time stats - 100% in your browser.',
    url: `${SITE_URL}/character/word-counter`,
    type: 'website',
  },
};

export default function WordCounterPage() {
  return <WordCounterTool />;
}
