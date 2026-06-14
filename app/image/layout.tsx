'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CLIENT_ENV } from '@/config/env.client';

export default function ImageSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const adsbygoogle =
          // @ts-ignore
          window.adsbygoogle || [];
        const unfilled = document.querySelectorAll(
          '.adsbygoogle:not([data-ad-status])',
        );
        unfilled.forEach(() => adsbygoogle.push({}));
      } catch (err) {
        console.warn('AdSense push paused:', err);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  const pub = CLIENT_ENV.ADSENSE_PUBLISHER_ID;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* ── TOP LEADERBOARD ───────────────────────────────────────────────
          Mobile: hidden (too small, bad UX)
          Tablet+: 728×90 leaderboard
          Desktop: 970×90 super leaderboard
          Placement rationale: users see it immediately on load, high CPM,
          doesn't block the tool since it's above the fold but not inline.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center min-h-[106px]">
          <div className="flex flex-col items-center gap-1 w-full max-w-[970px]">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-300 dark:text-slate-700 select-none">
              Advertisement
            </span>
            <div className="w-full rounded-xl overflow-hidden bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-center min-h-[90px]">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '90px' }}
                data-ad-client={pub}
                data-ad-slot={CLIENT_ENV.ADSENSE_TOP_SLOT_ID}
                data-ad-format="horizontal"
                data-full-width-responsive="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT GRID ──────────────────────────────────────────────
          Mobile:  1 col — full width content, no sidebars
          Tablet:  1 col — full width content, no sidebars (tool needs space)
          Desktop: 3 col — [sidebar | content | sidebar]
          1640px: wider sidebars for bigger ad units
      ─────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[260px_1fr_260px] 2xl:grid-cols-[300px_1fr_300px] gap-6 items-start">
          {/* ── LEFT SIDEBAR ─────────────────────────────────────────────
              Only visible on lg+. Sticky so it follows as user scrolls.
              160×600 half-page on smaller desktop, 300×600 on xl+.
          ──────────────────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-6">
            <AdSidebarSlot
              slotId={CLIENT_ENV.ADSENSE_LEFT_SLOT_ID}
              pub={pub}
              side="left"
            />
          </aside>

          {/* ── CONTENT COLUMN ───────────────────────────────────────────
              The tool always gets the full middle column.
              One in-content ad appears below the fold (after the tool UI)
              on mobile/tablet where sidebars are hidden.
          ──────────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 min-w-0 w-full">
            {/* Mobile-only top banner — replaces leaderboard that's hidden */}
            <div className="sm:hidden w-full">
              <MobileAdBanner
                slotId={CLIENT_ENV.ADSENSE_TOP_SLOT_ID}
                pub={pub}
              />
            </div>

            {/* The actual page content */}
            <main className="w-full min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden">
              {children}
            </main>

            {/* In-content rectangle — shown on mobile/tablet only.
                Sits below the tool so it never blocks the user's workflow.
                Hidden on lg+ because sidebars handle monetisation there. */}
            <div className="lg:hidden">
              <AdRectangle
                slotId={CLIENT_ENV.ADSENSE_BOTTOM_SLOT_ID}
                pub={pub}
                label="Sponsored"
              />
            </div>

            {/* Bottom anchor — always shown on all breakpoints.
                300×250 rectangle on mobile, 728×90 on tablet+.
                Users see this after completing a conversion — high intent. */}
            <AdBottomAnchor
              slotId={CLIENT_ENV.ADSENSE_BOTTOM_SLOT_ID}
              pub={pub}
            />
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────────
              Mirror of left sidebar. Sticky scroll.
          ──────────────────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-6">
            <AdSidebarSlot
              slotId={CLIENT_ENV.ADSENSE_RIGHT_SLOT_ID}
              pub={pub}
              side="right"
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Ad Sub-components ────────────────────────────────────────────────────────

function AdLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-300 dark:text-slate-700 select-none text-center mb-1">
      {children}
    </p>
  );
}

function AdSidebarSlot({
  slotId,
  pub,
  side,
}: {
  slotId: string | undefined;
  pub: string | undefined;
  side: 'left' | 'right';
}) {
  return (
    <div className="flex flex-col">
      <AdLabel>Advertisement</AdLabel>
      {/* First slot: 160×600 on lg, 300×600 on xl+ */}
      <div className="w-full mb-4 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[600px]">
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: '100%',
            height: '600px',
          }}
          data-ad-client={pub}
          data-ad-slot={slotId}
          data-ad-format="vertical"
          data-full-width-responsive="false"
        />
      </div>

      <AdLabel>Sponsored</AdLabel>
      {/* Second slot below — fills extra vertical space on tall screens */}
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[280px] xl:min-h-[300px]">
        <ins
          className="adsbygoogle"
          style={{
            display: 'inline-block',
            width: '100%',
            height: '280px',
          }}
          data-ad-client={pub}
          data-ad-slot={slotId}
          data-ad-format="rectangle"
          data-full-width-responsive="false"
        />
      </div>
    </div>
  );
}

function MobileAdBanner({
  slotId,
  pub,
}: {
  slotId: string | undefined;
  pub: string | undefined;
}) {
  return (
    <div className="w-full">
      <AdLabel>Advertisement</AdLabel>
      <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[60px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '60px' }}
          data-ad-client={pub}
          data-ad-slot={slotId}
          data-ad-format="banner"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

function AdRectangle({
  slotId,
  pub,
  label,
}: {
  slotId: string | undefined;
  pub: string | undefined;
  label: string;
}) {
  return (
    <div className="w-full">
      <AdLabel>{label}</AdLabel>
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[250px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={pub}
          data-ad-slot={slotId}
          data-ad-format="rectangle"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}

function AdBottomAnchor({
  slotId,
  pub,
}: {
  slotId: string | undefined;
  pub: string | undefined;
}) {
  return (
    <div className="w-full">
      <AdLabel>Sponsored content</AdLabel>
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[100px] sm:min-h-[100px]">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={pub}
          data-ad-slot={slotId}
          data-ad-format="autorelax"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
