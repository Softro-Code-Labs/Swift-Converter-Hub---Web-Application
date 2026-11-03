/* ---------------------------------------------------------------------------
   Turning raw OCR output into text people want to paste somewhere.

   Tesseract keeps the line breaks of the image, which is right for receipts,
   code and tables but awkward for prose: a paragraph copied out of a scanned
   page arrives broken every few words. "Paragraphs" layout joins those
   lines back up and mends words hyphenated across a line break.
--------------------------------------------------------------------------- */

export type TextLayout = 'lines' | 'paragraphs';

/** A line that starts a list item keeps its own line when joining. */
const LIST_ITEM = /^(?:[•·▪◦‣*–-]|\d{1,3}[.)]|[a-z][.)])\s/i;

/** "exam-" at the end of a line followed by "ple" on the next. */
const SPLIT_WORD = /\p{L}-$/u;
const STARTS_LOWER = /^\p{Ll}/u;

function joinLines(lines: string[], noSpaces: boolean): string {
  let out = '';
  for (const line of lines) {
    if (!out) {
      out = line;
    } else if (LIST_ITEM.test(line)) {
      out += `\n${line}`;
    } else if (SPLIT_WORD.test(out)) {
      // "exam-" + "ple" was one word split by the line break; before a
      // capital ("Anglo-" + "Saxon") the hyphen is part of the word.
      out = STARTS_LOWER.test(line) ? out.slice(0, -1) + line : out + line;
    } else {
      out += (noSpaces ? '' : ' ') + line;
    }
  }
  return out;
}

export function tidyText(
  raw: string,
  layout: TextLayout,
  { noSpaces = false }: { noSpaces?: boolean } = {},
): string {
  const lines = raw
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''));

  // Group into paragraphs at blank lines.
  const paragraphs: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    if (line.trim()) {
      current.push(line);
    } else if (current.length) {
      paragraphs.push(current);
      current = [];
    }
  }
  if (current.length) paragraphs.push(current);

  return paragraphs
    .map((p) =>
      layout === 'paragraphs'
        ? joinLines(
            p.map((l) => l.trim()),
            noSpaces,
          )
        : p.join('\n'),
    )
    .join('\n\n');
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Every file's text in one document, each under its file name. */
export function combineTexts(parts: { name: string; text: string }[]): string {
  if (parts.length === 1) return parts[0].text;
  return parts
    .map(({ name, text }) => `===== ${name} =====\n\n${text}`)
    .join('\n\n\n');
}
