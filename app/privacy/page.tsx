import { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Eye,
  BarChart2,
  Globe,
  Mail,
  CheckCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Swift Converter Hub processes all files locally in your browser. Read our full privacy policy on data handling, cookies, and why your files never touch our servers.',
  keywords: [
    'swift converter hub privacy policy',
    'no upload file converter privacy',
    'browser based utility data security',
    'secure client side file processing',
    'gdpr compliant file converter',
    'local processing data protection policy',
    'private webassembly converter safety',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/privacy' },
  openGraph: {
    title: 'Privacy Policy - Privacy-First Local File Converters',
    description:
      'Your files never leave your browser. Read our full privacy policy.',
    url: 'https://swiftconverterhub.com/privacy',
    type: 'website',
  },
};

const SECTIONS = [
  {
    id: '1',
    icon: Shield,
    title: 'What we collect',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    content: (
      <>
        <p>
          We do not collect, store, or transmit any files you process using our
          tools. All file conversion happens entirely inside your browser using
          WebAssembly. Your files never leave your device.
        </p>
        <p className="mt-3">
          We may collect basic anonymous analytics - page views, button clicks,
          error rates - to understand how the tools are used and improve them.
          This data contains no personal information and cannot be linked to
          you.
        </p>
      </>
    ),
  },
  {
    id: '2',
    icon: Eye,
    title: 'What we never see',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    content: (
      <ul className="space-y-2">
        {[
          'The content, pixels, or text of any file you upload',
          'File names or metadata of files you process',
          'Any personal or identifying information from your files',
          'Your conversion history or output files',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: '3',
    icon: BarChart2,
    title: 'Advertising & analytics',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    content: (
      <>
        <p>
          To keep our tools free, we show ads through Google AdSense. Google may
          use cookies to show relevant ads based on your general browsing
          activity. These cookies cannot access your files or conversion data in
          any way.
        </p>
        <p className="mt-3">
          You can block ads using any standard browser extension without
          affecting the functionality of our conversion tools. We use Google
          Analytics for anonymous usage statistics. You can opt out via{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google's opt-out tool
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: '4',
    icon: Globe,
    title: 'Your rights & compliance',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    content: (
      <>
        <p>
          Because we never store your personal data or files, there is nothing
          to request deletion of. Our architecture makes data breaches involving
          your files technically impossible - there is no database of your
          content to breach.
        </p>
        <p className="mt-3">
          Our service is designed to comply with GDPR (EU), CCPA (California),
          and HIPAA data safety principles. If you have questions about your
          rights, contact us at the address below.
        </p>
      </>
    ),
  },
  {
    id: '5',
    icon: Mail,
    title: 'Contact us',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    content: (
      <>
        <p>
          Questions about this policy or how your data is handled? Reach us at:
        </p>
        <a
          href="mailto:privacy@swiftconverterhub.com"
          className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          privacy@swiftconverterhub.com
        </a>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      {/* -- Header -------------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                Version 1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Last updated: June 2026
            </p>
          </div>

          {/* Core promise banner */}
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-xl">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                Your files never leave your device
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5 leading-relaxed">
                All conversion happens locally in your browser using
                WebAssembly. We have no servers that receive your files - this
                is not a policy promise, it's an architectural fact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* -- Content ------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {SECTIONS.map(({ id, icon: Icon, title, color, content }) => (
          <div
            key={id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">
                  {id}
                </span>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </div>

            {/* Section body */}
            <div className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {content}
            </div>
          </div>
        ))}
      </div>

      {/* -- Footer -------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Swift Converter Hub
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/terms"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
            >
              Terms of Service
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
