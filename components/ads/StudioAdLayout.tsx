'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE } from '@/lib/adsense';
import { studioForPath, toolForPath } from '@/config/tools';
import { RelatedTools, StudioToolRail } from '@/components/shell/StudioNav';
import { rememberTool } from '@/components/shell/CommandMenu';
import {
  BELOW_SIDEBARS,
  FixedAd,
  ResponsiveAd,
  SIDEBAR_RULES,
  TOP_BANNER_RULES,
} from './AdUnit';

/* ---------------------------------------------------------------------------
   Studio frame. Wraps every page inside a studio:

   - Studio hub (/image, /audio, ...): rendered full-width; the hub page owns
     its layout.
   - Tool pages: sticky tool rail -> tool workspace card -> related tools.
     When ads are enabled: fixed-size sidebar ads either side of the tool
     from 1024px, a standard banner above it and a responsive unit below it
     on smaller screens. See components/ads/AdUnit.tsx for how units load.
--------------------------------------------------------------------------- */

// --- Layout -------------------------------------------------------------------

export interface StudioAdLayoutProps {
  children: React.ReactNode;
  /** Override individual ad slot IDs. Defaults to ADSENSE.SLOTS for all. */
  slots?: Partial<typeof ADSENSE.SLOTS>;
}

export default function StudioAdLayout({
  children,
  slots,
}: StudioAdLayoutProps) {
  const pathname = usePathname();
  const resolvedSlots = { ...ADSENSE.SLOTS, ...slots };

  const studio = studioForPath(pathname);
  const tool = toolForPath(pathname);
  const isHub = !!studio && pathname === studio.href;

  // Remember tools for "Recently used" in search.
  useEffect(() => {
    if (tool) rememberTool(tool.id);
  }, [tool]);

  // Hub pages own their full-width layout.
  if (isHub) {
    return (
      <main className="flex-1">
        {children}
        {ADSENSE.ADS_ENABLED && (
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <ResponsiveAd
              slot={resolvedSlots.BOTTOM}
              media="all"
              instanceKey={pathname}
            />
          </div>
        )}
      </main>
    );
  }

  const workspace = (
    <div
      key={pathname}
      className="w-full min-w-0 animate-rise-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.04)] dark:border-slate-800 dark:bg-slate-900"
    >
      {children}
    </div>
  );

  return (
    <div className="flex-1">
      {studio && <StudioToolRail studio={studio} current={tool} />}

      {!ADSENSE.ADS_ENABLED ? (
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {workspace}
          {studio && <RelatedTools studio={studio} current={tool} />}
        </main>
      ) : (
        <div className="mx-auto max-w-[1640px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Below 1024px: one standard banner above the tool. */}
          <FixedAd
            slot={resolvedSlots.TOP}
            rules={TOP_BANNER_RULES}
            instanceKey={pathname}
            className="mb-6"
          />
          {/* Ad columns have a fixed width equal to the ad (160px, or 300px
              from 1536px), so they never shrink - the tool column flexes. */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[160px_minmax(0,1fr)_160px] 2xl:grid-cols-[300px_minmax(0,1fr)_300px]">
            <div className="sticky top-[calc(var(--header-h)+4rem)] hidden lg:block">
              <FixedAd
                slot={resolvedSlots.LEFT}
                rules={SIDEBAR_RULES}
                instanceKey={pathname}
              />
            </div>
            <main className="flex min-w-0 w-full flex-col gap-6">
              {workspace}
              <ResponsiveAd
                slot={resolvedSlots.BOTTOM}
                media={BELOW_SIDEBARS}
                instanceKey={pathname}
              />
              {studio && <RelatedTools studio={studio} current={tool} />}
            </main>
            <div className="sticky top-[calc(var(--header-h)+4rem)] hidden lg:block">
              <FixedAd
                slot={resolvedSlots.RIGHT}
                rules={SIDEBAR_RULES}
                instanceKey={pathname}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
