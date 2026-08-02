import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Binary, Zap, Shield, Layers } from 'lucide-react';
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
import NumberBaseTool from '@/features/character/number-base/components';

export const metadata: Metadata = {
  title: 'Number Base Converter',
  description:
    'Convert numbers between binary, octal, decimal, and hexadecimal simultaneously as you type. Includes bit pattern visualiser, byte size, and common value reference - instant, private, no server.',
  keywords: [
    'number base converter online',
    'binary decimal hex converter',
    'base converter online free',
    'number system converter',
    'binary to decimal converter',
    'decimal to binary converter',
    'hex to decimal converter',
    'decimal to hex converter',
    'binary octal decimal hex converter',
    'bit pattern visualizer online',
    'byte size calculator online',
    'programmer number converter',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/number-base`,
  },
  openGraph: {
    title:
      'Number Base Converter - Binary, Octal, Decimal, Hex | Character Studio',
    description:
      'Edit any base and all four update live - with bit pattern display, byte size, and common value reference. Instant, private, no server.',
    url: `${SITE_URL}/character/number-base`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Type a number in any base',
    desc: 'Enter binary, octal, decimal, or hexadecimal - with an optional leading minus sign.',
  },
  {
    step: '02',
    title: 'Read the other three instantly',
    desc: 'All four representations update together as you edit any one of them.',
  },
  {
    step: '03',
    title: 'Check the bit pattern',
    desc: 'View the binary grouped into bytes alongside the total bit length.',
  },
];

const COMMON_VALUES = [
  { title: '255', meta: 'FF · 11111111', desc: 'Max value of an unsigned byte' },
  { title: '256', meta: '100 · 100000000', desc: 'One byte overflow / 2⁸' },
  { title: '65535', meta: 'FFFF', desc: 'Max value of an unsigned 16-bit int' },
  {
    title: '2147483647',
    meta: '7FFFFFFF',
    desc: 'Max value of a signed 32-bit int',
  },
];

const FAQS = [
  {
    q: 'Is there a limit to how large a number I can convert?',
    a: "No practical limit - the converter uses JavaScript's BigInt type internally rather than ordinary numbers, so it handles integers far larger than the 32-bit or 64-bit ranges most programming languages cap out at, without losing precision.",
  },
  {
    q: 'Can I convert negative numbers?',
    a: "Yes - enter a number with a leading minus sign in any base, and the sign carries through to all four representations. This is a simple signed-magnitude representation (a minus sign plus the magnitude), not two's complement, so it won't match the raw bit pattern a CPU would store for a negative signed integer.",
  },
  {
    q: 'What does the grouped binary display show?',
    a: 'It inserts a space every 4 or 8 bits (from the right-hand, least-significant end) so long binary strings are easier to read at a glance - the same convention used when documenting byte-aligned data like memory addresses or network packets.',
  },
  {
    q: 'Why does the hex output use uppercase letters?',
    a: 'This tool normalizes hexadecimal digits A-F to uppercase for readability and consistency, though hexadecimal itself is case-insensitive - 0xff and 0xFF represent the same value.',
  },
  {
    q: 'What happens if I type an invalid character for the selected base?',
    a: 'The converter validates your input against the chosen base - for example, entering a "9" while in binary or octal mode is flagged as invalid rather than silently truncated, since that could otherwise produce a misleadingly wrong result.',
  },
];

export default function NumberBasePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Number Base Converter', path: '/character/number-base' },
          ]),
          softwareApplicationJsonLd({
            name: 'Number Base Converter',
            description:
              'Convert numbers between binary, octal, decimal, and hexadecimal simultaneously as you type. Includes bit pattern visualiser, byte size, and common value reference - instant, private, no server.',
            path: '/character/number-base',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to convert between number bases',
            description:
              'Convert between binary, octal, decimal, and hexadecimal live as you type.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Number Base Converter', path: '/character/number-base' },
        ]}
        badges={[{ label: 'BIN · OCT · DEC · HEX', color: 'blue' }]}
        title="Convert Between Number Bases"
        description="Binary, octal, decimal, and hexadecimal, all updating live as you type any one of them - with a grouped bit pattern view and byte size."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Live, all four at once' },
          { icon: Binary, label: 'Arbitrary precision' },
          { icon: Layers, label: 'Bit pattern view' },
        ]}
      />

      <div className="px-6 py-6">
        <NumberBaseTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Common reference values"
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-4"
        cards={COMMON_VALUES}
      />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Whichever base you're typing in is parsed into a BigInt - JavaScript's arbitrary-precision integer type - rather than an ordinary floating-point number, which is what lets this tool handle integers far larger than 32 or 64 bits without rounding errors. That single BigInt value is then re-rendered into binary, octal, decimal, and hexadecimal strings, so all four stay perfectly in sync no matter which one you're editing.",
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
