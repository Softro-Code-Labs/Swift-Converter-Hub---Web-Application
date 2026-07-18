import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewTool />;
}
