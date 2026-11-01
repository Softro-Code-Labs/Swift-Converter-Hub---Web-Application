# UI/UX renovation

A site-wide redesign of every page. It covers one visual system, one way to
move around, and one layout pattern per page type. Conversion engines, hooks
and SEO metadata are unchanged.

## Setup

Two font packages were added (`geist`, `@fontsource-variable/bricolage-grotesque`).
Run `npm install` (or `pnpm install`) once to update your lockfile.

The fonts are now self-hosted, so the build no longer fetches Google Fonts and
visitors' browsers never contact Google for type. That fits the
"nothing leaves your device" promise.

## New tool: Image to PDF (`/file/image-to-pdf`)

Combine up to 50 images (JPG, PNG, HEIC, WebP, GIF, BMP, AVIF) into one PDF,
entirely in the browser with pdf-lib.

- Each card previews the actual PDF page: page shape, orientation and margins.
- Reorder by dragging or with arrow buttons, rotate per page, sort by name.
- Page size: A4, Letter or fit-to-image. Orientation: auto, portrait or
  landscape. Margins: none, small or large.
- Quality: "Original" embeds JPG/PNG bytes untouched (lossless). "Smaller
  file" resizes to 2000px and recompresses.
- Phone photos stored sideways (EXIF orientation) come out upright.
- Offered on the home page whenever an image is dropped. It is also listed in
  search, menus, the sitemap and llms.txt.
- Code: `features/file/image-to-pdf/` (layout and EXIF logic have unit tests).

## New tool: Background Remover (`/image/remove-background`)

Removes photo backgrounds with AI that runs in the visitor's browser, so
images are never uploaded. The only downloads are the runtime and model,
both served from this site and cached after the first use.

- **Model:** IS-Net (DIS, Apache-2.0), stored with 8-bit weights. That
  shrinks it from 178 MB to 47 MB, and its masks still match the original
  at 99.8% IoU or better on the test photos.
  - File: `public/models/isnet-general-use-w8-v1.onnx`, licence in
    `NOTICE.txt`.
- **Runtime:** ONNX Runtime Web 1.30.0 (MIT), self-hosted in
  `public/ort/1.30.0/`.
  - Uses WebGPU when the device supports it (about 1 s per photo);
    otherwise WebAssembly on the CPU (about 15 s per photo).
  - Devices without a GPU get the smaller CPU-only build (14 MB).
- **Worker:** `public/workers/remove-background.worker.mjs`, a plain module
  worker that keeps the page responsive. Its output was checked against
  the reference model: 99.9% agreement.
- **UI:** `features/image/remove-background/`
  - Before/after slider.
  - Backgrounds: none, colour (swatches or any colour), blurred original,
    or your own image.
  - Edge crispness and feather controls; crop to the subject with padding.
  - Save as PNG, WebP or JPG; batch of up to 20 with ZIP download.
  - Shows whether it's running on the GPU or the processor, and the time
    per image.
- Full resolution, capped at 16 MP for browser canvas limits. EXIF
  orientation is respected.
- Offered on the home page when an image is dropped.
- Adds about 90 MB to `public/`. Every file is under GitHub's 100 MB limit.

## New tool: Password Generator (`/character/password-generator`)

Added to Text Studio, next to the Hash generator. Text Studio's
"Developer" group is renamed "Developer & security".

- **Three modes:**
  - Random password (4-128 characters).
  - Passphrase from the EFF Large Wordlist (7,776 words, CC BY 3.0). The
    list is loaded only when this mode is used.
  - PIN that skips guessable ones (1234, 1111, years, 2580 and so on).
- **Advanced options:** presets (Strong, Easy to type, Wi-Fi key,
  Maximum); avoid look-alikes; avoid brackets, quotes and slashes; custom
  symbol set; excluded characters; no repeats; start with a letter;
  minimum numbers and symbols. Impossible combinations are explained
  rather than failing silently.
- **Strength meter:** entropy in bits plus time to crack (10 billion
  guesses a second). Digits and symbols are coloured so passwords are
  easier to read back.
- **Bulk:** up to 100 at once, with copy all or `.txt` download.
- **Security:** uses `crypto.getRandomValues` with rejection sampling (no
  modulo bias) and a secure shuffle. Settings are remembered; passwords
  never are.
- **Code:** `features/character/password-generator/`, with 14 unit tests.

Also: the privacy line in every tool header now reads "Runs on your device
- nothing is uploaded" (it used to say "files", which didn't fit text
tools), and the home page description uses the live tool count.

