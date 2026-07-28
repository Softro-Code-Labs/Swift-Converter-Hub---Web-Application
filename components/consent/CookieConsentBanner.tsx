'use client';

import Link from 'next/link';
import { useConsent } from './ConsentContext';

export default function CookieConsentBanner() {
  const { consent, isLoaded, accept, decline } = useConsent();

  // Hidden until consent state is read from storage, and after any choice is made.
  if (!isLoaded || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="max-w-3xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/40 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          We use cookies for ads (Google AdSense) and analytics (Microsoft
          Clarity) to keep the tools free and to improve them. Your files never
          leave your browser either way - that part doesn&apos;t depend on this
          choice. See our{' '}
          <Link
            href="/privacy"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={decline}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
