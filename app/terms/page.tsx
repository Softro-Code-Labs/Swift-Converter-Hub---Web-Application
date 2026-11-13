import { Metadata } from 'next';
import { LegalLayout } from '@/components/site/LegalLayout';
import {
  FileCheck,
  Cpu,
  UserCheck,
  Copyright,
  AlertTriangle,
  Scale,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { SITE_OPERATOR } from '@/config/site';

export const metadata: Metadata = pageMetadata({
  path: '/terms',
  title: 'Terms of Service',
  description:
    "The plain-language terms for using Swift Converter Hub's free, in-browser file conversion tools.",
  keywords: [
    'swift converter hub terms of service',
    'swift converter hub terms and conditions',
    'free online file tools user agreement',
    'browser utility usage guidelines',
    'client side tool liability policy',
    'webassembly application terms of use',
    'file converter acceptable use policy',
    'online tool disclaimer',
    'free tool terms and conditions',
    'converter software license terms',
  ],
});

const SECTIONS = [
  {
    id: '1',
    icon: FileCheck,
    title: 'Acceptance of terms',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    content: (
      <p>
        Swift Converter Hub is owned and operated by {SITE_OPERATOR.name}
        (&quot;we&quot;, &quot;us&quot;). By using Swift Converter Hub you
        agree to these terms. If you don&apos;t agree, please stop using the
        service. These terms apply to all tools and pages on
        swiftconverterhub.com.
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
        professional audio/video and image processing engines) which are
        governed by their respective licenses.
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
          The service is provided &quot;as is&quot; without any warranty of any
          kind. We do not guarantee that:
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
        We may update these terms from time to time. We&apos;ll update the date
        at the top of this page when we do. Continued use of the service after
        changes means you accept the updated terms.
      </p>
    ),
  },
  {
    id: '8',
    icon: Landmark,
    title: 'Governing law',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    content: (
      <p>
        These terms are governed by the laws of {SITE_OPERATOR.country}, where{' '}
        {SITE_OPERATOR.name} is based. Nothing in these terms takes away any
        consumer rights you have under the laws of the country where you live.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      meta="Version 1.1, effective November 2026"
      lead={
        <>
          These terms govern your use of Swift Converter Hub, in plain language.
          Questions? Email{' '}
          <a
            href="mailto:support@swiftconverterhub.com"
            className="font-medium text-slate-900 underline underline-offset-4 dark:text-white"
          >
            support@swiftconverterhub.com
          </a>
          .
        </>
      }
      sections={SECTIONS.map(({ id, title, content }) => ({
        id,
        title,
        content,
      }))}
      related={{ label: 'Privacy Policy', href: '/privacy' }}
    />
  );
}
