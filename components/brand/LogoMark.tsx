import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------------------
   The Swift Converter Hub mark: six blades - one per studio colour (image,
   audio, video, documents, data, text) - turning around a single hub.

   Drawn inline so it is crisp at any size and switches to brighter blade
   colours in dark mode. Below 20px the blades get a heavier stroke and a
   shorter inner reach so they stay separate instead of blurring together.
   Source artwork: public/logo.svg (light) and app/icon.svg (favicon).
--------------------------------------------------------------------------- */

const BLADES = [
  // [path, light colour class, dark colour class]
  [
    'M21.1 16L22.1 13.8L23.9 12L26.1 10.6L28.8 9.7L31.9 9.4L35.1 9.8',
    'stroke-[#2F7BF5] dark:stroke-[#5B9BFF]',
  ],
  [
    'M29.5 17.5L31.9 17.3L34.4 17.9L36.7 19.1L38.8 21L40.6 23.5L41.8 26.5',
    'stroke-[#10B981] dark:stroke-[#34D399]',
  ],
  [
    'M32.4 25.5L33.8 27.5L34.5 29.9L34.6 32.6L34 35.3L32.7 38.1L30.7 40.7',
    'stroke-[#D946EF] dark:stroke-[#E879F9]',
  ],
  [
    'M26.9 32L25.9 34.2L24.1 36L21.9 37.4L19.2 38.3L16.1 38.6L12.9 38.2',
    'stroke-[#F43F5E] dark:stroke-[#FB7185]',
  ],
  [
    'M18.5 30.5L16.1 30.7L13.6 30.1L11.3 28.9L9.2 27L7.4 24.5L6.2 21.5',
    'stroke-[#F59E0B] dark:stroke-[#FBBF24]',
  ],
  [
    'M15.6 22.5L14.2 20.5L13.5 18.1L13.4 15.4L14 12.7L15.3 9.9L17.3 7.3',
    'stroke-[#06B6D4] dark:stroke-[#22D3EE]',
  ],
] as const;

export function LogoMark({
  size = 30,
  className,
  title,
}: {
  size?: number;
  className?: string;
  /** Accessible name. Omit when the mark sits next to the brand name. */
  title?: string;
}) {
  const small = size < 20;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={small ? 5.6 : 4.6}
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {BLADES.map(([d, colour]) => (
        <path key={colour} d={d} className={colour} />
      ))}
    </svg>
  );
}
