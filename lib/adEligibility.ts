import * as imagePairs from '@/features/image/convert/config/curatedPairs';
import * as audioPairs from '@/features/audio/convert/config/curatedPairs';
import * as videoPairs from '@/features/video/convert/config/curatedPairs';

/* ---------------------------------------------------------------------------
   Which pages may show ads.

   AdSense does not allow ads on auto-generated or templated pages, and it
   reviews pages whether or not they are noindex. Format-pair pages exist for
   every combination (about 6,000), but only the hand-written, curated pairs
   carry real content - so only those, and every other page, show ads.
--------------------------------------------------------------------------- */

const CURATED: Record<string, { HIGH_TRAFFIC_PAIRS: Set<string>; MEDIUM_TRAFFIC_PAIRS: Set<string> }> = {
  image: imagePairs,
  audio: audioPairs,
  video: videoPairs,
};

const PAIR_PAGE = /^\/(image|audio|video)\/convert\/([a-z0-9]+-to-[a-z0-9]+)\/?$/i;

/** False for templated format-pair pages; true for everything else. */
export function isAdEligiblePath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const match = pathname.match(PAIR_PAGE);
  if (!match) return true;
  const sets = CURATED[match[1].toLowerCase()];
  const pair = match[2].toLowerCase();
  return sets.HIGH_TRAFFIC_PAIRS.has(pair) || sets.MEDIUM_TRAFFIC_PAIRS.has(pair);
}
