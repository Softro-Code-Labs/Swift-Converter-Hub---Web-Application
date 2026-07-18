'use client';

import {
  AlignLeft,
  ArrowUpDown,
  Binary,
  CaseSensitive,
  Cpu,
  FileCheck,
  Fingerprint,
  GitCompare,
  Hash,
  Link2,
  RefreshCw,
  ScanText,
  Shield,
  Type,
  Zap,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools ------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // ---- Analysis group ------------------------------------------------------
  {
    id: 'word-counter',
    icon: Hash,
    title: 'Word & Character Counter',
    desc: 'Live count of words, characters, sentences, and estimated read time as you type.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/character/word-counter',
    status: 'live',
    group: 'analysis',
    featured: true,
    tags: [
      'words',
      'count',
      'characters',
      'sentences',
      'reading time',
      'stats',
    ],
  },
  {
    id: 'text-diff',
    icon: GitCompare,
    title: 'Text Diff Viewer',
    desc: 'Compare two texts side-by-side and see exactly what changed - added, removed, or modified.',
    color: 'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
    accentBorder: 'hover:border-sky-300 dark:hover:border-sky-700',
    accentText: 'group-hover:text-sky-600 dark:group-hover:text-sky-400',
    href: '/character/text-diff',
    status: 'live',
    group: 'analysis',
    featured: true,
    tags: ['diff', 'compare', 'changes', 'added', 'removed', 'side by side'],
  },
  {
    id: 'text-sorter',
    icon: ArrowUpDown,
    title: 'Text Sorter & Deduplicator',
    desc: 'Sort lines A-Z, by length, or shuffle. Remove duplicates and blank lines instantly.',
    color: 'bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400',
    accentBorder: 'hover:border-teal-300 dark:hover:border-teal-700',
    accentText: 'group-hover:text-teal-600 dark:group-hover:text-teal-400',
    href: '/character/text-sorter',
    status: 'live',
    group: 'analysis',
    featured: false,
    tags: [
      'sort',
      'deduplicate',
      'unique',
      'alphabetical',
      'shuffle',
      'reverse',
      'blank lines',
    ],
  },

  // -- Writing group ---------------------------------------------------------
  {
    id: 'case-converter',
    icon: CaseSensitive,
    title: 'Case Converter',
    desc: 'UPPERCASE, lowercase, camelCase, snake_case, Title Case, and more in one click.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/character/case-converter',
    status: 'live',
    group: 'writing',
    featured: true,
    tags: [
      'uppercase',
      'lowercase',
      'camelcase',
      'snake_case',
      'kebab',
      'pascal',
      'title case',
      'convert',
    ],
  },
  {
    id: 'find-replace',
    icon: RefreshCw,
    title: 'Find & Replace',
    desc: 'Swap plain text or use regex patterns to replace matches across your content in bulk.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/character/find-replace',
    status: 'live',
    group: 'writing',
    featured: false,
    tags: ['find', 'replace', 'search', 'regex', 'substitute', 'bulk'],
  },
  {
    id: 'markdown-preview',
    icon: FileCheck,
    title: 'Markdown Preview',
    desc: 'Live-render Markdown into formatted HTML as you type - great for READMEs and docs.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/character/markdown-preview',
    status: 'live',
    group: 'writing',
    featured: true,
    tags: ['markdown', 'preview', 'html', 'render', 'readme', 'docs', 'gfm'],
  },
  {
    id: 'lorem-ipsum',
    icon: AlignLeft,
    title: 'Lorem Ipsum Generator',
    desc: 'Generate placeholder text by words, sentences, or paragraphs - classic or random.',
    color:
      'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
    accentBorder: 'hover:border-orange-300 dark:hover:border-orange-700',
    accentText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    href: '/character/lorem-ipsum',
    status: 'live',
    group: 'writing',
    featured: false,
    tags: ['lorem ipsum', 'placeholder', 'dummy text', 'generate', 'filler'],
  },

  // -- Code group ----------------------------------------------------------
  {
    id: 'regex-tester',
    icon: Binary,
    title: 'Regex Tester',
    desc: 'Test patterns live with full match highlighting, capture groups, and flag controls.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/character/regex-tester',
    status: 'live',
    group: 'code',
    featured: true,
    tags: [
      'regex',
      'pattern',
      'match',
      'capture groups',
      'flags',
      'regular expression',
    ],
  },
  {
    id: 'url-encoder',
    icon: Link2,
    title: 'URL Encoder / Decoder',
    desc: 'Encode or decode URL components and parse full URLs into protocol, host, params, and hash.',
    color:
      'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    accentBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700',
    accentText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    href: '/character/url-encoder',
    status: 'live',
    group: 'code',
    featured: false,
    tags: [
      'url',
      'encode',
      'decode',
      'percent',
      'query params',
      'parse',
      'uri',
    ],
  },
  {
    id: 'hash-generator',
    icon: Fingerprint,
    title: 'Hash Generator',
    desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files using Web Crypto.',
    color: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
    accentBorder: 'hover:border-red-300 dark:hover:border-red-700',
    accentText: 'group-hover:text-red-600 dark:group-hover:text-red-400',
    href: '/character/hash-generator',
    status: 'live',
    group: 'code',
    featured: false,
    tags: [
      'hash',
      'md5',
      'sha256',
      'sha512',
      'sha1',
      'hmac',
      'checksum',
      'crypto',
    ],
  },

  // -- Inspect group ------------------------------------------------------
  {
    id: 'unicode-inspector',
    icon: ScanText,
    title: 'Unicode Inspector',
    desc: "Reveal every character's code point, category, and hex value - exposes invisible chars and smart quotes.",
    color:
      'bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400',
    accentBorder: 'hover:border-violet-300 dark:hover:border-violet-700',
    accentText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    href: '/character/unicode-inspector',
    status: 'live',
    group: 'inspect',
    featured: true,
    tags: [
      'unicode',
      'code point',
      'invisible',
      'smart quotes',
      'utf8',
      'hex',
      'inspect',
      'hidden',
    ],
  },
  {
    id: 'number-base',
    icon: Cpu,
    title: 'Number Base Converter',
    desc: 'Convert between binary, octal, decimal, and hex simultaneously as you type.',
    color: 'bg-lime-100 dark:bg-lime-950/50 text-lime-600 dark:text-lime-400',
    accentBorder: 'hover:border-lime-300 dark:hover:border-lime-700',
    accentText: 'group-hover:text-lime-600 dark:group-hover:text-lime-400',
    href: '/character/number-base',
    status: 'live',
    group: 'inspect',
    featured: false,
    tags: [
      'binary',
      'hex',
      'octal',
      'decimal',
      'base',
      'convert',
      'bits',
      'number',
    ],
  },
];

