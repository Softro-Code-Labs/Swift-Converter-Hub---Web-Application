import type { Metadata } from 'next';
import { getBlogPost } from '@/config/blog';
import { STUDIOS } from '@/config/tools';
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
import { ConversionFlow } from '@/features/blog/visuals/ConversionFlow';
import { NetworkPanelDemo } from '@/features/blog/visuals/NetworkPanelDemo';

const post = getBlogPost('how-browser-file-conversion-works')!;

export const metadata: Metadata = pageMetadata({
  path: post.path,
  title: post.title,
  description: post.description,
  ogTitle: post.title,
  type: 'article',
});

const FAQS = [
  {
    q: 'Is WebAssembly safe to run?',
    a: 'Yes. WebAssembly runs inside the same security sandbox as the rest of the web page. It cannot read files you have not chosen, and it cannot reach the rest of your computer.',
  },
  {
    q: 'Why does the first conversion take longer?',
    a: 'The first time you use a tool, your browser downloads its engine. After that it is cached, so later conversions start immediately.',
  },
  {
    q: 'Can my browser use the graphics card?',
    a: 'Increasingly, yes. WebGPU lets AI tools such as background removal run on the graphics chip, and WebCodecs gives video tools access to the hardware video encoder. Tools fall back to the processor when these are not available.',
  },
  {
    q: 'Is there a file size limit?',
    a: 'Not one imposed by a server. The practical limit is your device’s memory, which is far larger than most upload limits on a modern computer.',
  },
];

