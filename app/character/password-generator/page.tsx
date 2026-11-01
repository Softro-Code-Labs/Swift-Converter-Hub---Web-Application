import { Metadata } from 'next';
import { ShieldCheck, Zap, SlidersHorizontal, ListPlus } from 'lucide-react';
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
import PasswordGeneratorTool from '@/features/character/password-generator/components';
import { pageMetadata } from '@/lib/seo';

const PATH = '/character/password-generator';

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Password Generator - Strong Random Passwords & Passphrases',
  ogTitle: 'Strong Password Generator',
  description:
    'Generate strong random passwords, memorable passphrases and PINs with advanced options and a strength meter. Made on your device - never sent or stored.',
  keywords: [
    'password generator',
    'strong password generator',
    'random password generator',
    'secure password generator',
    'passphrase generator',
    'diceware password generator',
    'pin generator',
    'password generator without symbols',
    'wifi password generator',
    'bulk password generator',
    'password strength checker',
    'memorable password generator',
  ],
});

const STEPS = [
  {
    step: '01',
    title: 'Choose password, passphrase or PIN',
    desc: 'Random characters for accounts, words for things you type often, digits for cards and phones.',
  },
  {
    step: '02',
    title: 'Set the rules',
    desc: 'Pick the length and character types, or a preset. Advanced options cover site rules like "no symbols" or "must start with a letter".',
  },
  {
    step: '03',
    title: 'Copy it into your password manager',
    desc: 'The strength meter shows how long it would take to crack. Need many? Generate a list and download it.',
  },
];

const CARDS = [
  {
    title: 'Random password',
    meta: 'Best for accounts',
    desc: 'Up to 128 characters from the types you choose. 16 characters with every type is about 103 bits - beyond any brute-force attack.',
  },
  {
    title: 'Passphrase',
    meta: 'Best for things you type',
    desc: 'Random words from the EFF list, like Velvet-Copper-Drizzle7-Atlas-Ember. Five words plus a digit is about 70 bits and far easier to remember.',
  },
  {
    title: 'PIN',
    meta: 'Best for cards and phones',
    desc: 'Random digits that skip the PINs people guess first, such as 1234, 0000, 2580 and birth years.',
  },
];

const FAQS = [
  {
    q: 'Is this password generator safe to use?',
    a: 'Yes. Passwords are created in your browser with crypto.getRandomValues, the same cryptographically secure random source browsers use for encryption keys. Nothing is sent over the network and generated passwords are never saved - only your settings (like length) are remembered on this device.',
  },
  {
    q: 'How long should my password be?',
    a: 'For accounts, at least 14-16 random characters with mixed types, or a passphrase of five or more words. Anything that shows as "Strong" or "Very strong" in the meter is beyond practical guessing. Length matters more than adding symbols.',
  },
  {
    q: 'What is a passphrase and is it as strong as a password?',
    a: "A passphrase is several random words joined together. Each word from the 7,776-word EFF list adds about 12.9 bits, so five words (about 65 bits) beat most 10-character passwords, and six words reach about 78 bits. They're much easier to type on a phone or TV and to remember.",
  },
  {
    q: 'What do "look-alike" and "ambiguous" characters mean?',
    a: 'Look-alikes are characters that are easy to misread, like I, l, 1 and |, or O, 0 and o - useful to avoid when you have to read a password aloud or type it from paper. Ambiguous symbols such as quotes, brackets and slashes are sometimes rejected by websites or break when pasted into scripts.',
  },
  {
    q: 'How is the time to crack worked out?',
    a: 'From the entropy: the number of equally likely passwords your settings can produce. The estimate assumes an attacker who has stolen a password database and can try 10 billion guesses a second, and shows the average time to find yours. Real attacks against a login page are far slower.',
  },
  {
    q: 'Can I generate many passwords at once?',
    a: 'Yes - use "Generate a list" to create up to 100 with the same settings, then copy them all or download them as a .txt file.',
  },
];

export default function PasswordGeneratorPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Text Studio', path: '/character' },
            { name: 'Password Generator', path: PATH },
          ]),
          softwareApplicationJsonLd({
            name: 'Password Generator',
            description:
              'Generate strong random passwords, EFF-wordlist passphrases and PINs in your browser with a strength meter and advanced rules.',
            path: PATH,
            category: 'SecurityApplication',
          }),
          howToJsonLd({
            name: 'How to generate a strong password',
            description:
              'Create a strong random password, passphrase or PIN in your browser.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Text Studio', path: '/character' },
          { name: 'Password Generator', path: PATH },
        ]}
        badges={[{ label: 'SECURITY', color: 'purple' }]}
        title="Strong Password Generator"
        description="Create random passwords, memorable passphrases and PINs with the rules you need - generated on your device and never sent or stored."
        features={[
          { icon: ShieldCheck, label: 'Never leaves your device' },
          { icon: Zap, label: 'Cryptographically secure' },
          { icon: SlidersHorizontal, label: 'Advanced rules' },
          { icon: ListPlus, label: 'Bulk lists' },
        ]}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <PasswordGeneratorTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Which one should I use?"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={CARDS}
      />

      <TechnicalNote
        title="How the passwords are made"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Every character, word and digit is picked with crypto.getRandomValues using rejection sampling, so each option is exactly equally likely - a plain modulo would make some characters slightly more common. Required character types are placed first and then the whole password is shuffled with a secure Fisher-Yates shuffle, so their positions are random too.',
          'Passphrases use the EFF Large Wordlist (CC BY 3.0, Electronic Frontier Foundation), designed so every word is common, easy to spell and distinct from the others.',
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
