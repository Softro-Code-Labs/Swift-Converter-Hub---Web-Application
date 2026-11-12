import type { Metadata } from 'next';
import { getBlogPost } from '@/config/blog';
import { pageMetadata } from '@/lib/seo';
import {
  A,
  ArticleLayout,
  Callout,
  Figure,
  H2,
  H3,
  KeyTakeaways,
  List,
  P,
  ToolCard,
} from '@/features/blog/components';
import { PdfSizeAnatomy } from '@/features/blog/visuals/PdfSizeAnatomy';
import { CompressionLevels } from '@/features/blog/visuals/CompressionLevels';

const post = getBlogPost('reduce-pdf-file-size')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const FAQS = [
  {
    q: 'Will compressing a PDF make the text blurry?',
    a: 'Real text stays perfectly sharp, because it is stored as text, not pixels. Only images - including scanned pages - can lose detail, and only if you compress them hard.',
  },
  {
    q: 'Why did my PDF barely get smaller?',
    a: 'It probably has few or no images. Text-only PDFs are already compact, so there is little left to remove.',
  },
  {
    q: 'Is it safe to compress confidential documents online?',
    a: 'Only with a tool that runs in your browser. Our PDF compressor never uploads the file - it is processed inside your browser tab.',
  },
  {
    q: 'What size do email attachments need to be?',
    a: 'Many email services cap attachments at around 20-25 MB, and some company systems are stricter. Balanced compression usually gets a photo-heavy document well under that.',
  },
];

export default function ReducePdfSizePost() {
  return (
    <ArticleLayout
      post={post}
      faqs={FAQS}
      toc={[
        { id: 'where-size-comes-from', label: 'Where the size comes from' },
        { id: 'what-compression-does', label: 'What compression actually does' },
        { id: 'levels', label: 'Choosing a compression level' },
        { id: 'approach', label: 'A practical approach' },
        { id: 'try-it', label: 'Try it yourself' },
      ]}
    >
      <P>
        A ten-page PDF that should be a couple of megabytes somehow ends up at
        forty. This is almost never random - PDF bloat comes from a small set
        of predictable causes, and understanding them tells you exactly what
        compression can and cannot safely remove.
      </P>

      <KeyTakeaways
        items={[
          'Images - including scanned pages - are almost always where the megabytes are.',
          'Removing metadata and leftover data is free: nothing visible changes.',
          'Re-encoding images is the only step that can cost quality, so choose how hard to push it.',
          'Start with a moderate setting, check the result, and keep your original.',
        ]}
      />

      <H2 id="where-size-comes-from">Where the size actually comes from</H2>
      <List>
        <li>
          <strong>Uncompressed or oversized images.</strong> By far the most
          common cause. A photo scanned or embedded at 300+ DPI in a document
          that will only ever be viewed on a screen is carrying far more
          resolution than it needs.
        </li>
        <li>
          <strong>Scanned pages saved as images.</strong> A scanner often saves
          each page as a full-resolution image rather than searchable text, so a
          20-page scanned contract can easily be larger than a 200-page
          text-based PDF.
        </li>
        <li>
          <strong>Embedded fonts.</strong> PDFs often embed entire font files to
          guarantee consistent rendering, which adds real weight, especially
          with multiple font weights and styles.
        </li>
        <li>
          <strong>Redundant or unused data.</strong> Deleted-but-not-purged
          content, duplicate embedded resources, or leftover metadata from
          editing software can accumulate over multiple rounds of edits.
        </li>
      </List>

      <Figure caption="Illustrative examples - every file is different, but the pattern is typical. Pick a document to see where its size goes.">
        <PdfSizeAnatomy />
      </Figure>

      <H2 id="what-compression-does">What compression actually does</H2>
      <P>
        &quot;Compress PDF&quot; tools are mostly doing one or more of these
        things:
      </P>
      <List>
        <li>
          <strong>Re-encoding images at lower resolution or quality.</strong>{' '}
          This is where most of the size reduction comes from, and it is also
          the one place quality loss is possible if pushed too far.
        </li>
        <li>
          <strong>Subsetting fonts.</strong> Instead of embedding an entire
          typeface, the tool keeps only the specific characters actually used in
          the document - invisible to the reader, real savings on the file.
        </li>
        <li>
          <strong>Removing redundant objects.</strong> Cleaning up unused
          resources and duplicate data that accumulated during editing, with
          zero visible effect.
        </li>
      </List>

      <H3>The trade-off: where quality loss actually comes from</H3>
      <P>
        Font subsetting and redundant-data removal are essentially free - they
        do not change how the document looks. Image re-encoding is the only
        step with a real trade-off, and it is a genuine resolution-vs-size
        decision: push it too far and text within scanned images gets blurry,
        or photos show visible compression artifacts. A good compressor lets
        you choose the aggressiveness of this step rather than applying one
        fixed setting to every document.
      </P>

      <H2 id="levels">Choosing a compression level</H2>
      <P>
        Here is exactly what each level of our PDF compressor does. The
        &quot;DPI&quot; figure shows how much detail a full-page A4 scan keeps:
        around 150 DPI reads comfortably on screen, while printing small text
        benefits from more.
      </P>

      <Figure caption="Values come straight from the tool's settings.">
        <CompressionLevels />
      </Figure>

      <H2 id="approach">A practical approach</H2>
      <List>
        <li>
          <strong>Start with a moderate compression setting</strong> rather than
          the most aggressive option, and check the result before committing to
          it.
        </li>
        <li>
          <strong>If the PDF is a scanned document,</strong> consider whether it
          needs to stay as scanned images at all - running it through OCR to
          convert it to searchable text can shrink it dramatically while making
          it more useful.
        </li>
        <li>
          <strong>Check where the size is concentrated</strong> before
          compressing - a document with one enormous embedded image needs a
          different fix than one with fifty medium-sized ones.
        </li>
        <li>
          <strong>Compress a copy, not your original,</strong> until you have
          confirmed the output looks right at the resolution you actually need
          it for (screen viewing vs. printing have very different requirements).
        </li>
      </List>

      <Callout tone="tip" title="Only need part of the document?">
        Sending three pages of a 60-page report? <A href="/file/pdf-split">Split
        the PDF</A> first - the smallest file is the one that leaves out pages
        nobody needs.
      </Callout>

      <H2 id="try-it">Try it yourself</H2>
      <P>
        Our <A href="/file/pdf-compress">PDF compression tool</A> runs entirely
        in your browser, so you can test a couple of compression levels on your
        own document and compare the results side by side before deciding
        which trade-off is right for that particular file - without uploading
        it anywhere to find out.
      </P>

      <ToolCard toolId="pdf-compress" cta="Compress a PDF" />

      <P>
        Need to rearrange the document as well? <A href="/file/pdf-merge">Merge</A>,{' '}
        <A href="/file/pdf-rotate">rotate</A> or <A href="/file/pdf-split">split</A>{' '}
        it with the other Document Suite tools - all in the same tab.
      </P>
    </ArticleLayout>
  );
}
