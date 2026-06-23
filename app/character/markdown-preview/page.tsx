import { Metadata } from 'next';
import MarkdownPreviewTool from '@/features/character/markdown-preview/components';

export const metadata: Metadata = {
  title: 'Markdown Preview',
  description:
    'Write Markdown and see it rendered live. Supports GitHub Flavoured Markdown - tables, code blocks, strikethrough, task lists. Export to .md or .html. 100% private, runs in your browser.',
  keywords: [
    // Original core keywords
    'markdown preview online',
    'live markdown editor',
    'markdown to html converter',
    'github flavoured markdown preview',
    'gfm renderer browser',
    'markdown editor split view',
    'markdown preview tool free',
    'readme preview online',
    'markdown export html',
    'markdown no upload private',
    'real time markdown renderer',
    'markdown cheatsheet tool',

    // GitHub & Open Source Development workflows
    'github readme md file checker',
    'preview github repository readme',
    'markdown checkbox task list renderer',
    'gfm table formatting tool online',
    'markdown code block syntax highlighting',
    'render markdown alerts and callouts',
    'github pull request markdown template tester',
    'test issue description formatting online',

    // Technical Writing & Documentation Systems
    'technical documentation md writer',
    'convert markdown to static clean html',
    'markdown tables generator and viewer',
    'frontmatter metadata markdown validator',
    'nested list markdown bullet renderer',
    'inline code styling markdown viewer',
    'convert md headers to html code',
    'markdown inline link formatting tester',

    // Content Creation & Static Site Generators
    'hugo markdown post content preview',
    'jekyll blog post md editor',
    'docusaurus page markup renderer',
    'notion export markdown clean visualizer',
    'obsidian notebook markdown previewer',
    'strapi cms markdown body field preview',
    'ghost blog markdown entry editor',

    // Export formats & styling variants
    'download markdown file as raw html',
    'export markdown to clean md text',
    'copy rendered markdown html to clipboard',
    'markdown view formatted rich text',
    'convert text format to standard markdown',
    'strip markdown syntax keep plain text',
    'markdown styling sheet compiler browser',

    // Desktop/Browser performance & layouts
    'side by side markdown visualizer',
    'distraction free markdown drafting tool',
    'fullscreen responsive markdown editor',
    'auto save markdown editor online',
    'lightweight markdown canvas layout',

    // Privacy-first local sandbox positioning
    'offline markdown workspace browser',
    'secure private documentation drafting',
    'zero data logs markdown compiler',
    'client side canvas md previewer',
    'wasm powered markdown engine html5',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/markdown-preview',
  },
  openGraph: {
    title: 'Markdown Preview - Live GFM Renderer | Character Studio',
    description:
      'Split view, fullscreen, export to .md or .html - instant, private, no server.',
    url: 'https://swiftconverterhub.com/character/markdown-preview',
    type: 'website',
  },
};

export default function MarkdownPreviewPage() {
  return <MarkdownPreviewTool />;
}
