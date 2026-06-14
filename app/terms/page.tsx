import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | Swift Converter Hub',
  description:
    'Review the Terms of Service for Swift Converter Hub. Learn about our free web utility guidelines, serverless usage policies, and liability limitations.',
};

export default function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-8 text-center sm:text-left dark:border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium dark:text-slate-500">
            Effective Date: June 2026 • Welcome to Our Laboratory Agreement
          </p>
        </div>

        {/* Terms Content */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {/* Section 1: Acceptance */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the web utilities provided by{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                Swift Converter Hub
              </strong>{' '}
              (&quot;the Service&quot;), you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service. If
              you do not agree to these terms, you must immediately cease using
              our application tools.
            </p>
          </section>

          {/* Section 2: Description of Service */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              2. Description of Service & Technology
            </h2>
            <p>
              Swift Converter Hub grants users access to a suite of web-based
              file format modification and compression tools. Our services
              utilize modern client-side processing to execute conversions
              directly inside your own web browser.
            </p>
            <p>
              Because file processing happens entirely on your own device, we do
              not monitor, store, intercept, or assume ownership over any media
              assets you introduce to the interface.
            </p>
          </section>

          {/* Section 3: Permitted Use */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              3. Acceptable Use Guidelines
            </h2>
            <p>
              You retain total, absolute ownership and legal responsibility over
              all images and documentation you process using our workspace. You
              agree that you will not use the Service to process any files that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 dark:text-slate-450">
              <li>
                Infringe upon any third-party intellectual property, copyrights,
                or trademarks.
              </li>
              <li>
                Contain malicious code, computer viruses, trojans, or corrupted
                data layers.
              </li>
              <li>
                Violate any local, national, or international data-privacy laws.
              </li>
            </ul>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              4. Intellectual Property of the Lab
            </h2>
            <p>
              While you own the files you process, all rights, titles, and
              interests in the website code layout, design components, branding
              elements, and functional application logic belong strictly to
              Swift Converter Hub. You agree not to scrape, mirror, or copy our
              core client-side code packages for commercial redistribution.
            </p>
          </section>

          {/* Section 5: Disclaimer of Warranties */}
          <section className="bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-md dark:bg-slate-900/40 dark:border-blue-950/40">
            <h2 className="text-base font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
              5. Disclaimer of Warranties (&quot;AS IS&quot;)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400">
              THE WORKSPACE, TOOLS, AND SCRIPTS ARE PROVIDED ON AN &quot;AS
              IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF
              ANY KIND, EITHER EXPRESS OR IMPLIED. SWIFT CONVERTER HUB DISCLAIMS
              ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
              NON-INFRINGEMENT.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400">
              WE DO NOT GUARANTEE THAT THE FILE CONVERSION LOGIC WILL BE 100%
              ERROR-FREE, OR THAT CORRUPTED SOURCE FILES WILL NOT CAUSE
              UNEXPECTED CRASHES OR FAULTS INSIDE YOUR WEB BROWSER.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              6. Limitation of Liability
            </h2>
            <p>
              In no event shall Swift Converter Hub, its developers, or its team
              be held liable for any direct, indirect, incidental, or
              consequential damages resulting from data loss, corrupted file
              exports, application downtime, or browser crashing events stemming
              from your use of our local toolsets. Your reliance on our free web
              tools is completely at your own risk.
            </p>
          </section>

          {/* Section 7: Amendments */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              7. Changes to the Laboratory Terms
            </h2>
            <p>
              We reserve the absolute right to edit, modify, or update these
              terms at any time to align with new client-side software updates
              or legal regulations. Continued usage of our system toolsets
              following an update constitutes total legal acceptance of the
              revised terms framework.
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p>
            © {currentYear} Swift Converter Hub. All legal disclaimers active.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Return to Tools Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
