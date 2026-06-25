'use client';

import {
  Database,
  FileSpreadsheet,
  Code,
  Layers,
  Braces,
  FileJson,
  Binary,
  Shield,
  Zap,
  Package,
} from 'lucide-react';
import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';
import type {
  StudioTool,
  StudioGroup,
  StudioHeroConfig,
} from '@/features/shared/studio/types/studio';

// --- Tools --------------------------------------------------------------------

const TOOLS: StudioTool[] = [
  // -- Convert group -------------------------------------------------
  {
    id: 'csv-json',
    icon: FileSpreadsheet,
    title: 'CSV ↔ JSON Converter',
    desc: 'Turn spreadsheet rows into nested JSON objects, or flatten structured JSON back to CSV.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    accentBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
    accentText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    href: '/data/csv-json',
    status: 'soon',
    group: 'convert',
    featured: true,
    tags: ['csv', 'json', 'spreadsheet', 'convert', 'table', 'rows', 'columns'],
  },
  {
    id: 'json-xml',
    icon: Code,
    title: 'JSON ↔ XML Converter',
    desc: 'Bridge modern API payloads with legacy XML-based systems - convert in either direction.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    accentBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
    accentText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
    href: '/data/json-xml',
    status: 'soon',
    group: 'convert',
    featured: true,
    tags: ['json', 'xml', 'convert', 'api', 'payload', 'legacy', 'soap'],
  },
  {
    id: 'yaml-json',
    icon: Braces,
    title: 'YAML ↔ JSON Converter',
    desc: 'Convert deployment configs, CI pipelines, and API specs between YAML and JSON formats.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    accentBorder: 'hover:border-purple-300 dark:hover:border-purple-700',
    accentText: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
    href: '/data/yaml-json',
    status: 'soon',
    group: 'convert',
    featured: false,
    tags: [
      'yaml',
      'json',
      'convert',
      'config',
      'deployment',
      'ci',
      'kubernetes',
      'docker',
    ],
  },
  {
    id: 'excel-json',
    icon: Layers,
    title: 'Excel to JSON',
    desc: 'Parse .xlsx multi-sheet workbooks into structured JSON - pick sheets, map columns.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
    accentText:
      'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    href: '/data/excel-json',
    status: 'soon',
    group: 'convert',
    featured: false,
    tags: [
      'excel',
      'xlsx',
      'json',
      'spreadsheet',
      'workbook',
      'sheets',
      'convert',
    ],
  },

  // -- Format group --------------------------------------------------
  {
    id: 'json-formatter',
    icon: FileJson,
    title: 'JSON Formatter & Validator',
    desc: 'Beautify with indentation, minify to strip whitespace, validate syntax, and inspect nested structure.',
    color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
    accentBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
    accentText: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    href: '/data/json-formatter',
    status: 'soon',
    group: 'format',
    featured: true,
    tags: [
      'json',
      'format',
      'beautify',
      'minify',
      'validate',
      'pretty print',
      'lint',
    ],
  },

  // -- Encode group --------------------------------------------------
  {
    id: 'base64-text',
    icon: Binary,
    title: 'Base64 Text Encoder / Decoder',
    desc: 'Encode plain text or decode Base64 strings - great for JWT payloads and API tokens.',
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    accentBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
    accentText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    href: '/data/base64-text',
    status: 'soon',
    group: 'encode',
    featured: true,
    tags: ['base64', 'encode', 'decode', 'text', 'jwt', 'token', 'string'],
  },
  {
    id: 'toml-json',
    icon: Package,
    title: 'TOML ↔ JSON Converter',
    desc: 'Convert Cargo.toml, pyproject.toml, or any TOML config to JSON and back.',
    color:
      'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
    accentBorder: 'hover:border-orange-300 dark:hover:border-orange-700',
    accentText: 'group-hover:text-orange-600 dark:group-hover:text-orange-400',
    href: '/data/toml-json',
    status: 'soon',
    group: 'convert',
    featured: false,
    tags: ['toml', 'json', 'convert', 'config', 'cargo', 'rust', 'python'],
  },
];

// --- Groups -------------------------------------------------------------------

const GROUPS: StudioGroup[] = [
  {
    id: 'convert',
    label: 'Format Converters',
    desc: 'Transform data between CSV, JSON, XML, YAML, TOML, and Excel',
    dot: 'bg-amber-400',
  },
  {
    id: 'format',
    label: 'Formatters & Validators',
    desc: 'Beautify, minify, lint, and inspect structured data',
    dot: 'bg-cyan-400',
  },
  {
    id: 'encode',
    label: 'Encode & Decode',
    desc: 'Base64, binary, and data encoding utilities',
    dot: 'bg-rose-400',
  },
];

// --- Hero config --------------------------------------------------------------

const HERO: StudioHeroConfig = {
  icon: Database,
  iconColor: 'text-amber-600 dark:text-amber-400',
  iconBg:
    'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800',
  title: 'Data Studio',
  subtitle: 'Client-side data conversion · No file uploads · Any size',
  description:
    'Every Data Studio tool runs entirely in your browser using pure JavaScript libraries - no server round-trips, no file size limits imposed by uploads. Drop in a 50 MB CSV and it processes instantly.',
  privacyNote:
    '🔒 Your data files never leave your device - processed entirely in-browser.',
  accentFrom: 'from-amber-400',
  accentTo: 'to-amber-500',
  badgeColor:
    'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  pills: [
    {
      icon: Shield,
      label: 'Files stay on your device',
      color:
        'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',
    },
    {
      icon: Zap,
      label: 'No file size limits',
      color:
        'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
    },
    {
      icon: Database,
      label: '7 data tools',
      color:
        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
    },
  ],
};

// --- Page ---------------------------------------------------------------------

export default function DataStudioClient() {
  return (
    <StudioPageLayout
      tools={TOOLS}
      groups={GROUPS}
      hero={HERO}
      searchPlaceholder="Search tools - try 'csv', 'yaml', 'base64'…"
      backHref="/"
      backLabel="Back to home"
      accentHover="hover:text-amber-600 dark:hover:text-amber-400"
      footerNote="Need a specific data converter?"
      footerCta={{ label: 'Let us know', href: '/contact' }}
    />
  );
}
