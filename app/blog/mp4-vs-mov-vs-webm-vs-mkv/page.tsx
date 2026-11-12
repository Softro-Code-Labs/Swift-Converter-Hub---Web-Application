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
import { ContainerDiagram } from '@/features/blog/visuals/ContainerDiagram';
import { RemuxChecker } from '@/features/blog/visuals/RemuxChecker';

const post = getBlogPost('mp4-vs-mov-vs-webm-vs-mkv')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const FAQS = [
  {
    q: 'Is MP4 better quality than MOV?',
    a: 'Neither is better - they are just containers. An MP4 and a MOV holding the same H.264 video look identical. Quality is decided by the codec and its bitrate, not the file extension.',
  },
  {
    q: 'Does converting MOV to MP4 lose quality?',
    a: 'Not when the tracks inside already suit MP4, which is the case for most iPhone and camera videos. The video is copied into a new container without being re-compressed, so it is bit-for-bit the same picture.',
  },
  {
    q: 'Why won’t my MKV open on my phone or in my editor?',
    a: 'MKV can hold almost any codec, and many phones and editing apps only accept a few. Converting to MP4 with H.264 video and AAC audio makes it open almost everywhere.',
  },
  {
    q: 'Should my website use WebM or MP4?',
    a: 'Offer both if you can: WebM (VP9 or AV1) is usually smaller, and MP4 (H.264) is the fallback every browser and device plays.',
  },
  {
    q: 'Is AVI still worth using?',
    a: 'Rarely. It is an old container with poor support for modern codecs and features. Convert old AVI files to MP4 for anything you still watch or share.',
  },
];

