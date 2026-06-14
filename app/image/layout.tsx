'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CLIENT_ENV } from '@/config/env.client';

export default function ImageSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pub = CLIENT_ENV.ADSENSE_PUBLISHER_ID;

  useEffect(() => {
    const adsenseId = CLIENT_ENV.ADSENSE_PUBLISHER_ID;
    const isValidId =
      typeof adsenseId === 'string' && adsenseId.startsWith('ca-pub-');

    if (!isValidId) return;

    // Clear any previous timer to avoid double-push on fast navigation
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        // @ts-ignore
        if (typeof window === 'undefined' || !window.adsbygoogle) return;

        // Only push slots that haven't been filled yet
        const unfilledSlots = document.querySelectorAll<HTMLElement>(
          '.adsbygoogle:not([data-ad-status])',
        );

        if (unfilledSlots.length === 0) return;

        // @ts-ignore
        const adsbygoogle = window.adsbygoogle;
        unfilledSlots.forEach(() => {
          try {
            adsbygoogle.push({});
          } catch (slotErr) {
            // Individual slot push can fail if already filled — safe to ignore
          }
        });
      } catch (err) {
        // Script not loaded yet or blocked by ad blocker — silent fail
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AdSense] Push failed:', err);
        }
      }
    }, 300); // 300ms gives the DOM time to settle after navigation

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* ── TOP LEADERBOARD ───────────────────────────────────────────────
          Hidden on mobile — too narrow, kills UX and earns near-zero CPM.
          728×90 on tablet, 970×90 on desktop.
      ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center min-h-[106px]">
          <div className="flex flex-col items-center gap-1 w-full max-w-[970px]">
            <AdLabel>Advertisement</AdLabel>
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

      {/* ── MAIN LAYOUT GRID ─────────────────────────────────────────────
          Mobile/Tablet: single column, tool takes full width
          Desktop lg: [180px sidebar | content | 180px sidebar]
          Desktop xl: [260px sidebar | content | 260px sidebar]
          Desktop 2xl: [300px sidebar | content | 300px sidebar]
      ─────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[260px_1fr_260px] 2xl:grid-cols-[300px_1fr_300px] gap-6 items-start">
          {/* Left sidebar — desktop only */}
          <aside
            className="hidden lg:flex flex-col gap-4 sticky top-6"
            aria-label="Advertisement"
          >
            <AdSidebarSlot slotId={CLIENT_ENV.ADSENSE_LEFT_SLOT_ID} pub={pub} />
          </aside>

          {/* Content column */}
          <div className="flex flex-col gap-6 min-w-0 w-full">
            {/* Mobile banner — replaces hidden leaderboard */}
            <div className="sm:hidden w-full">
              <MobileAdBanner
                slotId={CLIENT_ENV.ADSENSE_TOP_SLOT_ID}
                pub={pub}
              />
            </div>

            {/* Page content */}
            <main className="w-full min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden">
              {children}
            </main>

            {/* In-content rectangle — mobile/tablet only, below the tool */}
            <div className="lg:hidden">
              <AdRectangle
                slotId={CLIENT_ENV.ADSENSE_BOTTOM_SLOT_ID}
                pub={pub}
                label="Sponsored"
              />
            </div>

            {/* Bottom anchor — all breakpoints, shown after conversion completes */}
            <AdBottomAnchor
              slotId={CLIENT_ENV.ADSENSE_BOTTOM_SLOT_ID}
              pub={pub}
            />
          </div>

          {/* Right sidebar — desktop only */}
          <aside
            className="hidden lg:flex flex-col gap-4 sticky top-6"
            aria-label="Advertisement"
          >
            <AdSidebarSlot
              slotId={CLIENT_ENV.ADSENSE_RIGHT_SLOT_ID}
              pub={pub}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── Ad sub-components ────────────────────────────────────────────────────────

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
}: {
  slotId: string | undefined;
  pub: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <AdLabel>Advertisement</AdLabel>
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[600px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '100%', height: '600px' }}
            data-ad-client={pub}
            data-ad-slot={slotId}
            data-ad-format="vertical"
            data-full-width-responsive="false"
          />
        </div>
      </div>
      <div>
        <AdLabel>Sponsored</AdLabel>
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[280px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '100%', height: '280px' }}
            data-ad-client={pub}
            data-ad-slot={slotId}
            data-ad-format="rectangle"
            data-full-width-responsive="false"
          />
        </div>
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
    <div>
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
    <div>
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
    <div>
      <AdLabel>Sponsored content</AdLabel>
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[100px]">
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
