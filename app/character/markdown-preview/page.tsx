import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileCode, Zap, Shield, Table } from 'lucide-react';
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
import MarkdownPreviewTool from '@/features/character/markdown-preview/components';

export const metadata: Metadata = {
  title: 'Markdown Preview',
  description:
    'Write Markdown and see it rendered live. Supports GitHub Flavoured Markdown - tables, code blocks, strikethrough, task lists. Export to .md or .html. 100% private, runs in your browser.',
  keywords: [
    'markdown preview online',
    'live markdown editor',
    'markdown to html converter',
    'github flavoured markdown preview',
    'gfm renderer browser',
    'markdown editor split view',
    'markdown preview tool free',
    'readme preview online',
    'markdown table renderer',
    'markdown code block preview',
    'live md to html converter',
    'readme markdown viewer online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/markdown-preview`,
  },
  openGraph: {
    title: 'Markdown Preview - Live GFM Renderer | Character Studio',
    description:
      'Split view, fullscreen, export to .md or .html - instant, private, no server.',
    url: `${SITE_URL}/character/markdown-preview`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Write or paste Markdown',
    desc: 'Use the editor pane - a README, notes, or any GFM-flavoured Markdown.',
  },
  {
    step: '02',
    title: 'Watch it render live',
    desc: 'Split view shows source and preview side by side, updating as you type.',
  },
  {
    step: '03',
    title: 'Export the result',
    desc: 'Download as a .md source file or a standalone .html page.',
  },
];

const FAQS = [
  {
    q: 'What does "GitHub Flavoured Markdown" add over standard Markdown?',
    a: 'GFM extends the original Markdown spec with tables, strikethrough (~~text~~), automatic linking of raw URLs, and task lists (- [ ] todo). This preview supports all of these, matching how your Markdown would actually render on GitHub.',
  },
  {
    q: 'Are single line breaks preserved?',
    a: 'Yes - this renderer treats a single newline as a line break (<br>), unlike strict CommonMark which requires a blank line between paragraphs. That matches how most chat apps, issue trackers, and GitHub comments render Markdown, so what you see here should closely match those contexts.',
  },
  {
    q: 'Is the rendered HTML safe if I paste Markdown from somewhere untrusted?',
    a: "Yes - the rendered output is passed through DOMPurify, a dedicated HTML-sanitizing library, before being displayed. This strips out any embedded scripts or dangerous markup, so pasting Markdown from an unfamiliar source won't run arbitrary code in your browser.",
  },
  {
    q: 'Can I get a standalone HTML file, not just the preview?',
    a: 'Yes - the "export .html" option wraps the rendered content in a complete, styled HTML document you can open directly in a browser or attach to an email, separate from the raw .md export.',
  },
  {
    q: 'Is my content uploaded anywhere?',
    a: 'No. Parsing and rendering both happen locally using the marked library, and the sanitizing step runs in-browser too - nothing is sent to a server.',
  },
];

export default function MarkdownPreviewPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Markdown Preview', path: '/character/markdown-preview' },
          ]),
          softwareApplicationJsonLd({
            name: 'Markdown Preview',
            description:
              'Write Markdown and see it rendered live. Supports GitHub Flavoured Markdown - tables, code blocks, strikethrough, task lists. Export to .md or .html. 100% private, runs in your browser.',
            path: '/character/markdown-preview',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to preview Markdown online',
            description:
              'Write GitHub Flavoured Markdown and preview it live, then export to .md or .html.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Markdown Preview', path: '/character/markdown-preview' },
        ]}
        badges={[{ label: 'MARKDOWN', color: 'cyan' }]}
        title="Live Markdown Preview & Editor"
        description="Write GitHub Flavoured Markdown and see it render live in a split view - tables, code blocks, task lists and more, exportable to .md or .html."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Live rendering' },
          { icon: Table, label: 'GFM tables & tasks' },
          { icon: FileCode, label: 'Export .md / .html' },
        ]}
      />

      <div className="px-6 py-6">
        <MarkdownPreviewTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the preview is rendered"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Your Markdown is parsed with marked, a fast Markdown compiler configured with GitHub Flavoured Markdown extensions enabled and single newlines treated as line breaks. The resulting HTML is then passed through DOMPurify, a dedicated sanitizer, before being injected into the preview pane - stripping any scripts or unsafe attributes so the preview is safe to use even with Markdown from a source you don\'t fully trust.',
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
