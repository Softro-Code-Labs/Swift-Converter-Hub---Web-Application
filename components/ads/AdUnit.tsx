'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { ADSENSE } from '@/lib/adsense';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------------------
   AdSense units, implemented the way Google documents them:

   - Fixed-size units use Google's fixed-size code: <ins> with an explicit
     width/height in style and no data-ad-format. Sizes are standard IAB
     sizes (160x600, 300x600, 728x90, 468x60, 320x100, 320x50) so the full
     demand pool can fill them.
   - A unit is only rendered when its media query matches. Ad slots are never
     hidden with CSS (display:none / zero width), which AdSense does not
     allow for fixed-size units and which produced "availableWidth=0" errors.
   - Each unit calls adsbygoogle.push({}) exactly once, when it mounts. When
     the page (or breakpoint) changes, a fresh <ins> is mounted - the
     supported way to request ads in a single-page app.
   - The box reserves the ad's exact size up front, so nothing shifts when
     the ad loads (no layout shift / CLS).
--------------------------------------------------------------------------- */

type Size = readonly [width: number, height: number];

/** A size to use when a media query matches. First match wins. */
export interface SizeRule {
  media: string;
  size: Size;
}

function useMatchingRule(rules: SizeRule[]): SizeRule | null {
  const key = rules.map((r) => r.media).join('|');
  const index = useSyncExternalStore(
    (onChange) => {
      const lists = rules.map((r) => window.matchMedia(r.media));
      lists.forEach((l) => l.addEventListener('change', onChange));
      return () =>
        lists.forEach((l) => l.removeEventListener('change', onChange));
    },
    () => rules.findIndex((r) => window.matchMedia(r.media).matches),
    () => -1, // server render: no ad until the client knows the viewport
  );
  // `key` keeps the subscription stable while rules are equal by value.
  void key;
  return index >= 0 ? rules[index] : null;
}

function PushOnMount({ id }: { id: string }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle =
        window.adsbygoogle ||
        ([] as unknown as NonNullable<Window['adsbygoogle']>)).push({});
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AdSense] push failed for', id, err);
      }
    }
  }, [id]);
  return null;
}

function Frame({
  width,
  height,
  className,
  children,
}: {
  width?: number;
  height: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      aria-label="Advertisement"
      className={cn('ad-frame flex flex-col items-center', className)}
    >
      <p className="mb-1 select-none text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
        Advertisement
      </p>
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg bg-slate-100/70 dark:bg-slate-800/40"
        style={{ width: width ?? '100%', minHeight: height }}
      >
        {children}
      </div>
    </aside>
  );
}

/** Fixed-size ad that picks a standard size per breakpoint. */
export function FixedAd({
  slot,
  rules,
  instanceKey,
  className,
}: {
  slot: string;
  rules: SizeRule[];
  /** Change this (e.g. the pathname) to request a new ad. */
  instanceKey: string;
  className?: string;
}) {
  const rule = useMatchingRule(rules);
  if (!ADSENSE.ADS_ENABLED || !rule) return null;
  const [width, height] = rule.size;
  const id = `${slot}-${width}x${height}-${instanceKey}`;
  return (
    <Frame width={width} height={height} className={className}>
      <ins
        key={id}
        className="adsbygoogle"
        style={{ display: 'inline-block', width, height }}
        data-ad-client={ADSENSE.PUBLISHER_ID}
        data-ad-slot={slot}
      />
      <PushOnMount key={`push-${id}`} id={id} />
    </Frame>
  );
}

/** Google's standard responsive display unit (fills its container width). */
export function ResponsiveAd({
  slot,
  media,
  instanceKey,
  minHeight = 250,
  className,
}: {
  slot: string;
  /** Only render when this media query matches. */
  media: string;
  instanceKey: string;
  minHeight?: number;
  className?: string;
}) {
  const rule = useMatchingRule([{ media, size: [0, minHeight] }]);
  // Responsive ads are sized once, when they load. Re-request when the width
  // crosses a band (e.g. a tablet is rotated) so a wide ad is never left
  // clipped inside a narrower space.
  const band = useMatchingRule(WIDTH_BANDS);
  if (!ADSENSE.ADS_ENABLED || !rule) return null;
  const id = `${slot}-responsive-${band?.size[0] ?? 0}-${instanceKey}`;
  return (
    <Frame height={minHeight} className={cn('w-full', className)}>
      <ins
        key={id}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE.PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <PushOnMount key={`push-${id}`} id={id} />
    </Frame>
  );
}

// --- Standard placements ------------------------------------------------------

/** Width bands for re-requesting responsive units (size[0] = band id). */
const WIDTH_BANDS: SizeRule[] = [
  { media: '(min-width: 1280px)', size: [4, 0] },
  { media: '(min-width: 1024px)', size: [3, 0] },
  { media: '(min-width: 768px)', size: [2, 0] },
  { media: '(min-width: 520px)', size: [1, 0] },
  { media: 'all', size: [0, 0] },
];

/** Breakpoints match the layout: sidebars from 1024px, wide sidebars from 1536px. */
export const SIDEBAR_RULES: SizeRule[] = [
  { media: '(min-width: 1536px)', size: [300, 600] }, // half page
  { media: '(min-width: 1024px)', size: [160, 600] }, // wide skyscraper
];

export const TOP_BANNER_RULES: SizeRule[] = [
  { media: '(min-width: 768px) and (max-width: 1023.98px)', size: [728, 90] }, // leaderboard
  { media: '(min-width: 520px) and (max-width: 767.98px)', size: [468, 60] }, // banner
  // 320 wide + page gutters needs a 352px screen; smaller phones get no top ad
  // rather than one that overflows.
  { media: '(min-width: 352px) and (max-width: 519.98px)', size: [320, 100] }, // large mobile banner
];

export const BELOW_SIDEBARS = '(max-width: 1023.98px)';
