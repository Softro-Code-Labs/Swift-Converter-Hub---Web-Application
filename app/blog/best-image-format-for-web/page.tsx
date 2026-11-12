import type { Metadata } from 'next';
import { getBlogPost } from '@/config/blog';
import { pageMetadata } from '@/lib/seo';
import {
  A,
  ArticleLayout,
  Callout,
  DataTable,
  Figure,
  H2,
  H3,
  KeyTakeaways,
  List,
  P,
  ToolCard,
} from '@/features/blog/components';
import { FormatPicker } from '@/features/blog/visuals/FormatPicker';
import { FormatSizeChart } from '@/features/blog/visuals/FormatSizeChart';

const post = getBlogPost('best-image-format-for-web')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const FAQS = [
  {
    q: 'Do all browsers support AVIF and WebP in 2026?',
    a: 'Yes, every current major browser displays both. The gaps are in older software - some email clients, legacy enterprise systems and old image editors - which is where JPEG and PNG still matter.',
  },
  {
    q: 'Does converting a JPEG to PNG improve its quality?',
    a: 'No. PNG is lossless, so it preserves exactly what it is given - including the JPEG compression that is already there. The file just gets bigger.',
  },
  {
    q: 'Which formats support transparency?',
    a: 'PNG, WebP and AVIF all do. JPEG does not, so a transparent area turns into a solid colour when saved as JPEG.',
  },
  {
    q: 'What about HEIC photos from an iPhone?',
    a: 'HEIC is efficient, but most websites and Windows apps can’t show it. Convert to JPEG for compatibility, or to WebP or AVIF for the web.',
  },
];

