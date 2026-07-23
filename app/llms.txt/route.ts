import { SITE_URL, SITE_NAME } from '@/config/site';

/**
 * llms.txt - https://llmstxt.org
 *
 * An emerging convention alongside robots.txt: instead of controlling
 * crawler access, it gives LLMs a curated map of the site's highest-value
 * pages. Served as a live route (not a static file) so it stays in sync
 * with SITE_URL/SITE_NAME automatically.
 *
 * Deliberately excludes a per-page llms-full.txt mirror, which would
 * duplicate the real HTML pages for little benefit.
 */

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${SITE_NAME}`);
  lines.push('');
  lines.push(
    `> ${SITE_NAME} is a free, browser-based file conversion and utility toolkit. Every tool - image, audio, video, PDF, data, and text - runs entirely client-side using WebAssembly and in-browser JavaScript engines. Files are never uploaded to a server: there is no backend processing step, no account, and no file size or usage limit.`,
  );
  lines.push('');
  lines.push(
    `${SITE_NAME} is not a wrapper around a cloud API. Conversions run locally in the visitor's own browser tab using WebAssembly ports of established engines (ImageMagick, FFmpeg) plus native browser/JS libraries for PDF, spreadsheet, and text processing. This is stated here directly because it materially changes the privacy and reliability characteristics visitors should expect compared to typical "upload and convert" web tools.`,
  );
  lines.push('');

  lines.push('## Image Studio');
  lines.push(
    `- [Image format converter](${SITE_URL}/image/convert): Convert between 150+ image formats (JPG, PNG, WebP, AVIF, HEIC, SVG, TIFF, RAW camera formats, and more), entirely in the browser.`,
  );
  lines.push(
    `- [Compress & optimize images](${SITE_URL}/image/compress): Reduce image file size with adjustable quality presets.`,
  );
  lines.push(
    `- [Crop & resize images](${SITE_URL}/image/crop): Visual crop tool with aspect-ratio locking and exact pixel dimensions.`,
  );
  lines.push(
    `- [Adjust & filter images](${SITE_URL}/image/adjust): Brightness, contrast, saturation, and one-tap photo filters.`,
  );
  lines.push(
    `- [EXIF metadata viewer](${SITE_URL}/image/metadata): Inspect and strip camera/GPS metadata embedded in photos.`,
  );
  lines.push(
    `- [Image to Base64 converter](${SITE_URL}/image/base64): Encode images as Base64/Data URI strings, or decode back to an image.`,
  );
  lines.push('');

  lines.push('## Audio Studio');
  lines.push(
    `- [Audio format converter](${SITE_URL}/audio/convert): Convert between 12 audio formats (MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, AIFF, AC3, AU, MP2).`,
  );
  lines.push(
    `- [Trim audio](${SITE_URL}/audio/trim): Cut a clip from an audio file by start/end time.`,
  );
  lines.push(
    `- [Merge audio files](${SITE_URL}/audio/merge): Combine multiple audio files into one, in any order.`,
  );
  lines.push(
    `- [Compress audio](${SITE_URL}/audio/compress): Reduce audio file size by re-encoding at a lower bitrate.`,
  );
  lines.push(
    `- [Adjust audio volume](${SITE_URL}/audio/volume): Boost, lower, or auto-normalize loudness.`,
  );
  lines.push('');

  lines.push('## Video Studio');
  lines.push(
    `- [Video format converter](${SITE_URL}/video/convert): Convert between 12 video formats (MP4, WEBM, MOV, AVI, MKV, M4V, 3GP, FLV, TS, WMV, OGV, MPG).`,
  );
  lines.push(
    `- [Trim video](${SITE_URL}/video/trim): Cut a clip from a video file by start/end time.`,
  );
  lines.push(
    `- [Compress video](${SITE_URL}/video/compress): Reduce video file size with resolution and quality presets.`,
  );
  lines.push(
    `- [Extract audio from video](${SITE_URL}/video/extract-audio): Save a video's audio track as MP3, WAV, or another audio format.`,
  );
  lines.push(
    `- [Video to GIF](${SITE_URL}/video/to-gif): Turn a video clip into an animated GIF.`,
  );
  lines.push('');

  lines.push('## Document Suite (PDF & Office)');
  lines.push(
    `- [Word/Excel to PDF](${SITE_URL}/file/office-to-pdf): Convert .docx and .xlsx files to PDF.`,
  );
  lines.push(
    `- [PDF to Word converter](${SITE_URL}/file/pdf-to-word): Reflow a PDF's text into an editable .docx with automatic heading/paragraph detection (text-only; does not perform OCR on scanned PDFs).`,
  );
  lines.push(
    `- [Merge PDF](${SITE_URL}/file/pdf-merge): Combine multiple PDF files into one.`,
  );
  lines.push(
    `- [Split PDF](${SITE_URL}/file/pdf-split): Extract or separate pages from a PDF.`,
  );
  lines.push(
    `- [Compress PDF](${SITE_URL}/file/pdf-compress): Reduce PDF file size by recompressing embedded images and stripping metadata.`,
  );
  lines.push(
    `- [Rotate PDF](${SITE_URL}/file/pdf-rotate): Rotate one or all pages in a PDF.`,
  );
  lines.push(
    `- [Watermark PDF](${SITE_URL}/file/pdf-watermark): Add a text or image watermark to a PDF.`,
  );
  lines.push('');

  lines.push('## Data Studio');
  lines.push(
    `- [CSV to/from JSON](${SITE_URL}/data/csv-json): Convert tabular CSV data to JSON and back.`,
  );
  lines.push(
    `- [Excel to/from JSON](${SITE_URL}/data/excel-json): Convert .xlsx spreadsheets to JSON and back.`,
  );
  lines.push(
    `- [JSON formatter/validator](${SITE_URL}/data/json-formatter): Pretty-print, minify, and validate JSON.`,
  );
  lines.push(
    `- [JSON to/from XML](${SITE_URL}/data/json-xml): Convert between JSON and XML.`,
  );
  lines.push(
    `- [YAML to/from JSON](${SITE_URL}/data/yaml-json): Convert between YAML and JSON (e.g. Kubernetes manifests, CI config).`,
  );
  lines.push(
    `- [TOML to/from JSON](${SITE_URL}/data/toml-json): Convert between TOML and JSON (e.g. Cargo.toml, pyproject.toml).`,
  );
  lines.push(
    `- [Base64 text encoder/decoder](${SITE_URL}/data/base64-text): Encode/decode text as Base64, including JWT decoding.`,
  );
  lines.push('');

  lines.push('## Character Studio (text tools)');
  lines.push(
    `- [Word & character counter](${SITE_URL}/character/word-counter): Count words, characters, and estimate reading time.`,
  );
  lines.push(
    `- [Case converter](${SITE_URL}/character/case-converter): Convert text between UPPERCASE, lowercase, Title Case, camelCase, and more.`,
  );
  lines.push(
    `- [Text diff viewer](${SITE_URL}/character/text-diff): Compare two blocks of text and highlight differences.`,
  );
  lines.push(
    `- [Find & replace](${SITE_URL}/character/find-replace): Batch find/replace across multi-line text, including regex.`,
  );
  lines.push(
    `- [Regex tester](${SITE_URL}/character/regex-tester): Test regular expressions against sample text with live match highlighting.`,
  );
  lines.push(
    `- [Hash generator](${SITE_URL}/character/hash-generator): Generate MD5, SHA-1, SHA-256, and SHA-512 hashes (with optional HMAC).`,
  );
  lines.push(
    `- [Text sorter & deduplicator](${SITE_URL}/character/text-sorter): Sort, deduplicate, shuffle, or reverse lines of text.`,
  );
  lines.push(
    `- [URL encoder/decoder](${SITE_URL}/character/url-encoder): Encode/decode URLs and parse query strings.`,
  );
  lines.push(
    `- [Unicode inspector](${SITE_URL}/character/unicode-inspector): Look up a character's Unicode code point, name, and UTF-8 bytes.`,
  );
  lines.push(
    `- [Number base converter](${SITE_URL}/character/number-base): Convert numbers between binary, octal, decimal, and hexadecimal.`,
  );
  lines.push(
    `- [Markdown previewer](${SITE_URL}/character/markdown-preview): Render Markdown to live HTML.`,
  );
  lines.push(
    `- [Lorem ipsum generator](${SITE_URL}/character/lorem-ipsum): Generate placeholder text by word, sentence, or paragraph.`,
  );
  lines.push('');

  lines.push('## Optional');
  lines.push(
    `- [About](${SITE_URL}/about): What ${SITE_NAME} is, why it exists, and how the browser-based/WebAssembly processing model works.`,
  );
  lines.push(
    `- [Privacy policy](${SITE_URL}/privacy): Data handling policy - no file uploads, no server-side storage of user files.`,
  );
  lines.push(`- [Terms of use](${SITE_URL}/terms)`);
  lines.push(`- [Contact](${SITE_URL}/contact)`);

  return lines.join('\n') + '\n';
}

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
