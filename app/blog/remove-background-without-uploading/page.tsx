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
import { MaskPipeline } from '@/features/blog/visuals/MaskPipeline';
import { BackgroundSwapDemo } from '@/features/blog/visuals/BackgroundSwapDemo';

const post = getBlogPost('remove-background-without-uploading')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const FAQS = [
  {
    q: 'Is it really free and private?',
    a: 'Yes. The AI model runs inside your browser tab, so your photo is never sent anywhere. There is no account, no watermark and no limit on how many photos you process.',
  },
  {
    q: 'Why is the first photo slower?',
    a: 'The first time, your browser downloads the AI model (about 47 MB) and keeps it in its cache. Every photo after that starts straight away, even if you come back another day.',
  },
  {
    q: 'Which format keeps the transparent background?',
    a: 'PNG or WebP. JPG has no transparency, so a JPG export always gets a solid background - pick a colour first if you need JPG.',
  },
  {
    q: 'Does it work on a phone?',
    a: 'Yes. Phones without a usable graphics chip run the model on the processor instead. It takes longer, but the result is the same.',
  },
  {
    q: 'Can it handle hair and fur?',
    a: 'Usually well, as long as the hair stands out from the background. Fine strands against a busy or similar-coloured background are the hardest case for any tool, so a plain backdrop helps a lot.',
  },
];

