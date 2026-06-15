'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE } from '@/lib/adsense';
import { SERVER_ENV } from '@/config/env.server';

// ─── Ad slot components ───────────────────────────────────────────────────────

function AdLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-300 dark:text-slate-700 select-none text-center mb-1">
      {children}
    </p>
  );
}

function AdSlot({
  slot,
  format,
  style,
  responsive = true,
}: {
  slot: string;
  format: string;
  style: React.CSSProperties;
  responsive?: boolean;
}) {
  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={ADSENSE.PUBLISHER_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  );
}

function TopLeaderboard() {
  return (
    <div className="hidden sm:block w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-center min-h-[106px]">
        <div className="flex flex-col items-center gap-1 w-full max-w-[970px]">
          <AdLabel>Advertisement</AdLabel>
          <div className="w-full rounded-xl overflow-hidden bg-slate-100/50 dark:bg-slate-800/30 flex items-center justify-center min-h-[90px]">
            <AdSlot
              slot={ADSENSE.SLOTS.TOP}
              format="horizontal"
              style={{ display: 'block', width: '100%', height: '90px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileBanner() {
  return (
    <div className="sm:hidden">
      <AdLabel>Advertisement</AdLabel>
      <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[60px]">
        <AdSlot
          slot={ADSENSE.SLOTS.TOP}
          format="banner"
          style={{ display: 'block', width: '100%', height: '60px' }}
        />
      </div>
    </div>
  );
}

function Sidebar({ slot }: { slot: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <AdLabel>Advertisement</AdLabel>
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[600px]">
          <AdSlot
            slot={slot}
            format="vertical"
            style={{ display: 'inline-block', width: '100%', height: '600px' }}
            responsive={false}
          />
        </div>
      </div>
      <div>
        <AdLabel>Sponsored</AdLabel>
        <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[280px]">
          <AdSlot
            slot={slot}
            format="rectangle"
            style={{ display: 'inline-block', width: '100%', height: '280px' }}
            responsive={false}
          />
        </div>
      </div>
    </div>
  );
}

function InContentRectangle() {
  return (
    <div className="lg:hidden">
      <AdLabel>Sponsored</AdLabel>
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[250px]">
        <AdSlot
          slot={ADSENSE.SLOTS.BOTTOM}
          format="rectangle"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </div>
  );
}

function BottomAnchor() {
  return (
    <div>
      <AdLabel>Sponsored content</AdLabel>
      <div className="w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[100px]">
        <AdSlot
          slot={ADSENSE.SLOTS.BOTTOM}
          format="autorelax"
          style={{ display: 'block', width: '100%' }}
        />
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function ImageSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        // @ts-ignore
        if (typeof window === 'undefined' || !window.adsbygoogle) return;

        const unfilled = document.querySelectorAll(
          '.adsbygoogle:not([data-ad-status])',
        );
        if (unfilled.length === 0) return;

        // @ts-ignore
        unfilled.forEach(() => window.adsbygoogle.push({}));
      } catch (err) {
        if (SERVER_ENV.NODE_ENV === 'development') {
          console.warn('[AdSense] Push failed:', err);
        }
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <TopLeaderboard />

      <div className="max-w-[1640px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[260px_1fr_260px] 2xl:grid-cols-[300px_1fr_300px] gap-6 items-start">
          <aside
            className="hidden lg:flex flex-col gap-4 sticky top-6"
            aria-label="Advertisement"
          >
            <Sidebar slot={ADSENSE.SLOTS.LEFT} />
          </aside>

          <div className="flex flex-col gap-6 min-w-0 w-full">
            <MobileBanner />
            <main className="w-full min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden">
              {children}
            </main>
            <InContentRectangle />
            <BottomAnchor />
          </div>

          <aside
            className="hidden lg:flex flex-col gap-4 sticky top-6"
            aria-label="Advertisement"
          >
            <Sidebar slot={ADSENSE.SLOTS.RIGHT} />
          </aside>
        </div>
      </div>
    </div>
  );
}
