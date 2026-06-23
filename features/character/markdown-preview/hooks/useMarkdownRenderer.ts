'use client';

import { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import type { MarkdownStats } from '../types/markdownPreview';

// Configure marked once
marked.setOptions({
  gfm: true, // GitHub Flavoured Markdown
  breaks: true, // single newline → <br>
});

function computeStats(text: string): MarkdownStats {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text.split('\n').length;
  const minutes = words / 238;
  const readingTime = minutes < 1 ? '< 1 min' : `${Math.round(minutes)} min`;
  return { words, lines, readingTime };
}

export function useMarkdownRenderer(markdown: string): {
  html: string;
  stats: MarkdownStats;
} {
  return useMemo(() => {
    const stats = computeStats(markdown);
    if (!markdown.trim()) return { html: '', stats };

    const raw = marked.parse(markdown) as string;
    const html = DOMPurify.sanitize(raw, {
      USE_PROFILES: { html: true },
      // Allow safe attrs for things like anchor hrefs, img src
      ADD_ATTR: ['target', 'rel'],
    });

    return { html, stats };
  }, [markdown]);
}
