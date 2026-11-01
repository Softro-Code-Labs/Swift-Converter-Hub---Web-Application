import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { STUDIOS, getStudioTools, type StudioId } from '@/config/tools';

/**
 * Generates the 1200x630 share image used in Open Graph / Twitter cards.
 *
 *   /og?title=Compress%20PDF%20Online&studio=file          tool page
 *   /og?title=Document%20Suite&studio=file&kind=hub        studio hub
 *   /og?title=MOV%20to%20MP4&studio=video&from=mov&to=mp4  format pair
 *   /og?title=About                                        any other page
 *
 * Each studio has its own colour scheme, and the logo shows that studio's
 * blade lit with the other five faded. Every page still gets its own card
 * with its own title, so shared links never look identical. lib/seo.ts
 * builds these URLs for every page; the home page uses the designed
 * public/og-image.png instead.
 */

interface Theme {
  /** Strong colour: text on the tint, the lit blade's partners. */
  fg: string;
  /** Light panel / chip background. */
  tint: string;
  /** Index of this studio's blade in the logo (see LogoMark.tsx). */
  blade: number;
}

const THEMES: Record<StudioId, Theme> = {
  image: { fg: '#1D5FD6', tint: '#E6EEFD', blade: 0 },
  audio: { fg: '#047857', tint: '#DDF4EA', blade: 1 },
  video: { fg: '#A21CAF', tint: '#F7E6FB', blade: 2 },
  file: { fg: '#BE123C', tint: '#FDE6EA', blade: 3 },
  data: { fg: '#B45309', tint: '#FDF0D8', blade: 4 },
  character: { fg: '#0E7490', tint: '#DCF3F7', blade: 5 },
};
const NEUTRAL = { fg: '#1A5FE0', tint: '#EAEFF8' };

// The logo's blades, in studio order (matches components/brand/LogoMark.tsx).
const BLADES = [
  [
    'M21.1 16L22.1 13.8L23.9 12L26.1 10.6L28.8 9.7L31.9 9.4L35.1 9.8',
    '#2F7BF5',
  ],
  [
    'M29.5 17.5L31.9 17.3L34.4 17.9L36.7 19.1L38.8 21L40.6 23.5L41.8 26.5',
    '#10B981',
  ],
  [
    'M32.4 25.5L33.8 27.5L34.5 29.9L34.6 32.6L34 35.3L32.7 38.1L30.7 40.7',
    '#D946EF',
  ],
  [
    'M26.9 32L25.9 34.2L24.1 36L21.9 37.4L19.2 38.3L16.1 38.6L12.9 38.2',
    '#F43F5E',
  ],
  [
    'M18.5 30.5L16.1 30.7L13.6 30.1L11.3 28.9L9.2 27L7.4 24.5L6.2 21.5',
    '#F59E0B',
  ],
  [
    'M15.6 22.5L14.2 20.5L13.5 18.1L13.4 15.4L14 12.7L15.3 9.9L17.3 7.3',
    '#06B6D4',
  ],
] as const;

