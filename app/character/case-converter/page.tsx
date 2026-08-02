import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Type, Zap, Shield, RefreshCw } from 'lucide-react';
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
import CaseConverterTool from '@/features/character/case-converter/components';

export const metadata: Metadata = {
  title: 'Case Converter',
  description:
    'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more - instantly in your browser. No server, 100% private.',
  keywords: [
    'case converter online',
    'text case converter',
    'uppercase converter',
    'lowercase converter',
    'title case converter',
    'camelCase converter',
    'snake_case converter',
    'kebab-case converter',
    'pascalcase converter online',
    'sentence case converter',
    'alternating case converter',
    'text transform tool free',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/case-converter`,
  },
  openGraph: {
    title: 'Case Converter - 12 Case Formats Instantly | Character Studio',
    description:
      'UPPERCASE, camelCase, snake_case, Title Case and 8 more - instant, private, no server.',
    url: `${SITE_URL}/character/case-converter`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste your text',
    desc: 'Type or paste a sentence, paragraph, or a code identifier you want reformatted.',
  },
  {
    step: '02',
    title: 'Pick a case style',
    desc: 'Choose from 12 formats - every style updates live as you type.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Grab the result with one click, or save it as a .txt file.',
  },
];

const CASE_EXAMPLES = [
  { title: 'UPPERCASE', desc: 'HELLO WORLD' },
  { title: 'lowercase', desc: 'hello world' },
  { title: 'Title Case', desc: 'Hello World' },
  { title: 'Sentence case', desc: 'Hello world' },
  { title: 'camelCase', desc: 'helloWorld' },
  { title: 'PascalCase', desc: 'HelloWorld' },
  { title: 'snake_case', desc: 'hello_world' },
  { title: 'kebab-case', desc: 'hello-world' },
  { title: 'CONSTANT_CASE', desc: 'HELLO_WORLD' },
  { title: 'dot.case', desc: 'hello.world' },
  { title: 'aLtErNaTiNg', desc: 'hEllo WoRlD' },
  { title: 'InVeRsE', desc: 'hELLO wORLD' },
];

const FAQS = [
  {
    q: 'Will Title Case capitalize every word?',
    a: "No - it follows common style-guide convention and lowercases short 'minor' words like a, an, the, and, but, or, and of, unless one of them is the very first word. So 'the lord of the rings' becomes 'The Lord of the Rings', not 'The Lord Of The Rings'.",
  },
  {
    q: 'Can I convert a camelCase variable name to snake_case?',
    a: "Yes. The converter detects word boundaries in camelCase and PascalCase (it inserts a break wherever a lowercase letter is immediately followed by an uppercase one) as well as spaces, hyphens, underscores and dots - so myVariableName, my-variable-name and my_variable_name all convert the same way, in either direction.",
  },
  {
    q: 'What is the difference between CONSTANT_CASE and snake_case?',
    a: 'Both use an underscore between words. snake_case keeps every word lowercase (common for variable and file names); CONSTANT_CASE - also called SCREAMING_SNAKE_CASE - uppercases every word, which is the usual convention for constants and environment variables.',
  },
  {
    q: 'Does this handle accented or non-English letters?',
    a: "UPPERCASE, lowercase, and Title Case use JavaScript's built-in case mapping, which correctly handles accented Latin letters (é, ñ, ü and similar). Word-boundary detection for camelCase/snake_case/kebab-case is based on Latin letter casing, so it works best with Latin-script text.",
  },
  {
    q: 'Is my text uploaded anywhere?',
    a: 'No. Every conversion runs locally in your browser as you type - nothing is sent to a server, logged, or stored.',
  },
];

export default function CaseConverterPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Case Converter', path: '/character/case-converter' },
          ]),
          softwareApplicationJsonLd({
            name: 'Case Converter',
            description:
              'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more - instantly in your browser. No server, 100% private.',
            path: '/character/case-converter',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to convert text case online',
            description: 'Convert text between 12 case styles instantly.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Case Converter', path: '/character/case-converter' },
        ]}
        badges={[{ label: 'CASE', color: 'blue' }]}
        title="Convert Text Case Online"
        description="Switch between 12 case styles - UPPERCASE, lowercase, Title Case, camelCase, snake_case and more - live as you type, entirely in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant, live' },
          { icon: Type, label: '12 case styles' },
          { icon: RefreshCw, label: 'Convert either way' },
        ]}
      />

      <div className="px-6 py-6">
        <CaseConverterTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title='All 12 styles for "Hello World"'
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-4"
        cards={CASE_EXAMPLES}
      />

      <TechnicalNote
        title="How case conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Case conversion first splits your text into words. It looks for spaces, hyphens, underscores and periods, and also inserts a break wherever a lowercase letter is immediately followed by an uppercase one - so myVariableName splits into the same words as 'my variable name'. Those words are then rejoined using the punctuation and capitalization rules for whichever style you pick.",
          'Alternating and Inverse case work differently: they walk through the raw text character by character rather than splitting into words, flipping the case of each letter in turn (or flipping whatever case it already had, for Inverse) and leaving spaces and punctuation untouched.',
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