export default function RemoveBackgroundPost() {
  return (
    <ArticleLayout
      post={post}
      faqs={FAQS}
      toc={[
        { id: 'how-it-works', label: 'How AI background removal works' },
        { id: 'on-device', label: 'Why it can run on your device now' },
        { id: 'try-it', label: 'Try it: swap the background' },
        { id: 'clean-edges', label: 'Getting clean, natural edges' },
        { id: 'saving', label: 'Saving the result' },
      ]}
    >
      <P>
        Cutting a person, a pet or a product out of a photo used to mean
        careful work with a selection tool, or uploading the photo to a
        website and hoping it gets deleted afterwards. Neither is necessary any
        more. Modern AI models can find the subject of a photo in about a
        second, and they are now small and fast enough to run on your own
        computer or phone - so the photo never has to leave it.
      </P>

      <KeyTakeaways
        items={[
          'An AI model draws a "mask" that marks each pixel as subject or background. Everything else is simple maths.',
          'With WebGPU, a modern browser can run that model on your graphics chip in about a second - no upload needed.',
          'Good lighting and contrast between subject and background matter more than any setting.',
          'Save as PNG or WebP to keep transparency. JPG always needs a solid background.',
        ]}
      />

      <H2 id="how-it-works">How AI background removal works</H2>
      <P>
        The clever part is a single step. A neural network looks at the whole
        photo and gives every pixel a score from 0 to 1: how sure it is that
        the pixel belongs to the main subject. Those scores form a{' '}
        <strong>mask</strong> - a black-and-white image where white means
        &quot;keep&quot;, black means &quot;remove&quot; and grey means
        &quot;partly&quot;, which is what makes soft edges like hair look
        natural.
      </P>

      <Figure caption="The four stages. Only stage ② needs AI - the rest is quick image maths done in your browser.">
        <MaskPipeline />
      </Figure>

      <P>
        Once the mask exists, everything you can do with the cut-out is
        ordinary image processing: multiply the photo by the mask to get a
        transparent cut-out, then lay it over a colour, a blurred copy of the
        original or a completely different picture.
      </P>

      <H2 id="on-device">Why it can run on your device now</H2>
      <P>
        Until recently these models were too big and too slow for a browser,
        which is why most background removers upload your photo to a server
        with a powerful graphics card. Three things changed that:
      </P>
      <List>
        <li>
          <strong>WebGPU.</strong> Browsers can now hand heavy maths to your
          graphics chip, the same hardware games use. The model that takes about
          15 seconds on a processor finishes in about one second on a typical
          laptop GPU.
        </li>
        <li>
          <strong>Smaller models.</strong> We store the model&apos;s weights
          with 8-bit precision, shrinking it from 178 MB to 47 MB. Its masks
          still overlap the full-size model&apos;s by 99.8% or more on our test
          photos - a difference you cannot see.
        </li>
        <li>
          <strong>Caching.</strong> The model downloads once and stays in your
          browser cache, so it behaves like an installed app from the second
          photo on.
        </li>
      </List>

      <Callout tone="note" title="How to check it's really on-device">
        Open your browser&apos;s developer tools, switch to the Network tab and
        remove a background. You will see the model load the first time, then
        no request carrying your photo. Our post on{' '}
        <A href="/blog/how-browser-file-conversion-works">
          how browser-based conversion works
        </A>{' '}
        walks through this test.
      </Callout>

      <H2 id="try-it">Try it: swap the background</H2>
      <P>
        Here is the idea in miniature. The &quot;photo&quot; below is an
        illustration, but the controls work the way the real tool does: pick a
        new background, soften the edge, and drag the slider to compare with
        the original.
      </P>

      <Figure caption="Interactive demo. The real Background Remover gives you the same choices for your own photos.">
        <BackgroundSwapDemo />
      </Figure>

      <H2 id="clean-edges">Getting clean, natural edges</H2>
      <P>
        Most bad cut-outs are decided before you press a button. The model can
        only separate what the camera made separable.
      </P>
      <H3>Before you take the photo</H3>
      <List>
        <li>
          <strong>Contrast beats everything.</strong> A dark jacket against a
          light wall is easy. A grey cat on a grey sofa is hard for any tool.
        </li>
        <li>
          <strong>Keep the subject sharp.</strong> Motion blur and missed
          focus give the model soft, ambiguous edges to guess at.
        </li>
        <li>
          <strong>Give hair some space.</strong> A plain, slightly blurred
          background behind loose hair gives far better strands than a busy
          one.
        </li>
      </List>
      <H3>After the cut-out</H3>
      <List>
        <li>
          <strong>Add a touch of feather</strong> (one or two pixels) when you
          place the subject on a new background. A perfectly hard edge is what
          makes a cut-out look pasted on.
        </li>
        <li>
          <strong>Match the light.</strong> A subject lit from the left looks
          wrong on a background lit from the right. A blurred version of the
          original background is the safest choice when in doubt.
        </li>
        <li>
          <strong>Crop to the subject</strong> for product photos and profile
          pictures, so the subject fills the frame evenly.
        </li>
      </List>

      <Callout tone="tip" title="Shooting products for a shop?">
        Use a plain sheet of paper or card as a backdrop and light it evenly.
        You will get near-perfect masks, and swapping to pure white for a
        marketplace listing takes one click.
      </Callout>

      <H2 id="saving">Saving the result</H2>
      <P>The format you save in decides whether transparency survives.</P>
      <DataTable
        caption="Which formats keep a transparent background"
        head={['Format', 'Transparent?', 'Use it for']}
        rows={[
          ['PNG', 'Yes', 'Logos, stickers, editing later. Lossless, larger files.'],
          ['WebP', 'Yes', 'Websites and online shops. Much smaller than PNG.'],
          ['JPG', 'No', 'Photos on a solid colour background, e.g. passport-style.'],
        ]}
      />
      <P>
        Not sure which to choose? Our guide to the{' '}
        <A href="/blog/best-image-format-for-web">best image format for the web</A>{' '}
        has a quick picker.
      </P>

      <ToolCard toolId="image-remove-background" cta="Remove a background" />

      <P>
        The tool handles up to 20 photos at once and downloads them as a single
        ZIP. If you only need to tidy the frame afterwards,{' '}
        <A href="/image/crop">Crop &amp; resize</A> and{' '}
        <A href="/image/compress">Compress image</A> work on the result straight
        away - all in the same tab.
      </P>
    </ArticleLayout>
  );
}