## Faster video tools (GPU / hardware encoding)

FFmpeg compiled to WebAssembly can only use the CPU, because browsers give
WebAssembly no access to the GPU. Browsers do expose the device's hardware
video encoder and decoder through the **WebCodecs** API. Convert, Compress
and Trim now use it first, through `mediabunny` (one new dependency, pinned
at 1.61.4; run `npm install` to update the lockfile).

**Order tried for each file** (`features/video/shared/lib/fastVideo.ts`):
1. **Stream copy**, when the video and audio already suit the target
   (e.g. H.264/AAC MP4 → MOV/MKV). It takes seconds and loses no quality.
2. **Hardware encode** with WebCodecs, for MP4, M4V, MOV, MKV and WebM
   output. It uses the GPU's encoder where the device has one, otherwise
   the browser's native encoder, which is still much faster than WASM.
3. **FFmpeg (WASM)**, which always works. It is used for AVI, WMV, FLV,
   3GP, OGV and MPG output, in browsers without WebCodecs, and whenever
   step 2 can't keep every track. Any failure in steps 1–2 falls back here
   silently.

Results produced by steps 1–2 show an **Accelerated** badge.

**Safeguards**
- MP4/MOV output is limited to H.264/HEVC video and AAC/MP3 audio, so
  files open in QuickTime, iPhones and editors.
- The soundtrack is never dropped. If audio can't be copied or encoded,
  FFmpeg does the job.
- Convert matches the source bitrate, capped at about 9 Mbps for 1080p30
  so a ProRes source doesn't balloon. Compress uses the same size budget
  as the FFmpeg path. If the hardware result isn't smaller than the
  original, FFmpeg redoes it.
- Trim is still frame-accurate: video is re-encoded from the exact start
  frame and audio is copied.

**The FFmpeg path got faster too**
- If the codecs fit the target container, files are stream-copied
  (remuxed) instead of re-encoded (`canRemux` / `getRemuxArgs`).
- WebM (VP8) uses `-deadline good -cpu-used 5`. It is about 4.5x faster
  at the same file size; libvpx's default is tuned for offline mastering.
- Trim seeks before decoding (`-ss` before `-i`), so cutting near the end
  of a long video no longer decodes the whole first part.

**Measured** (20 s 720p H.264/AAC clip, headless Chromium with no GPU, so
software WebCodecs only; real GPUs are faster still):

| Task | Before | FFmpeg path now | Accelerated path |
| --- | --- | --- | --- |
| MP4 → MOV | 32.4 s | 1.0 s (remux) | 0.4 s |
| MP4 → MKV | 31.8 s | 1.0 s (remux) | 3.0 s |
| MP4 → WebM | 93.6 s | 21.7 s | 8.6 s |
| Compress (Balanced) | 30.8 s | 30.8 s | 5.1 s |
| Trim 7 s from mid-clip | 13.1 s | 13.1 s | 4.2 s |

**Not done: multi-threaded FFmpeg.** The multi-threaded ffmpeg.wasm core
needs `SharedArrayBuffer`, which requires cross-origin isolation
(COOP/COEP headers). Those headers block AdSense and other third-party
embeds, so this was not enabled.

## Per-tool review and engineering fixes

Every tool was run end to end with real files (images, phone photos, WAV,
MP3, MP4, multi-page PDFs, DOCX, XLSX, JSON, TOML and text). Each output was
checked with ffprobe, pdfinfo, file inspection or known test vectors, and
the result screenshotted.

**Bugs fixed**
- Batch ZIP downloads silently overwrote files that had the same name
  (`features/shared/lib/zipName.ts`).
- PDF watermarks rotated around the wrong point and drifted off-centre
  (`features/file/pdf-watermark/lib/rotation.ts`).
- Word/Excel to PDF: "Save as PDF" sometimes did nothing, and Word tables
  produced false warnings.
- Adjust Volume (Normalize) changed the sample rate, for example 44.1 kHz
  came out as 48 kHz. It now keeps the original rate.
- EXIF viewer cut off values ("Canon" showed as "("), and its copy buttons
  were invisible on touch and keyboard.
- Unicode Inspector put a button inside a button, which is invalid HTML
  and caused a hydration error.
- Lorem Ipsum caused a hydration error on every load.
- Case Converter split acronyms wrongly (`XMLHttp`).
- Media previews logged "file not found" because a URL was freed while
  still loading.
