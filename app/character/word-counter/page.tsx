import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import WordCounterTool from '@/features/character/word-counter/components';

export const metadata: Metadata = {
  title: 'Word & Character Counter',
  description:
    'Count words, characters, sentences, and paragraphs in real time. Get reading time, speaking time, and keyword density - all in your browser, nothing sent to any server.',
  keywords: [
    // Original keywords
    'word counter online',
    'character counter free',
    'word count tool',
    'character count online',
    'sentence counter',
    'paragraph counter',
    'reading time estimator',
    'speaking time calculator',
    'keyword density checker',
    'text analyzer online',
    'live word counter',
    'words per minute calculator',
    'text statistics tool',
    'private word counter',
    'no upload word counter',
    'free text counter browser',

    // SEO optimization
    'seo character counter',
    'meta description counter',
    'seo title length checker',
    'serp snippet length tool',
    'google title tag counter',
    'content length optimization tool',
    'article word count checker',
    'frequency word analyzer',

    // Academic & writing
    'essay word counter',
    'novel word count tracker',
    'manuscript character counter',
    'assignment length checker',
    'thesis text counter',
    'words to pages converter',
    'bibliography word count',
    'abstract length checker',

    // Social media limits
    'twitter character counter',
    'linkedin post length checker',
    'instagram caption spacing counter',
    'reddit post character limit tool',
    'sms character counter online',
    'youtube description length checker',
    'pinterest description counter',

    // Developer utilities
    'string length checker online',
    'json string character counter',
    'code comment text counter',
    'regex character match counter',
    'whitespace counter online',

    // Privacy & client-side
    'offline word counter app',
    'client side word count',
    'secure text analysis tool',
    'local data word counter',
    'no server log text counter',
    'browser based string analyzer',
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