export default function BrowserConversionPost() {
  return (
    <ArticleLayout
      post={post}
      faqs={FAQS}
      toc={[
        { id: 'old-way', label: 'The old way: upload, wait, download' },
        { id: 'new-way', label: 'Bring the engine to the file' },
        { id: 'why-it-matters', label: 'Why this matters beyond privacy' },
        { id: 'engines', label: 'The engines behind each studio' },
        { id: 'check', label: 'How to tell if a tool really does this' },
      ]}
    >
      <P>
        &quot;Runs entirely in your browser&quot; is a claim a lot of
        conversion tools make, and it sounds like marketing until you
        understand what is actually happening under the hood. It is not a trick
        or a small file-size limit in disguise - it is a real shift in where
        computation happens, made possible by a technology called WebAssembly.
        Here is what is genuinely going on when you drop a file into a
        browser-based converter.
      </P>

      <KeyTakeaways
        items={[
          'Traditional converters upload your file to a server. Browser-based ones download the converter to you instead.',
          'WebAssembly lets professional engines such as ImageMagick and FFmpeg run in a browser tab at near-native speed.',
          'Your file never crosses the network, so there is no upload wait, no server size cap, and it keeps working offline.',
          'You can check any tool yourself in two minutes with the browser’s Network panel.',
        ]}
      />

      <H2 id="old-way">The old way: upload, wait, download</H2>
      <P>
        Traditionally, an online file converter works like this: you upload
        your file to a server, the server&apos;s software converts it, and you
        download the result. This is simple to build, but it means your file -
        which might be a personal photo, a scanned document, or a business
        spreadsheet - physically leaves your device and sits on someone
        else&apos;s server, even if only temporarily. It also means the tool
        needs bandwidth and server capacity that scales with every user, and it
        does not work without an internet connection.
      </P>

      <H2 id="new-way">The browser-based way: bring the engine to the file</H2>
      <P>
        WebAssembly (often shortened to WASM) is a low-level format that lets
        code written in languages like C, C++, or Rust run inside a web browser
        at speeds close to a native desktop application. Instead of sending
        your file to a server-side converter, a browser-based tool sends the{' '}
        <em>converter itself</em> - compiled to WebAssembly - to your browser
        tab. From that point on, everything happens on your own machine, using
        your own CPU.
      </P>

      <Figure caption="Switch between the two models to see where your file travels.">
        <ConversionFlow />
      </Figure>

      <H3>What actually happens, step by step</H3>
      <List ordered>
        <li>
          <strong>The tool loads.</strong> When you open a converter page, your
          browser downloads a compact WebAssembly module - often the same
          underlying engine used by professional desktop software, compiled for
          the web.
        </li>
        <li>
          <strong>You drop a file.</strong> The file goes directly into your
          browser&apos;s memory. No upload request is made, because there is
          nowhere for it to be uploaded to.
        </li>
        <li>
          <strong>Conversion happens locally.</strong> The WebAssembly module
          reads the file&apos;s bytes, transforms them according to the target
          format&apos;s specification, and produces the output - all inside the
          browser tab, using your device&apos;s processor.
        </li>
        <li>
          <strong>You download the result.</strong> The browser generates a
          downloadable file directly from memory. At no point did the original
          file or the converted output travel over the network.
        </li>
      </List>

      <H2 id="why-it-matters">Why this matters beyond privacy</H2>
      <P>Privacy is the most obvious benefit, but it is not the only one:</P>
      <List>
        <li>
          <strong>No file size limits imposed by a server.</strong> The only
          real ceiling is your own device&apos;s memory, not an arbitrary cap
          set to protect someone else&apos;s server costs.
        </li>
        <li>
          <strong>It keeps working with a flaky connection.</strong> Once the
          page and its WebAssembly module have loaded, losing your internet
          connection mid-conversion does not interrupt the process, because
          nothing further needs to be sent or received.
        </li>
        <li>
          <strong>Speed, for most file sizes.</strong> There is no upload wait,
          no server queue, and no download wait for the result - conversion
          starts the moment you drop the file.
        </li>
      </List>

      <H3>The trade-off worth knowing about</H3>
      <P>
        Browser-based conversion uses your device&apos;s own CPU, so very large
        files or very demanding conversions (long video files, for example)
        will run faster on a powerful laptop than on an older phone. It is a
        genuine trade-off, not a hidden downside - you are borrowing your own
        hardware instead of someone else&apos;s server, and the performance
        reflects whatever hardware you brought to the job.
      </P>
      <Callout tone="note" title="Browsers can use your graphics chip too">
        Newer browser features narrow that gap. WebCodecs gives video tools the
        device&apos;s hardware video encoder, and WebGPU lets AI tools like our{' '}
        <A href="/blog/remove-background-without-uploading">background remover</A>{' '}
        run on the graphics chip - still without uploading anything.
      </Callout>

      <H2 id="engines">The engines behind each studio</H2>
      <P>
        These are the real engines that run inside your tab on Swift Converter
        Hub, one family per studio:
      </P>
      <DataTable
        caption="Engine used by each studio"
        head={['Studio', 'Engine running in your browser']}
        rows={STUDIOS.map((s) => [<A key={s.id} href={s.href}>{s.name}</A>, s.engine])}
      />

      <H2 id="check">How to tell if a tool is really doing this</H2>
      <P>
        A simple test: open your browser&apos;s network activity panel (in
        Chrome or Firefox&apos;s developer tools, under the &quot;Network&quot;
        tab), then convert a file. If the tool is genuinely browser-based, you
        will see the page and its WebAssembly module load once, and then -
        critically - no new network request containing your file&apos;s data
        when you drop it in or download the result. If you see a request firing
        off to an API endpoint carrying your file, it is uploading it
        somewhere, regardless of what the marketing copy says.
      </P>

      <Figure caption="A simulated Network panel. Try both kinds of tool and press the button to drop a file.">
        <NetworkPanelDemo />
      </Figure>

      <Callout tone="tip" title="Open the Network panel">
        Press <strong>F12</strong> (or <strong>⌘ + Option + I</strong> on a
        Mac) and choose the <strong>Network</strong> tab before you drop a file.
      </Callout>

      <P>
        Every conversion on Swift Converter Hub - across{' '}
        <A href="/image">image</A>, <A href="/audio">audio</A>, and{' '}
        <A href="/video">video</A> tools - works exactly this way, which is why
        the same tools also work with your connection turned off once the page
        has loaded.
      </P>

      <ToolCard toolId="image-convert" cta="See it in action" />

      <P>
        Curious about exactly what is and isn&apos;t collected while you use
        the tools? Our <A href="/privacy">privacy policy</A> spells it out in
        plain language.
      </P>
    </ArticleLayout>
  );
}