- Eight icon-only buttons had no accessible name.

**Every tool**
- Layouts now respond to the space the tool actually has (container
  queries), not the window width. Tools no longer get squeezed when ad
  columns are shown.
- With files added, the batch upload area becomes a slim "Add more" row.
- The status line ("2 converted, 1 failed") only appears once there is
  something to report.

## SEO

- New titles and descriptions for every page, led by real search phrases
  ("Compress PDF Online", "JPG to PDF", "Word Counter") and kept within
  Google's limits (title about 60 characters, description 158 or less).
- `lib/seo.ts` gives every page the same complete set: canonical URL, Open
  Graph and Twitter cards.
- Generated share images (`app/og/route.tsx`): every page has a branded
  1200x630 preview for WhatsApp, LinkedIn, Slack and other apps. Before
  this, no page had one.
- Fixed blog titles that repeated the brand name twice.
- robots.txt no longer blocks `/_next/` (CSS/JS), so Google can render
  pages fully.
- The sitemap tool lists now come from `config/tools.ts`, so new tools are
  included automatically.
- Format-pair pages have clearer titles and a "Related conversions" block.
  Internal links point only to curated pairs; the long tail stays noindex.
- Structured data:
  - WebSite SearchAction, so Google can show a site search box. `/?q=` now
    opens the tool search.
  - An ItemList of tools on each studio hub.
  - Free/browser details on SoftwareApplication.
- Web app manifest added. The iPhone home-screen icon and 16px favicon
  were returning 404; they are renamed to Next.js conventions
  (`app/apple-icon.png`, `app/icon.png`).
- The root keyword list was cut from about 170 entries to 11.

## Ads (AdSense)

Rebuilt in `components/ads/AdUnit.tsx` to follow Google's documented
implementation:

- **Standard fixed sizes.** Sidebars are 160x600, or 300x600 from 1536px.
  The top banner is 728x90, 468x60 or 320x100 depending on width. The
  bottom slot uses Google's standard responsive code. Before, sidebars were
  stretched to non-standard widths (178, 238 or 298 px), so they changed
  size as the window narrowed and could be clipped.
- **Ad columns never shrink.** They are exactly as wide as the ad, and the
  tool column takes up the slack.
- **No hidden slots.** Only the unit that fits the current screen is
  rendered. Before, 3-4 hidden slots were requested on every page, which
  caused "availableWidth=0" errors; AdSense also doesn't allow hiding
  fixed-size units.
- **One request per unit.** A fresh request is made after navigation or
  when the screen crosses a size breakpoint, never when nothing has changed.
- **Fixed broken format.** The bottom unit used `autorelax`, an invalid
  format value.
- Space is reserved before the ad loads, so the page doesn't jump.
- Units Google can't fill collapse, using Google's documented CSS.

## New logo: Studio Turbine

Six blades, one per studio colour (image blue, audio emerald, video
fuchsia, documents rose, data amber, text cyan), turning around a single
hub: many converters, one place, in motion.

- **In the UI:** `components/brand/LogoMark.tsx` draws the mark inline. It
  is sharp at any size, switches to brighter blade colours in dark mode,
  and uses heavier blades below 20px. The header and footer wordmark now
  reads **Swift** (extra bold) + Converter Hub (muted).
- **Favicons:** `app/icon.svg` adapts to light or dark browser tabs, with
  `app/icon.png` (32px), `app/favicon.ico` (16/32/48) and
  `app/apple-icon.png` (iPhone home screen) as fallbacks.
- **Installed app / Android:** `public/icon-192.png` and
  `public/icon-512.png`, maskable-safe, are added to the web manifest.
- **Source artwork:** `public/logo.svg`. `public/logo-icon.png` (512px)
  is used by the generated share images and the Organization logo in
  structured data.
- **Share image:** `public/og-image.png` was redesigned around the new
  mark and the six studios.

## Share images per studio

Every page except the home page gets its own generated 1200x630 card
(`app/og/route.tsx`). The URLs are built by `ogImageUrl` in `lib/seo.ts`.
Each studio has its own colour scheme, and the logo lights that studio's
blade with the other five faded.

- **Tool pages** show the tool name and the tool's own one-line
  description.
- **Studio hubs** show the studio name and its first tools, plus "+N
  more".
- **Format-pair pages** (`/video/convert/mov-to-mp4`) show the two
  formats as big tiles: MOV ↓ MP4.
