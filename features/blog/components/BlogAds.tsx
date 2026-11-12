import { ADSENSE } from '@/lib/adsense';
import { InArticleAd, ResponsiveAd } from '@/components/ads/AdUnit';

/* ---------------------------------------------------------------------------
   The two blog ad slots. ArticleLayout places them, so every post gets them
   in the same safe positions:

   - MidArticleAd: between two sections, only after plain text - never next
     to a diagram, tool card or other interactive element (AdSense forbids
     placements that invite accidental clicks).
   - EndOfArticleAd: after the article body, before the FAQ. End each post
     with a paragraph (not a tool card or diagram) so the ad follows text.
--------------------------------------------------------------------------- */

export function MidArticleAd({ path }: { path: string }) {
  if (!ADSENSE.ADS_ENABLED) return null;
  return (
    <InArticleAd
      slot={ADSENSE.SLOTS.BLOG_IN_ARTICLE}
      instanceKey={path}
      className="my-10"
    />
  );
}

export function EndOfArticleAd({ path }: { path: string }) {
  if (!ADSENSE.ADS_ENABLED) return null;
  return (
    <ResponsiveAd
      slot={ADSENSE.SLOTS.BLOG_END}
      media="all"
      instanceKey={path}
      className="mt-14"
    />
  );
}
