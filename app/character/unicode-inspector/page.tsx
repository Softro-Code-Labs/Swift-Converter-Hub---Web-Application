import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { ScanEye, Zap, Shield, EyeOff } from 'lucide-react';
import UnicodeInspectorTool from '@/features/character/unicode-inspector/components';
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

export const metadata: Metadata = {
  title: 'Unicode Inspector',
  description:
    "Reveal every character's Unicode code point, name, category, and UTF-8 bytes. Detect invisible characters, zero-width spaces, smart quotes, and byte-order marks - instantly in your browser, 100% private.",
  keywords: [
    'unicode inspector online',
    'unicode character inspector',
    'inspect unicode characters',
    'view unicode code points',
    'unicode character viewer',
    'text character analyser',
    'character code point tool',
    'unicode decoder online',
    'unicode codepoint lookup',
    'utf-8 character inspector',
    'emoji unicode inspector',
    'special character analyzer online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/unicode-inspector`,
  },
  openGraph: {
    title:
      'Unicode Inspector - Reveal Hidden Characters & Code Points | Character Studio',
    description:
      "Every character's code point, name, category and UTF-8 bytes - invisible chars, smart quotes and BOM detected instantly, nothing sent to any server.",
    url: `${SITE_URL}/character/unicode-inspector`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste your text',
    desc: 'Especially useful for text copied from PDFs, emails, or word processors.',
  },
  {
    step: '02',
    title: 'Scan the character breakdown',
    desc: 'Every character is listed with its code point, name, category, and UTF-8 bytes.',
  },
  {
    step: '03',
    title: 'Spot hidden characters',
    desc: 'Invisible characters, zero-width spaces, and byte-order marks are flagged automatically.',
  },
];

const FAQS = [
  {
    q: 'Why would text have invisible characters at all?',
    a: "They usually arrive as side effects of copy-pasting from PDFs, Word, or web pages - zero-width spaces used for line-break hints, non-breaking spaces instead of regular ones, or a byte-order mark left over from how a file was saved. They're invisible in most editors but can silently break string comparisons, form validation, or search matching.",
  },
  {
    q: 'What counts as a "character" when text includes emoji?',
    a: "This tool iterates using JavaScript's code-point-aware string iteration rather than raw UTF-16 units, so a multi-part emoji (like a flag or a family emoji built from several combined code points) is grouped correctly instead of being split into meaningless fragments.",
  },
  {
    q: 'What are "smart quotes" and why do they matter?',
    a: 'Smart (curly) quotes - " " and \' \' - are typographically distinct from the straight quotes " and \' on your keyboard. Word processors often auto-convert one to the other, which can silently break code, JSON, or search queries that expect the straight version.',
  },
  {
    q: 'What is a byte-order mark (BOM) and why does it matter?',
    a: "A BOM is an invisible marker (U+FEFF) some programs write at the very start of a text file to indicate its encoding. It's harmless in a word processor, but if it ends up at the start of a JSON file or a CSV, it can cause a parser to reject an otherwise valid file, or add a stray first character to your data.",
  },
  {
    q: 'Is my text sent anywhere for inspection?',
    a: "No. Every character is analyzed locally using your browser's built-in Unicode support - nothing is uploaded or logged.",
  },
];

export default function UnicodeInspectorPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Unicode Inspector', path: '/character/unicode-inspector' },
          ]),
          softwareApplicationJsonLd({
            name: 'Unicode Inspector',
            description:
              "Reveal every character's Unicode code point, name, category, and UTF-8 bytes, entirely in your browser.",
            path: '/character/unicode-inspector',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to inspect Unicode characters in text',
            description:
              'Reveal code points, categories, and hidden characters in any text.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Unicode Inspector', path: '/character/unicode-inspector' },
        ]}
        badges={[{ label: 'UNICODE', color: 'cyan' }]}
        title="Inspect Unicode Characters & Code Points"
        description="Reveal every character's Unicode code point, name, category, and UTF-8 bytes - and catch invisible characters, smart quotes, and byte-order marks hiding in your text."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant analysis' },
          { icon: ScanEye, label: 'Code point + UTF-8 bytes' },
          { icon: EyeOff, label: 'Invisible char detection' },
        ]}
      />

      <div className="px-6 py-6">
        <UnicodeInspectorTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How characters are identified"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Text is split into individual characters using code-point-aware iteration, so multi-part emoji and other characters built from surrogate pairs are grouped correctly rather than split into raw 16-bit units. For each character, the tool reads its numeric code point, encodes it to see its raw UTF-8 byte sequence, and checks it against a reference table of known invisible and easily-confused characters - things like zero-width spaces, non-breaking spaces, soft hyphens, and byte-order marks - to flag anything that wouldn't be obvious just by looking at the text.",
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