export default function VideoFormatsPost() {
  return (
    <ArticleLayout
      post={post}
      faqs={FAQS}
      toc={[
        { id: 'box-and-contents', label: 'The box and what is inside' },
        { id: 'compare', label: 'The four formats compared' },
        { id: 'pick', label: 'Which one should you use?' },
        { id: 'fast-or-slow', label: 'Why some conversions are instant' },
        { id: 'speed', label: 'How fast it is in practice' },
      ]}
    >
      <P>
        You record a video on your phone and it is a MOV. A friend sends an
        MKV that will not open. A website asks for MP4 or WebM. It is tempting
        to think these are four different kinds of video, but mostly they are
        four different <em>boxes</em> - and once you see what is inside the
        box, choosing a format and converting between them gets much simpler.
      </P>

      <KeyTakeaways
        items={[
          <>
            The extension (.mp4, .mov, .webm, .mkv) names the{' '}
            <strong>container</strong>. The picture quality comes from the{' '}
            <strong>codec</strong> inside it.
          </>,
          'MP4 with H.264 video and AAC audio plays practically everywhere. When in doubt, use it.',
          'If the codecs already fit the new container, conversion is a quick, lossless copy (a "remux").',
          'Only when the codecs do not fit does the video need re-encoding, which takes longer.',
        ]}
      />

      <H2 id="box-and-contents">The box and what is inside</H2>
      <P>A video file is really a few things packed together:</P>
      <List>
        <li>
          <strong>The container</strong> - the file format itself (MP4, MOV,
          WebM, MKV). It holds the tracks, keeps them in sync and stores
          details such as the title and rotation.
        </li>
        <li>
          <strong>The video track</strong>, compressed with a{' '}
          <strong>video codec</strong> such as H.264, HEVC (H.265), VP9 or AV1.
        </li>
        <li>
          <strong>One or more audio tracks</strong>, compressed with an audio
          codec such as AAC, MP3 or Opus.
        </li>
        <li>
          Optionally <strong>subtitles</strong>, chapters and extra audio
          languages.
        </li>
      </List>
      <P>
        Each container only accepts certain codecs. That single fact decides
        whether a conversion takes two seconds or two minutes.
      </P>

      <Figure caption="Same tracks, new box: a remux. Tracks that the new box can't hold must be rebuilt: a re-encode.">
        <ContainerDiagram />
      </Figure>

      <H2 id="compare">The four formats compared</H2>
      <DataTable
        caption="MP4, MOV, WebM and MKV compared"
        head={['Container', 'Usually holds', 'Best for', 'Plays on']}
        rows={[
          ['MP4', 'H.264 or HEVC + AAC', 'Sharing, phones, social media', 'Practically everything'],
          ['MOV', 'H.264, HEVC or ProRes + AAC', 'iPhone recordings, editing on a Mac', 'Apple devices, most editors and players'],
          ['WebM', 'VP9 or AV1 + Opus', 'Video on websites', 'All modern browsers; some TVs and editors struggle'],
          ['MKV', 'Almost anything, many tracks', 'Films with several languages and subtitles', 'VLC and media players; many phones and editors refuse it'],
        ]}
      />
      <P>
        You will still meet <strong>AVI</strong>, especially in old
        collections. It predates modern codecs and features, so it is best
        converted to MP4 rather than used for anything new.
      </P>

      <H2 id="pick">Which one should you use?</H2>
      <H3>Sending a video to someone, or posting it</H3>
      <P>
        <strong>MP4 with H.264 and AAC.</strong> It is the format every phone,
        computer, browser and social network accepts. HEVC gives smaller files
        at the same quality, but a few older devices and browsers still cannot
        play it.
      </P>
      <H3>A video on your own website</H3>
      <P>
        <strong>WebM (VP9 or AV1) with an MP4 fallback.</strong> WebM files
        are usually smaller for the same quality, and listing an MP4 as a
        second source covers every remaining device.
      </P>
      <H3>Editing</H3>
      <P>
        <strong>Keep what your camera recorded</strong> - usually MOV or MP4.
        Converting before you edit only adds a generation of compression.
        Export to MP4 at the end.
      </P>
      <H3>Archiving films and series</H3>
      <P>
        <strong>MKV</strong>, when you want several audio languages and
        subtitle tracks in one file and you watch with a capable player. Make
        an MP4 copy for devices that refuse MKV.
      </P>

      <Callout tone="warning" title="Changing the extension is not converting">
        Renaming <code>video.mkv</code> to <code>video.mp4</code> changes the
        label, not the box, and often leaves a file nothing can open. Always
        convert with a proper tool.
      </Callout>

      <H2 id="fast-or-slow">Why some conversions are instant</H2>
      <P>
        If every track in your file is allowed in the new container, the
        converter can simply <strong>remux</strong>: lift the tracks out and
        put them in the new box. No pixel is touched, so it is lossless and
        takes seconds. If a track is not allowed, it must be{' '}
        <strong>re-encoded</strong>: decoded and compressed again in a codec
        the container accepts. That is slower and, like any compression, loses
        a little quality.
      </P>
      <P>Pick what is in your file and where you want it to go:</P>

      <Figure caption="These are the same rules our Video converter follows. MP4 and MOV are limited to the codecs that phones, QuickTime and editors reliably open.">
        <RemuxChecker />
      </Figure>

      <Callout tone="tip" title="Not sure what's inside your file?">
        Most phone and camera videos are H.264 or HEVC with AAC audio, which
        means MOV ↔ MP4 and MP4/MOV → MKV are usually instant remuxes.
      </Callout>

      <H2 id="speed">How fast it is in practice</H2>
      <P>
        Our converter tries the quickest route first: a remux when the tracks
        fit, then your device&apos;s hardware video encoder through the
        browser&apos;s WebCodecs feature, and finally FFmpeg running in the
        browser. We timed a 20-second 720p clip in a browser{' '}
        <em>without</em> a graphics chip, so real devices are usually faster
        still:
      </P>
      <DataTable
        caption="Conversion time for a 20-second 720p clip"
        head={['Task', 'Before our speed update', 'Now']}
        rows={[
          ['MP4 → MOV', '32.4 s', <strong key="a">0.4 s</strong>],
          ['MP4 → WebM', '93.6 s', <strong key="b">8.6 s</strong>],
          ['Compress (Balanced)', '30.8 s', <strong key="c">5.1 s</strong>],
          ['Trim 7 s from the middle', '13.1 s', <strong key="d">4.2 s</strong>],
        ]}
      />
      <P>
        Popular conversions have their own pages:{' '}
        <A href="/video/convert/mov-to-mp4">MOV to MP4</A>,{' '}
        <A href="/video/convert/mkv-to-mp4">MKV to MP4</A> and{' '}
        <A href="/video/convert/mp4-to-webm">MP4 to WebM</A>. And because
        everything runs in your browser, your videos are never uploaded.
      </P>

      <ToolCard toolId="video-convert" cta="Convert a video" />

      <P>
        Need a smaller file rather than a different format?{' '}
        <A href="/video/compress">Compress video</A> uses the same fast,
        on-device engine.
      </P>
    </ArticleLayout>
  );
}