/** The logo as a data URL. With `lit`, only that blade keeps its colour. */
function turbine(lit?: { blade: number; faded: string }) {
  const paths = BLADES.map(([d, colour], i) =>
    !lit || i === lit.blade
      ? `<path d="${d}" stroke="${colour}"/>`
      : `<path d="${d}" stroke="${lit.faded}" stroke-opacity="0.2"/>`,
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><g fill="none" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

let fonts: Promise<Buffer[]> | null = null;
function loadFonts() {
  const dir = path.join(
    process.cwd(),
    'node_modules/geist/dist/fonts/geist-sans',
  );
  fonts ??= Promise.all(
    [
      'Geist-Black.ttf',
      'Geist-Bold.ttf',
      'Geist-SemiBold.ttf',
      'Geist-Medium.ttf',
    ].map((f) => readFile(path.join(dir, f))),
  );
  return fonts;
}

const clean = (v: string | null, max: number) =>
  (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const formatLabel = (v: string | null) =>
  clean(v, 6)
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studio = STUDIOS.find((s) => s.id === searchParams.get('studio'));
  const theme = studio ? THEMES[studio.id] : null;
  const fg = theme?.fg ?? NEUTRAL.fg;
  const tint = theme?.tint ?? NEUTRAL.tint;

  const title =
    clean(searchParams.get('title'), 80) || 'Free online file converter';
  const sub =
    clean(searchParams.get('sub'), 110) ||
    studio?.tagline ||
    'Images, audio, video, PDFs, data and text';
  const isHub = searchParams.get('kind') === 'hub' && !!studio;
  const from = formatLabel(searchParams.get('from'));
  const to = formatLabel(searchParams.get('to'));
  const isPair = !!(from && to);

  const hubTools = isHub ? getStudioTools(studio.id).map((t) => t.name) : [];
  const shownTools = hubTools.slice(0, 5);

  const titleSize = title.length > 44 ? 58 : title.length > 26 ? 68 : 80;
  const [black, bold, semibold, medium] = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#F7F8FB',
          fontFamily: 'Geist',
          color: '#161B26',
        }}
      >
        {/* Left: brand, title, details */}
        <div
          style={{
            width: 760,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 56px 56px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={turbine()} width={50} height={50} alt="" />
            <div style={{ display: 'flex', fontSize: 30, letterSpacing: -0.6 }}>
              <span style={{ fontWeight: 900 }}>Swift</span>
              <span
                style={{ fontWeight: 600, color: '#4A5263', marginLeft: 8 }}
              >
                Converter Hub
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {studio && (
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 16px',
                    borderRadius: 999,
                    background: tint,
                    color: fg,
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: BLADES[theme!.blade][1],
                    }}
                  />
                  {studio.name}
                </div>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: -titleSize * 0.03,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                lineHeight: 1.4,
                fontWeight: 500,
                color: '#4A5263',
              }}
            >
              {sub}
            </div>
          </div>

          {isHub ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {shownTools.map((t) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    padding: '8px 14px',
                    borderRadius: 12,
                    background: '#FFFFFF',
                    border: '2px solid #E3E6EC',
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#2A3140',
                  }}
                >
                  {t}
                </div>
              ))}
              {hubTools.length > shownTools.length && (
                <div
                  style={{
                    display: 'flex',
                    padding: '8px 14px',
                    borderRadius: 12,
                    background: tint,
                    fontSize: 20,
                    fontWeight: 600,
                    color: fg,
                  }}
                >
                  +{hubTools.length - shownTools.length} more
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 22,
                fontWeight: 600,
                color: '#4A5263',
              }}
            >
              <span>Free</span>
              <span style={{ color: '#B5BCC9' }}>•</span>
              <span>No upload</span>
              <span style={{ color: '#B5BCC9' }}>•</span>
              <span>Runs in your browser</span>
            </div>
          )}
        </div>

        {/* Right: studio panel */}
        <div
          style={{
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: tint,
            position: 'relative',
          }}
        >
          {isPair ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 18,
              }}
            >
              {[from, to].map((label, i) => (
                <div
                  key={label + i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 18,
                  }}
                >
                  {i === 1 && (
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 56,
                        fontWeight: 700,
                        color: fg,
                      }}
                    >
                      ↓
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 260,
                      height: 132,
                      borderRadius: 28,
                      background: i === 1 ? fg : '#FFFFFF',
                      color: i === 1 ? '#FFFFFF' : fg,
                      fontSize: label.length > 4 ? 56 : 68,
                      fontWeight: 900,
                      letterSpacing: -1,
                      boxShadow: '0 12px 30px rgba(22,27,38,0.10)',
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 340,
                height: 340,
                borderRadius: 84,
                background: '#FFFFFF',
                boxShadow: '0 20px 50px rgba(22,27,38,0.10)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={turbine(
                  theme ? { blade: theme.blade, faded: fg } : undefined,
                )}
                width={250}
                height={250}
                alt=""
              />
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              fontSize: 20,
              fontWeight: 600,
              color: fg,
            }}
          >
            swiftconverterhub.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Geist', data: black, weight: 900, style: 'normal' },
        { name: 'Geist', data: bold, weight: 700, style: 'normal' },
        { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist', data: medium, weight: 500, style: 'normal' },
      ],
      headers: {
        'Cache-Control':
          'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      },
    },
  );
}
