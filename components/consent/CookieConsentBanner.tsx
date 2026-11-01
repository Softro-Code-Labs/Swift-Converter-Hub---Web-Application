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
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:flex-row sm:items-center dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">
            Allow analytics?
          </span>{' '}
          An optional Microsoft Clarity cookie helps us see how the tools are
          used. Your files stay on your device either way. Ad consent is handled
          separately by Google where required.{' '}
          <Link
            href="/privacy"
            className="font-medium text-slate-900 underline underline-offset-4 dark:text-white"
          >
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={decline}
            className="h-10 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 sm:flex-none dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="h-10 flex-1 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-none dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
