import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import TextDiffTool from '@/features/character/text-diff/components';

export const metadata: Metadata = {
  title: 'Text Diff Viewer',
  description:
    'Compare two texts side-by-side or in unified view and see exactly what changed - added, removed, and unchanged lines highlighted instantly. No server, 100% private.',
  keywords: [
    // Core intent
    'text diff online',
    'text compare tool',
    'diff checker online',
    'compare two texts online',
    'text difference finder',
    'online diff viewer',
    'line by line diff tool',
    'text comparison tool free',
    'find differences in text',
    'highlight text changes online',

    // Dev / code use cases
    'code diff viewer browser',
    'compare code snippets online',
    'config file diff tool',
    'json diff checker online',
    'yaml diff viewer online',
    'compare file contents browser',
    'git diff alternative online',
    'patch diff viewer web',
    'side by side code compare',
    'unified diff format viewer',

    // Writing / document use cases
    'compare document versions online',
    'draft revision comparison tool',
    'writing diff checker free',
    'compare essay versions online',
    'track text changes browser',
    'proofread text difference tool',
    'contract text compare tool',
    'legal document diff checker',
    'before after text comparison',
    'changelog diff generator',

    // Features
    'split view diff tool',
    'unified diff view online',
    'line number diff viewer',
    'added removed lines counter',
    'text diff stats online',
    'instant diff no upload',
    'real time diff viewer',
    'client side diff algorithm',
    'myers diff algorithm browser',
    'no server diff checker',

    // Privacy
    'private text diff tool',
    'offline diff viewer browser',
    'secure document comparison',
    'local diff no upload',
    'browser based diff tool',

    // Long-tail
    'compare two paragraphs online',
    'find changed lines in text',
    'text version control browser',
    'simple diff tool no login',
    'free diff checker no account',
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

export default function TextDiffPage() {
  return <TextDiffTool />;
}
