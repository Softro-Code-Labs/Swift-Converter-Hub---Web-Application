import type { StudioId } from './tools';

/**
 * Per-studio accent classes. Written out in full so Tailwind can see every
 * class at build time. Each studio keeps one hue everywhere it appears, so
 * people learn "green = audio" without reading.
 */
export interface StudioAccent {
  /** Solid swatch (dots, active bars). */
  solid: string;
  /** Icon tile: tinted background + coloured glyph. */
  tile: string;
  /** Text colour for accent text and links. */
  text: string;
  /** Tinted surface for selected states. */
  soft: string;
  /** Hover border for cards. */
  hoverBorder: string;
  /** Focus/active ring. */
  ring: string;
}

export const STUDIO_ACCENT: Record<StudioId, StudioAccent> = {
  image: {
    solid: 'bg-blue-600 dark:bg-blue-400',
    tile: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
    text: 'text-blue-700 dark:text-blue-300',
    soft: 'bg-blue-50 dark:bg-blue-500/10',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-500/40',
    ring: 'ring-blue-600/30 dark:ring-blue-400/40',
  },
  audio: {
    solid: 'bg-emerald-600 dark:bg-emerald-400',
    tile: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    text: 'text-emerald-700 dark:text-emerald-300',
    soft: 'bg-emerald-50 dark:bg-emerald-500/10',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-500/40',
    ring: 'ring-emerald-600/30 dark:ring-emerald-400/40',
  },
  video: {
    solid: 'bg-fuchsia-600 dark:bg-fuchsia-400',
    tile: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
    text: 'text-fuchsia-700 dark:text-fuchsia-300',
    soft: 'bg-fuchsia-50 dark:bg-fuchsia-500/10',
    hoverBorder: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-500/40',
    ring: 'ring-fuchsia-600/30 dark:ring-fuchsia-400/40',
  },
  file: {
    solid: 'bg-rose-600 dark:bg-rose-400',
    tile: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    text: 'text-rose-700 dark:text-rose-300',
    soft: 'bg-rose-50 dark:bg-rose-500/10',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-500/40',
    ring: 'ring-rose-600/30 dark:ring-rose-400/40',
  },
  data: {
    solid: 'bg-amber-500 dark:bg-amber-400',
    tile: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    text: 'text-amber-700 dark:text-amber-300',
    soft: 'bg-amber-50 dark:bg-amber-500/10',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-500/40',
    ring: 'ring-amber-500/30 dark:ring-amber-400/40',
  },
  character: {
    solid: 'bg-cyan-600 dark:bg-cyan-400',
    tile: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300',
    text: 'text-cyan-700 dark:text-cyan-300',
    soft: 'bg-cyan-50 dark:bg-cyan-500/10',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-500/40',
    ring: 'ring-cyan-600/30 dark:ring-cyan-400/40',
  },
};
