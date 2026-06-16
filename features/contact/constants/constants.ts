import { Bug, Lightbulb, Shield, MessageSquare } from 'lucide-react';

export const TOPICS = [
  {
    id: 'bug',
    icon: Bug,
    label: 'Report a bug',
    desc: 'A tool is broken or producing wrong output',
    color: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/60',
    selectedBg: 'bg-red-50 dark:bg-red-950/20',
  },
  {
    id: 'feature',
    icon: Lightbulb,
    label: 'Feature request',
    desc: 'Suggest a new tool or improvement',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/60',
    selectedBg: 'bg-amber-50 dark:bg-amber-950/20',
  },
  {
    id: 'privacy',
    icon: Shield,
    label: 'Privacy question',
    desc: 'Questions about data handling or security',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60',
    selectedBg: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: 'other',
    icon: MessageSquare,
    label: 'General enquiry',
    desc: 'Anything else you want to ask',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    selectedBg: 'bg-slate-50 dark:bg-slate-800/60',
  },
];

export const FAQS = [
  {
    q: 'Are my files safe when I use your tools?',
    a: 'Yes. All conversion happens inside your browser using WebAssembly. Your files are never uploaded to any server.',
  },
  {
    q: 'Why is a conversion failing for my file?',
    a: 'Some formats require specific delegate libraries that may not be compiled into the WASM build. Try a different format or report the issue with your file details.',
  },
  {
    q: 'Can I use the tools offline?',
    a: 'Yes — after the page loads, the WebAssembly engine is in your browser. You can disconnect from the internet and conversions will still work.',
  },
  {
    q: 'Do you have an API?',
    a: 'Not currently. All tools are browser-based. If you need programmatic access, consider ImageMagick directly for server-side workflows.',
  },
];
