import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { GitCompare, Zap, Shield, Columns2 } from 'lucide-react';
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
import TextDiffTool from '@/features/character/text-diff/components';

export const metadata: Metadata = {
  title: 'Text Diff Viewer',
  description:
    'Compare two texts side-by-side or in unified view and see exactly what changed - added, removed, and unchanged lines highlighted instantly. No server, 100% private.',
  keywords: [
    'text diff online',
    'text compare tool',
    'diff checker online',
    'compare two texts online',
    'text difference finder',
    'online diff viewer',
    'line by line diff tool',
    'text comparison tool free',
    'side by side diff tool',
    'unified diff viewer online',
    'compare code changes online',
    'diff viewer online free',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/text-diff`,
  },
  openGraph: {
    title:
      'Text Diff Viewer - Compare Any Two Texts Instantly | Character Studio',
    description:
      'Side-by-side and unified diff with live highlighting, line numbers, and change stats - instant, private, no server.',
    url: `${SITE_URL}/character/text-diff`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste the original text',
    desc: 'Drop your first version into the left-hand pane.',
  },
  {
    step: '02',
    title: 'Paste the revised text',
    desc: 'Drop the second version into the right-hand pane.',
  },
  {
    step: '03',
    title: 'Read the highlighted diff',
    desc: 'Switch between side-by-side and unified view, with an added/removed/unchanged line count.',
  },
];

const FAQS = [
  {
    q: 'What algorithm computes the differences?',
    a: "The Myers diff algorithm - the same core approach behind the diff command-line tool and most version-control systems - which finds the shortest edit script (the minimum number of line insertions and deletions) needed to turn the first text into the second.",
  },
  {
    q: "What's the difference between side-by-side and unified view?",
    a: 'Side-by-side shows both versions in two columns so you can scan them in parallel. Unified view interleaves the changes into a single column with lines marked as added or removed - the same format used in most code review tools and Git diffs.',
  },
  {
    q: 'Does it compare word by word or line by line?',
    a: "Line by line. Each line of the original and revised text is treated as a single unit for comparison, so a line with even a single character changed is shown as one removed line and one added line, rather than highlighting just the changed word within it.",
  },
  {
    q: 'Is the comparison case-sensitive?',
    a: 'Yes - "Hello" and "hello" on otherwise identical lines will be shown as a change, since the comparison checks for an exact line match.',
  },
  {
    q: 'Is either text uploaded anywhere?',
    a: 'No. The diff is computed entirely in your browser using a local JavaScript implementation of the Myers algorithm - nothing is sent to a server.',
  },
];

export default function TextDiffPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Text Diff Viewer', path: '/character/text-diff' },
          ]),
          softwareApplicationJsonLd({
            name: 'Text Diff Viewer',
            description:
              'Compare two texts side-by-side or in unified view and see exactly what changed - added, removed, and unchanged lines highlighted instantly. No server, 100% private.',
            path: '/character/text-diff',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to compare two texts online',
            description:
              'Paste two versions of a text and see a line-by-line diff.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Text Diff Viewer', path: '/character/text-diff' },
        ]}
        badges={[{ label: 'DIFF', color: 'teal' }]}
        title="Compare Two Texts Online"
        description="See exactly what changed between two pieces of text - added, removed, and unchanged lines highlighted, in side-by-side or unified view."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Live comparison' },
          { icon: GitCompare, label: 'Myers diff algorithm' },
          { icon: Columns2, label: 'Side-by-side or unified' },
        ]}
      />

      <div className="px-6 py-6">
        <TextDiffTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the diff is calculated"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Both texts are split into lines and compared using the Myers diff algorithm, implemented directly in JavaScript with no external dependency. It finds the shortest possible sequence of line insertions and deletions that transforms the original into the revised version - the same underlying approach used by the Unix diff utility and by Git when it shows you what changed in a commit.",
          'The result is rendered as a sequence of equal, insert, and delete operations, which the interface then turns into highlighted lines and running added/removed/unchanged counts.',
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