// --- Groups --------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'analysis',
    label: 'Text Analysis',
    desc: 'Count, compare, and understand your text',
    dot: 'bg-rose-400',
  },
  {
    id: 'writing',
    label: 'Writing & Formatting',
    desc: 'Shape, transform, and generate text',
    dot: 'bg-emerald-400',
  },
  {
    id: 'code',
    label: 'Code & Data',
    desc: 'Regex, URLs, hashes, and encoding',
    dot: 'bg-purple-400',
  },
  {
    id: 'inspect',
    label: 'Inspect & Convert',
    desc: "Decode what you see - and what you can't",
    dot: 'bg-violet-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: Type,
  iconColor: 'text-rose-600 dark:text-rose-400',
  iconBg:
    'bg-rose-100 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800',
  title: 'Character Studio',
  subtitle: 'Pure JavaScript · Zero upload · Always instant',
  description: `Every tool runs entirely in your browser - no engine to wait for, no server round-trips, no uploads. Open any tool and it's ready instantly.`,
  privacyNote:
    '🔒 Your data files never leave your device - processed entirely in-browser.',
  accentFrom: 'from-rose-400',
  accentTo: 'to-rose-500',
  badgeColor:
    'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  pills: [
    {
      icon: Shield,
      label: 'No server uploads',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'Instant - no loading',
      color:
        'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    },
    {
      icon: Type,
      label: '12 text tools',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
  ],
};

// --- Page ---------------------------------------------------------------------

export default function CharacterStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'regex', 'hash', 'sort'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-blue-600 dark:hover:text-blue-400"
      footerNote="Have a text tool idea?"
      footerCta={{ label: 'Suggest a tool', href: '/contact' }}
    />
  );
}