export default function BestImageFormatPost() {
  return (
    <ArticleLayout
      post={post}
      faqs={FAQS}
      toc={[
        { id: 'short-version', label: 'The short version' },
        { id: 'compare', label: 'How the formats compare' },
        { id: 'avif', label: 'Why AVIF is not the automatic winner' },
        { id: 'decide', label: 'Pick a format in three questions' },
        { id: 'converting', label: 'Converting between formats' },
      ]}
    >
      <P>
        Every few years a new image format shows up promising smaller files
        and better quality, and every few years developers argue about whether
        it is actually worth switching. In 2026 the real answer is not one
        format for everything - it is knowing which trade-off you are making,
        because JPEG, PNG, WebP, and AVIF are each genuinely better at
        different jobs. Here is how to actually decide, without the marketing
        copy.
      </P>

      <H2 id="short-version">The short version</H2>
      <KeyTakeaways
        items={[
          <>
            <strong>AVIF</strong> for photos where file size matters most.
          </>,
          <>
            <strong>WebP</strong> as the safe modern default.
          </>,
          <>
            <strong>PNG</strong> for anything that needs a transparent
            background or sharp flat edges (logos, screenshots, icons).
          </>,
          <>
            <strong>JPEG</strong> only when you need maximum compatibility with
            very old software.
          </>,
        ]}
      />
      <P>The rest of this guide explains why.</P>

      <H2 id="compare">How the formats actually compare</H2>
      <DataTable
        caption="JPEG, PNG, WebP and AVIF compared"
        head={['Format', 'Best for', 'Transparency', 'Typical size vs. JPEG']}
        rows={[
          ['JPEG', 'Photos, universal compatibility', 'No', 'Baseline'],
          ['PNG', 'Logos, icons, screenshots, flat colors', 'Yes', 'Often 2-5x larger for photos'],
          ['WebP', 'General web use, modern default', 'Yes', '~25-35% smaller'],
          ['AVIF', 'Photography, hero images, large galleries', 'Yes', '~40-50% smaller'],
        ]}
      />

      <Figure caption="The same ranges as the table, drawn to scale. The faded part of each bar is how much results vary from photo to photo.">
        <FormatSizeChart />
      </Figure>

      <P>
        Those percentages are rough because actual results depend heavily on
        the image itself - a busy photo of foliage compresses very differently
        than a smooth gradient or a screenshot of a UI. Treat the table as a
        starting point, not a guarantee.
      </P>

      <H2 id="avif">Why AVIF is not the automatic winner</H2>
      <P>
        AVIF (based on the AV1 video codec) genuinely produces the smallest
        files at a given quality level for most photographic content. But it
        has two practical costs that the size comparisons usually leave out:
      </P>
      <List>
        <li>
          <strong>Encoding is slower.</strong> If you are generating thousands
          of images on the fly (a product catalog, user uploads), AVIF encoding
          can meaningfully slow down your pipeline compared to WebP or JPEG.
        </li>
        <li>
          <strong>Decoding is more CPU-intensive on older or low-power devices.</strong>{' '}
          A modern phone won&apos;t notice. A five-year-old budget Android
          device scrolling a long image feed might.
        </li>
      </List>
      <P>
        For a small number of hero images or a photography portfolio, neither
        of these matters - encode once, serve forever. For a high-volume,
        dynamically generated image pipeline, it is worth testing before
        committing.
      </P>

      <H3>Where WebP still wins</H3>
      <P>
        WebP hits a genuinely good middle ground: meaningfully smaller than
        JPEG, supports transparency (unlike JPEG), encodes fast, and decodes
        cheaply on essentially any device made in the last decade. If you want
        one format to standardize on without thinking about it further, WebP is
        still the pragmatic default in 2026.
      </P>

      <H3>When PNG is still the right call</H3>
      <P>
        PNG uses lossless compression, which is exactly what you want for
        images with large flat areas of solid color, sharp text, or anything
        where a single wrong pixel would be visible - app icons, logos,
        diagrams, and screenshots. Lossy formats (including WebP and AVIF in
        their lossy modes) can introduce subtle artifacts around sharp edges
        that are much more noticeable on this kind of content than they are on
        a photo.
      </P>

      <H3>When JPEG is still the right call</H3>
      <P>
        Honestly, rarely by choice in 2026 - but if your image needs to render
        correctly in genuinely old software (some email clients, certain
        embedded devices, older enterprise systems), JPEG&apos;s universal
        support is hard to beat. It is the format you fall back to, not the one
        you reach for first.
      </P>

      <H2 id="decide">A simple decision framework</H2>
      <List>
        <li>Does it need transparency? Rule out JPEG immediately.</li>
        <li>
          Is it a photo where file size matters (hero banners, galleries)? Try
          AVIF first, fall back to WebP if your pipeline needs faster encoding.
        </li>
        <li>Is it a logo, icon, or screenshot with sharp edges or text? Use PNG.</li>
        <li>Everything else, general web images? WebP, without overthinking it.</li>
      </List>
      <P>Or answer three quick questions and let the picker apply it for you:</P>

      <Figure caption="Interactive: the same decision framework as the list above.">
        <FormatPicker />
      </Figure>

      <Callout tone="tip" title="Converting doesn't add quality back">
        Turning a small, heavily compressed JPEG into PNG or AVIF keeps its
        blockiness. Always convert from the best original you have.
      </Callout>

      <H2 id="converting">Converting between formats</H2>
      <P>
        If you already have images in one format and need another, the
        conversion itself is straightforward - the harder part is usually just
        deciding which format to target, which is what this guide was for. Our{' '}
        <A href="/image/convert">image format converter</A> handles JPEG, PNG,
        WebP, AVIF, and well over a hundred other formats entirely in your
        browser, so you can test a few options on your own images and compare
        the actual file sizes yourself rather than relying on generic
        percentages like the ones above.
      </P>

      <ToolCard toolId="image-convert" cta="Convert an image" />

      <P>
        Popular one-click conversions:{' '}
        <A href="/image/convert/jpg-to-webp">JPG to WebP</A>,{' '}
        <A href="/image/convert/jpg-to-avif">JPG to AVIF</A>,{' '}
        <A href="/image/convert/png-to-webp">PNG to WebP</A> and{' '}
        <A href="/image/convert/heic-to-jpg">HEIC to JPG</A>.
      </P>
    </ArticleLayout>
  );
}
