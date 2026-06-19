import Link from 'next/link';
import {
  ArrowLeft,
  FileCheck,
  Cpu,
  UserCheck,
  Copyright,
  AlertTriangle,
  Scale,
  RefreshCw,
} from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Swift Converter Hub — a free, browser-based file conversion toolkit.',
};

const SECTIONS = [
  {
    id: '1',
    icon: FileCheck,
    title: 'Acceptance of terms',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    content: (
      <p>
        By using Swift Converter Hub you agree to these terms. If you don't
        agree, please stop using the service. These terms apply to all tools and
        pages on swiftconverterhub.com.
      </p>
    ),
  },
  {
    id: '2',
    icon: Cpu,
    title: 'How the service works',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    content: (
      <>
        <p>
          Swift Converter Hub provides browser-based file conversion tools. All
          processing happens locally on your device using WebAssembly. We do not
          receive, store, or process your files on any server.
        </p>
        <p className="mt-3">
          You retain full ownership of all files you process. We make no claim
          over any content you bring into the tool.
        </p>
      </>
    ),
  },
  {
    id: '3',
    icon: UserCheck,
    title: 'Acceptable use',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    content: (
      <>
        <p>You agree not to use this service to process files that:</p>
        <ul className="mt-3 space-y-2">
          {[
            'Infringe on intellectual property, copyrights, or trademarks',
            'Contain malware, viruses, or malicious code',
            'Violate any applicable law or regulation',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0 mt-1.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          You are solely responsible for the files you process and any content
          they contain.
        </p>
      </>
    ),
  },
  {
    id: '4',
    icon: Copyright,
    title: 'Intellectual property',
    color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
    content: (
      <p>
        The design, code, and branding of Swift Converter Hub are our property.
        You may not copy, scrape, or redistribute our application code for
        commercial purposes. Our tools use open-source libraries (including
        ImageMagick and FFmpeg) which are governed by their respective licenses.
      </p>
    ),
  },
  {
    id: '5',
    icon: AlertTriangle,
    title: 'Disclaimer of warranties',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    content: (
      <>
        <p>
          The service is provided "as is" without any warranty of any kind. We
          do not guarantee that:
        </p>
        <ul className="mt-3 space-y-2">
          {[
            'The tools will be error-free or always available',
            'Every file format or file will convert successfully',
            'Results will meet your specific quality requirements',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 shrink-0 mt-1.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Always keep backups of important files before conversion.
        </p>
      </>
    ),
  },
  {
    id: '6',
    icon: Scale,
    title: 'Limitation of liability',
    color: 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400',
    content: (
      <p>
        Swift Converter Hub is not liable for any damages resulting from your
        use of the service, including data loss, corrupted output files, or
        browser crashes. You use these tools at your own risk. Since files are
        processed locally on your device, any issues are limited to your own
        environment.
      </p>
    ),
  },
  {
    id: '7',
    icon: RefreshCw,
    title: 'Changes to these terms',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    content: (
      <p>
        We may update these terms from time to time. We'll update the date at
        the top of this page when we do. Continued use of the service after
        changes means you accept the updated terms.
      </p>
    ),
  },
];

export default function TermsPage() {
  const year = new Date().getFullYear();

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
                Terms of Service
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Effective: June 2026
            </p>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
            These terms govern your use of Swift Converter Hub. They're written
            in plain language — no legal jargon. If you have questions, reach
            out at{' '}
            <a
              href="mailto:support@swiftconverterhub.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              support@swiftconverterhub.com
            </a>
            .
          </p>
        </div>
      </div>

      {/* -- Sections ------------------------------------------------------ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {SECTIONS.map(({ id, icon: Icon, title, color, content }) => (
          <div
            key={id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"
          >
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
            © {year} Swift Converter Hub · All rights reserved
          </p>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold"
            >
              Privacy Policy
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
