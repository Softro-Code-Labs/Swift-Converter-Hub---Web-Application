import type { CharCategory } from '../types/unicodeInspector';

// Known invisible / problematic characters
export const INVISIBLE_CHARS: Record<number, string> = {
  0x0000: 'NULL',
  0x0008: 'BACKSPACE',
  0x000b: 'VERTICAL TAB',
  0x000c: 'FORM FEED',
  0x00a0: 'NO-BREAK SPACE',
  0x00ad: 'SOFT HYPHEN',
  0x034f: 'COMBINING GRAPHEME JOINER',
  0x061c: 'ARABIC LETTER MARK',
  0x115f: 'HANGUL CHOSEONG FILLER',
  0x1160: 'HANGUL JUNGSEONG FILLER',
  0x17b4: 'KHMER VOWEL INHERENT AQ',
  0x17b5: 'KHMER VOWEL INHERENT AA',
  0x180b: 'MONGOLIAN FREE VARIATION SELECTOR ONE',
  0x180c: 'MONGOLIAN FREE VARIATION SELECTOR TWO',
  0x180d: 'MONGOLIAN FREE VARIATION SELECTOR THREE',
  0x180e: 'MONGOLIAN VOWEL SEPARATOR',
  0x2000: 'EN QUAD',
  0x2001: 'EM QUAD',
  0x2002: 'EN SPACE',
  0x2003: 'EM SPACE',
  0x2004: 'THREE-PER-EM SPACE',
  0x2005: 'FOUR-PER-EM SPACE',
  0x2006: 'SIX-PER-EM SPACE',
  0x2007: 'FIGURE SPACE',
  0x2008: 'PUNCTUATION SPACE',
  0x2009: 'THIN SPACE',
  0x200a: 'HAIR SPACE',
  0x200b: 'ZERO WIDTH SPACE',
  0x200c: 'ZERO WIDTH NON-JOINER',
  0x200d: 'ZERO WIDTH JOINER',
  0x200e: 'LEFT-TO-RIGHT MARK',
  0x200f: 'RIGHT-TO-LEFT MARK',
  0x2028: 'LINE SEPARATOR',
  0x2029: 'PARAGRAPH SEPARATOR',
  0x202a: 'LEFT-TO-RIGHT EMBEDDING',
  0x202b: 'RIGHT-TO-LEFT EMBEDDING',
  0x202c: 'POP DIRECTIONAL FORMATTING',
  0x202d: 'LEFT-TO-RIGHT OVERRIDE',
  0x202e: 'RIGHT-TO-LEFT OVERRIDE',
  0x202f: 'NARROW NO-BREAK SPACE',
  0x2060: 'WORD JOINER',
  0x2061: 'FUNCTION APPLICATION',
  0x2062: 'INVISIBLE TIMES',
  0x2063: 'INVISIBLE SEPARATOR',
  0x2064: 'INVISIBLE PLUS',
  0x206a: 'INHIBIT SYMMETRIC SWAPPING',
  0x206b: 'ACTIVATE SYMMETRIC SWAPPING',
  0x206c: 'INHIBIT ARABIC FORM SHAPING',
  0x206d: 'ACTIVATE ARABIC FORM SHAPING',
  0x206e: 'NATIONAL DIGIT SHAPES',
  0x206f: 'NOMINAL DIGIT SHAPES',
  0x3000: 'IDEOGRAPHIC SPACE',
  0xfeff: 'BYTE ORDER MARK (BOM)',
  0xffa0: 'HALFWIDTH HANGUL FILLER',
  0x1d159: 'MUSICAL SYMBOL NULL NOTEHEAD',
  0x1d173: 'MUSICAL SYMBOL BEGIN BEAM',
  0xe0000: 'LANGUAGE TAG',
};

