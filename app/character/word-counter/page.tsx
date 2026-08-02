import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Type, Zap, Shield, Clock } from 'lucide-react';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import {
  ToolPageHeader,
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
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
    'keyword density checker online',
    'reading time calculator free',
    'essay word counter online',
    'character limit counter tool',
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

const STEPS = [
  {
    step: '01',
    title: 'Paste or type your text',
    desc: 'An essay, article draft, tweet, or anything else.',
  },
  {
    step: '02',
    title: 'Watch the stats update live',
    desc: 'Words, characters, sentences, and paragraphs count as you type.',
  },
  {
    step: '03',
    title: 'Check timing and keywords',
    desc: 'See estimated reading and speaking time, plus your most frequent keywords.',
  },
];

const REFERENCE_CARDS = [
  {
    title: 'Reading time',
    meta: '238 words/minute',
    desc: 'Based on average adult silent-reading speed for general text.',
  },
  {
    title: 'Speaking time',
    meta: '130 words/minute',
    desc: 'Based on average conversational speaking pace - useful for scripting a talk or video.',
  },
];

const FAQS = [
  {
    q: 'How are reading time and speaking time calculated?',
    a: 'Reading time divides your word count by 238 words per minute, a commonly cited average adult silent-reading speed for general text. Speaking time divides by 130 words per minute, closer to a natural conversational pace - useful when timing a script for a video or presentation rather than estimating how long it takes to read.',
  },
  {
    q: 'How is a "word" counted?',
    a: 'Words are counted by splitting on whitespace, so “well-known” counts as one word (it contains no space) while “well known” counts as two. This matches how most word processors count words for consistency with tools like Microsoft Word or Google Docs.',
  },
  {
    q: 'Does the character count include spaces?',
    a: 'The tool shows both figures - character count including spaces and punctuation, and character count excluding spaces - since platforms with character limits (like social media posts or SMS) sometimes count differently depending on context.',
  },
  {
    q: 'How is keyword density calculated?',
    a: 'The tool tallies how often each significant word appears, filtering out very short and extremely common words (like "the", "and", "is") so the resulting list reflects meaningful, topic-relevant terms rather than being dominated by function words.',
  },
  {
    q: 'Is my text uploaded anywhere?',
    a: "No. All counting happens locally in your browser as you type - nothing is sent to a server, not even the text you're currently editing.",
  },
];

export default function WordCounterPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            {
              name: 'Word & Character Counter',
              path: '/character/word-counter',
            },
          ]),
          softwareApplicationJsonLd({
            name: 'Word & Character Counter',
            description:
              'Count words, characters, sentences, and paragraphs in real time. Get reading time, speaking time, and keyword density - all in your browser, nothing sent to any server.',
            path: '/character/word-counter',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to count words and characters online',
            description:
              'Count words, characters, sentences, and see reading time estimates.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Word & Character Counter', path: '/character/word-counter' },
        ]}
        badges={[{ label: 'COUNT', color: 'blue' }]}
        title="Count Words & Characters Online"
        description="Real-time word, character, sentence, and paragraph counts, plus estimated reading time, speaking time, and keyword density - all in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Real-time count' },
          { icon: Type, label: 'Words, chars, sentences' },
          { icon: Clock, label: 'Reading & speaking time' },
        ]}
      />

      <div className="px-6 py-6">
        <WordCounterTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="How timing is estimated"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={REFERENCE_CARDS}
      />

      <TechnicalNote
        title="How the stats are calculated"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Word, character, sentence, and paragraph counts update on every keystroke using straightforward text-parsing rules - words are split on whitespace, sentences on terminal punctuation (. ! ?), and paragraphs on blank lines. Reading and speaking time are then derived by dividing the word count by a fixed words-per-minute rate for each. Keyword density tallies word frequency after filtering out short, extremely common function words, so the result highlights the terms that actually characterize your text.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={FAQS}
      />
    </div>
  );
}
