import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | 100% Local File Security Guarantee',
  description:
    'Read the Swift Converter Hub Privacy Policy. Learn how our client-side architecture guarantees your images and documents never touch a remote server.',
};

export default function PrivacyPage() {
  const lastUpdated = 'June 2026';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-8 text-center sm:text-left dark:border-slate-800">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium dark:text-slate-500">
            Last Updated: {lastUpdated} • Version 1.1 (Zero-Upload Guarantee)
          </p>
        </div>

        {/* Legal Text Stream */}
        <div className="mt-10 space-y-10 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {/* Section 1: The Core Zero-Knowledge Promise */}
          <section className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 dark:bg-blue-950/20 dark:border-blue-900/50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 dark:text-slate-100">
              <span>🛡️</span> Our Core Philosophy: Zero Remote Storage
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              At Swift Converter Hub, we treat your privacy as an absolute
              right. Unlike standard online converters that transmit your files
              to cloud infrastructure for rendering, our platform operates on a{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                Zero-Knowledge client-side architecture
              </strong>
              .
            </p>
            <p className="mt-2 font-semibold text-blue-800 dark:text-blue-400">
              Your files, images, and documents are never uploaded to our
              servers, because we do not use or maintain file-processing
              servers.
            </p>
          </section>

          {/* Section 2: How Data is Processed */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              1. How Your Data is Processed
            </h2>
            <p>
              When you drop a file into our web interface, the file is loaded
              directly into your local browser window using secure, modern
              browser technologies (JavaScript and WebAssembly).
            </p>
            <p>
              The actual file conversion happens entirely within your
              device&apos;s own memory. As soon as the conversion finishes, or
              when you close the browser tab or reload the application, any
              temporary cache created by the browser is instantly discarded and
              permanently destroyed.
            </p>
          </section>

          {/* Section 3: Data We DO NOT Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              2. Information We Do Not Collect
            </h2>
            <p>
              Because all transformations execute strictly inside your local web
              environment, we have zero technical capacity to view, log,
              collect, or store any of your content. This means we never see:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-500 dark:text-slate-450">
              <li>
                The actual text, content, or layout arrangements of your
                documents.
              </li>
              <li>
                The pixels, photos, embedded location tags, or original names of
                your files.
              </li>
              <li>
                Any personal identification profiles or digital signatures.
              </li>
            </ul>
          </section>

          {/* Section 4: Analytics and Advertising (Google AdSense Compliance) */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              3. Analytics & Third-Party Advertising
            </h2>
            <p>
              To keep our conversion studios completely free to use around the
              world, we display automated advertisements through network
              providers like Google AdSense, and measure basic usage trends
              using privacy-focused analytics.
            </p>
            <p>
              These third-party tools may use basic browser cookies to display
              ads relevant to your generic web interests. These scripts monitor
              abstract metrics-like view counts, button selections, or error
              reports-but{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                can never access or intercept
              </strong>{' '}
              your local file conversion streams. You can use any standard
              browser ad-blocker without limiting the features of our conversion
              tools.
            </p>
          </section>

          {/* Section 5: Regulatory Compliance */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              4. Global Regulatory Compliance
            </h2>
            <p>
              Our code infrastructure is built to natively honor global data
              standard rights including the European Union General Data
              Protection Regulation (
              <strong className="text-slate-900 dark:text-slate-200">
                GDPR
              </strong>
              ) and the California Consumer Privacy Act (
              <strong className="text-slate-900 dark:text-slate-200">
                CCPA
              </strong>
              ).
            </p>
            <p>
              Because your personal file data is never sent to our systems, we
              never hold, store, control, or transfer your assets to third
              parties. There is no personal database to be breached, sold, or
              requested for removal.
            </p>
          </section>

          {/* Section 6: Contact Information */}
          <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              5. Contact Support
            </h2>
            <p>
              If you have any questions regarding our client-side processing
              mechanics or how memory management is handled on your machine,
              feel free to reach out to our team at:
            </p>
            <p className="font-mono bg-slate-100 px-3 py-1.5 rounded-xl inline-block text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              privacy@swiftconverterhub.com
            </p>
          </section>
        </div>

        {/* Post-Read Navigation Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Return to Workspace Home
          </Link>
        </div>
      </div>
    </main>
  );
}
