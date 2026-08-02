import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileText, Zap, Shield, Shuffle } from 'lucide-react';
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
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import LoremIpsumTool from '@/features/character/lorem-ipsum/components';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator',
  description:
    'Generate classic Lorem Ipsum or random English placeholder text by words, sentences, or paragraphs - instantly in your browser. No server, 100% private.',
  keywords: [
    'lorem ipsum generator',
    'lorem ipsum online',
    'placeholder text generator',
    'dummy text generator',
    'filler text generator online',
    'random text generator free',
    'lorem ipsum paragraphs',
    'lorem ipsum sentences',
    'lorem ipsum by paragraph',
    'sample text generator for design',
    'placeholder copy generator',
    'ipsum text generator free',
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

const STEPS = [
  {
    step: '01',
    title: 'Choose a length unit',
    desc: 'Generate by words, sentences, or paragraphs.',
  },
  {
    step: '02',
    title: 'Pick classic or random',
    desc: 'Classic Cicero-derived Latin, or a diverse, design-friendly English word pool.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Grab the result as plain text, ready to drop into a mockup or CMS.',
  },
];

const FAQS = [
  {
    q: 'Is the classic text real Latin?',
    a: 'It\'s derived from a passage of Cicero\'s "De Finibus Bonorum et Malorum" (written around 45 BC), scrambled and abbreviated centuries ago by an unknown typesetter into the "Lorem ipsum dolor sit amet..." placeholder text that has been the design industry standard ever since. It isn\'t grammatically correct Latin, which is exactly why it works as filler - it looks like real text without saying anything meaningful that could distract from a layout.',
  },
  {
    q: 'Why would I use random English words instead of classic Lorem Ipsum?',
    a: "Random English filler avoids the reflex some readers have of skipping straight past text that visibly starts with 'Lorem ipsum' - useful when you want a mockup or a client presentation to feel more like read English copy, without using real content that isn't ready yet.",
  },
  {
    q: 'Does regenerating give me the same text every time?',
    a: 'No - each click produces a fresh shuffle. Classic mode draws from a fixed set of authentic Cicero-derived paragraphs and reorders them; random mode builds brand-new sentences from its word pool, so you can regenerate as many times as you like for variety.',
  },
  {
    q: 'Can I start with the traditional "Lorem ipsum dolor sit amet..." opening?',
    a: 'Yes - toggle "start with Lorem ipsum" to force the very first generated block to begin with the standard opening line, which is useful if you want the output to be instantly recognizable as placeholder text.',
  },
  {
    q: 'Is this generated on a server?',
    a: 'No. Both the classic paragraphs and the random word pool are bundled directly into the page, and generation happens entirely in your browser - nothing is fetched or logged.',
  },
];

export default function LoremIpsumPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Lorem Ipsum Generator', path: '/character/lorem-ipsum' },
          ]),
          softwareApplicationJsonLd({
            name: 'Lorem Ipsum Generator',
            description:
              'Generate classic Lorem Ipsum or random English placeholder text by words, sentences, or paragraphs - instantly in your browser. No server, 100% private.',
            path: '/character/lorem-ipsum',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to generate Lorem Ipsum placeholder text',
            description:
              'Generate classic or random placeholder text by word, sentence, or paragraph count.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Lorem Ipsum Generator', path: '/character/lorem-ipsum' },
        ]}
        badges={[{ label: 'PLACEHOLDER TEXT', color: 'amber' }]}
        title="Generate Lorem Ipsum Placeholder Text"
        description="Classic Cicero-derived Lorem Ipsum, or random English filler text - by word, sentence, or paragraph count, generated instantly in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant generation' },
          { icon: FileText, label: 'Words, sentences, or paragraphs' },
          { icon: Shuffle, label: 'Classic or random' },
        ]}
      />

      <div className="px-6 py-6">
        <LoremIpsumTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="Where the text comes from"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Classic mode draws from a fixed set of authentic paragraphs derived from Cicero's writing, shuffling their order and trimming them down to your requested word, sentence, or paragraph count. Random mode instead builds fresh sentences on the fly from a curated pool of common, design-friendly English words - each generation runs a Fisher-Yates shuffle and picks new combinations, so no two outputs are identical.",
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