- **Other pages** (About, Blog and so on) use a neutral card with the
  full-colour logo.
- The home page keeps the designed `public/og-image.png`.

All 190 sitemap pages were checked: each has its own card. New tools pick
up the design automatically.

## Brand assets (public/)

- Restored `public/logo-icon.png`, `public/og-image.png` and the IndexNow
  key file (`public/4ab186f067194e6491217b37e120f6ee.txt`).
- The logo now appears in the header and footer (shown on its own at
  30px; the mark works on light and dark), and in every generated share
  image.
- `og-image.png` is the share image for the home page and the site-wide
  default. Tool, studio and blog pages keep their own generated images
  with the real logo.
- The brand blue was re-tuned to match the logo's azure (OKLCH hue 256,
  was 268), so buttons and links sit with the logo instead of leaning
  violet.

## Where things live now

| What | File |
| --- | --- |
| **Every studio and tool** (names, descriptions, icons, groups, search keywords, "popular" flag) | `config/tools.ts` |
| Studio colours (one hue per studio) | `config/studio-theme.ts` |
| Colour tokens, type, focus ring, prose styles | `app/globals.css` |
| Header, "All tools" menu, mobile drawer | `components/Navbar.tsx` |
| Site-wide search (Ctrl/⌘ K or `/`) | `components/shell/CommandMenu.tsx` |
| In-studio tool tabs + "More in this studio" | `components/shell/StudioNav.tsx` |
| Studio frame (tool rail → workspace → related tools, ads) | `components/ads/StudioAdLayout.tsx` |
| Tool page header (used by every tool) | `features/shared/components/page-sections/ToolPageHeader.tsx` |
| Drop zone used by every tool | `features/shared/components/DropZoneSurface.tsx` |
| Home → tool file handoff | `features/shared/lib/fileHandoff.ts` |
| Content page header, legal layout, blog list | `components/site/*` |

**To add a tool:** add one entry to `TOOLS` in `config/tools.ts`. It then
appears in the header menu, mobile drawer, search, studio hub, tool rail,
related tools and home directory automatically.

## What changed for visitors

**Finding tools**
- Search across all 43 tools from any page (Ctrl/⌘ K or `/`), with
  "Recently used" tools remembered in the browser.
- "All tools" opens a full directory of every studio and tool, instead of a
  list of six studios.
- Every tool page has a sticky tab bar of its sibling tools, so you can move
  from Compress to Crop without going back to the hub.
- Every tool page ends with "More in this studio".
- The mobile menu lists every tool, grouped by studio.

**Using tools**
- Drop a file on the home page and pick a tool. The tool opens with the file
  already loaded, so you don't choose it twice. This works for images, audio,
  video, PDFs, Word/Excel, JSON and TOML. On the image format picker, the
  source format is pre-selected.
- One drop zone design everywhere, with a clear "Choose file" button. It
  works with Enter/Space. The old zones were not keyboard-operable.
- 28 tools (all PDF, Data and Text tools) used to render a second page
  inside the page: a back link, a duplicate title and a grey background.
  That is removed.
- Primary buttons, selected options and focus rings use one brand colour in
  every tool. Colours that carry meaning are kept (diff red/green, match
  highlights, Unicode categories).
- The "Engine ready" banner only appears while an engine is loading.

**Reading**
- Text that was 9 to 11px is now 11 to 13px. All-caps tracked labels are
  now sentence case.
- Mid-grey text was darkened for contrast, so secondary text is readable.
- FAQs use native `<details>`: accessible, several can be open at once.
- Long technical notes collapse behind "Read more".
- Legal pages have an "On this page" contents list. Blog posts use a reading
  measure and list related articles at the end.

**Pages rebuilt:** home, 6 studio hubs (no longer a card inside a card),
3 format pickers, every format-pair page, About, Contact (labels now linked
to fields, inputs no longer zoom on iPhone), Blog, Privacy, Terms, 404 and
the cookie banner.

## Naming

- "Character Studio" is shown as **Text Studio** (URLs unchanged at
  `/character`). To revert, edit `name` for `character` in `config/tools.ts`.

## Bug fixed along the way

- Lorem Ipsum generated random text during server render, which caused a
  hydration error on every load.

## Removed

`StudioSpotlight` (rotating header pill, replaced by search),
`LaboratoryModules` (replaced by `components/site/StudioDirectory`), and the
old per-studio card components (`StudioHero`, `StudioFeaturedCard`, and so on),
now replaced by the registry-driven hub.
