import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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
