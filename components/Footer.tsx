'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { useConsent } from '@/components/consent/ConsentContext';
import { BrandMark } from '@/components/Navbar';
import { POPULAR_TOOLS, STUDIOS } from '@/config/tools';
import { SITE_OPERATOR } from '@/config/site';

const COMPANY = [
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy policy', href: '/privacy' },
  { label: 'Terms of use', href: '/terms' },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold tracking-normal text-slate-900 dark:text-white">
        {title}
      </h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-slate-600 hover:text-slate-900 hover:underline underline-offset-4 dark:text-slate-400 dark:hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const { reset } = useConsent();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 max-w-sm md:col-span-1">
            <Link
              href="/"
              className="inline-block rounded-lg"
              aria-label="Swift Converter Hub home"
            >
              <BrandMark size="sm" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Free file tools that run entirely in your browser. Your files are
              processed on your own device and never uploaded.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[13px] font-medium text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
              No uploads, no accounts, no file limits
            </p>
          </div>

          <Column
            title="Studios"
            links={STUDIOS.map((s) => ({ label: s.name, href: s.href }))}
          />
          <Column
            title="Popular tools"
            links={POPULAR_TOOLS.slice(0, 7).map((t) => ({
              label: t.title,
              href: t.href,
            }))}
          />
          <Column title="Company" links={COMPANY} />
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 py-6 text-[13px] text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:text-slate-400">
          <p>
            © {year} Swift Converter Hub · A free product by{' '}
            <a
              href={SITE_OPERATOR.url}
              target="_blank"
              rel="noopener"
              className="underline-offset-4 hover:text-slate-900 hover:underline dark:hover:text-white"
            >
              {SITE_OPERATOR.name}
            </a>
          </p>
          <button
            type="button"
            onClick={reset}
            className="self-start underline underline-offset-4 hover:text-slate-900 sm:self-auto dark:hover:text-white"
          >
            Cookie preferences
          </button>
        </div>
      </div>
    </footer>
  );
}