// Common named characters
const NAMED_CHARS: Record<number, string> = {
  0x0009: 'TAB',
  0x000a: 'LINE FEED (LF)',
  0x000d: 'CARRIAGE RETURN (CR)',
  0x0020: 'SPACE',
  0x0021: 'EXCLAMATION MARK',
  0x0022: 'QUOTATION MARK',
  0x0023: 'NUMBER SIGN',
  0x0024: 'DOLLAR SIGN',
  0x0025: 'PERCENT SIGN',
  0x0026: 'AMPERSAND',
  0x0027: 'APOSTROPHE',
  0x0028: 'LEFT PARENTHESIS',
  0x0029: 'RIGHT PARENTHESIS',
  0x002a: 'ASTERISK',
  0x002b: 'PLUS SIGN',
  0x002c: 'COMMA',
  0x002d: 'HYPHEN-MINUS',
  0x002e: 'FULL STOP',
  0x002f: 'SOLIDUS (SLASH)',
  0x003a: 'COLON',
  0x003b: 'SEMICOLON',
  0x003c: 'LESS-THAN SIGN',
  0x003d: 'EQUALS SIGN',
  0x003e: 'GREATER-THAN SIGN',
  0x003f: 'QUESTION MARK',
  0x0040: 'COMMERCIAL AT',
  0x005b: 'LEFT SQUARE BRACKET',
  0x005c: 'REVERSE SOLIDUS (BACKSLASH)',
  0x005d: 'RIGHT SQUARE BRACKET',
  0x005e: 'CIRCUMFLEX ACCENT',
  0x005f: 'LOW LINE (UNDERSCORE)',
  0x0060: 'GRAVE ACCENT',
  0x007b: 'LEFT CURLY BRACKET',
  0x007c: 'VERTICAL LINE',
  0x007d: 'RIGHT CURLY BRACKET',
  0x007e: 'TILDE',
  0x00a9: 'COPYRIGHT SIGN',
  0x00ae: 'REGISTERED SIGN',
  0x00b0: 'DEGREE SIGN',
  0x2013: 'EN DASH',
  0x2014: 'EM DASH',
  0x2018: 'LEFT SINGLE QUOTATION MARK',
  0x2019: 'RIGHT SINGLE QUOTATION MARK',
  0x201c: 'LEFT DOUBLE QUOTATION MARK',
  0x201d: 'RIGHT DOUBLE QUOTATION MARK',
  0x2026: 'HORIZONTAL ELLIPSIS',
  0x2122: 'TRADE MARK SIGN',
  0x2665: 'BLACK HEART SUIT',
  0x2713: 'CHECK MARK',
  0x2717: 'BALLOT X',
  ...INVISIBLE_CHARS,
};

export function getCharName(cp: number): string {
  if (NAMED_CHARS[cp]) return NAMED_CHARS[cp];
  if (cp >= 0x0041 && cp <= 0x005a)
    return `LATIN CAPITAL LETTER ${String.fromCodePoint(cp)}`;
  if (cp >= 0x0061 && cp <= 0x007a)
    return `LATIN SMALL LETTER ${String.fromCodePoint(cp)}`;
  if (cp >= 0x0030 && cp <= 0x0039) return `DIGIT ${String.fromCodePoint(cp)}`;
  if (cp >= 0x4e00 && cp <= 0x9fff) return 'CJK UNIFIED IDEOGRAPH';
  if (cp >= 0x1f600 && cp <= 0x1f64f) return 'EMOTICON';
  if (cp >= 0x1f300 && cp <= 0x1f5ff) return 'MISCELLANEOUS SYMBOL';
  if (cp >= 0x1f900 && cp <= 0x1f9ff) return 'SUPPLEMENTAL SYMBOL';
  if (cp >= 0x2600 && cp <= 0x26ff) return 'MISCELLANEOUS SYMBOL';
  if (cp >= 0x2700 && cp <= 0x27bf) return 'DINGBAT';
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

export function getCategory(cp: number, char: string): CharCategory {
  if (INVISIBLE_CHARS[cp] !== undefined) return 'invisible';
  if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) return 'control';

  // Emoji ranges
  if (
    (cp >= 0x1f600 && cp <= 0x1f64f) ||
    (cp >= 0x1f300 && cp <= 0x1f5ff) ||
    (cp >= 0x1f680 && cp <= 0x1f6ff) ||
    (cp >= 0x1f900 && cp <= 0x1f9ff) ||
    (cp >= 0x2600 && cp <= 0x27bf) ||
    (cp >= 0xfe00 && cp <= 0xfe0f) // variation selectors
  )
    return 'emoji';

  if (cp === 0x20 || cp === 0x09 || cp === 0x0a || cp === 0x0d) return 'space';
  if (/\p{L}/u.test(char)) return 'letter';
  if (/\p{N}/u.test(char)) return 'digit';
  if (/\p{P}/u.test(char)) return 'punctuation';
  if (/\p{S}/u.test(char)) return 'symbol';
  return 'other';
}

export function getUtf8Bytes(char: string): string {
  const bytes = new TextEncoder().encode(char);
  return Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');
}
