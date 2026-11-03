/* ---------------------------------------------------------------------------
   Languages the OCR tool can read. Each one's data file is self-hosted by
   scripts/copy-tesseract.js - keep the two lists in step (languages.test.ts
   checks this).
--------------------------------------------------------------------------- */

export interface OcrLanguage {
  /** Tesseract language code. */
  code: string;
  label: string;
  /** Name in the language itself, shown beside the English one. */
  native?: string;
  /** Latin-script languages read English words fine on their own; the rest
   *  are read together with English, since mixed text is so common. */
  latin: boolean;
  /** Written without spaces between words (Chinese, Japanese). */
  noSpaces?: boolean;
}

export const LANGUAGES: OcrLanguage[] = [
  { code: 'eng', label: 'English', latin: true },
  { code: 'spa', label: 'Spanish', native: 'Español', latin: true },
  { code: 'fra', label: 'French', native: 'Français', latin: true },
  { code: 'deu', label: 'German', native: 'Deutsch', latin: true },
  { code: 'por', label: 'Portuguese', native: 'Português', latin: true },
  { code: 'ita', label: 'Italian', native: 'Italiano', latin: true },
  { code: 'nld', label: 'Dutch', native: 'Nederlands', latin: true },
  { code: 'rus', label: 'Russian', native: 'Русский', latin: false },
  { code: 'sin', label: 'Sinhala', native: 'සිංහල', latin: false },
  { code: 'tam', label: 'Tamil', native: 'தமிழ்', latin: false },
  { code: 'hin', label: 'Hindi', native: 'हिन्दी', latin: false },
  { code: 'ara', label: 'Arabic', native: 'العربية', latin: false },
  {
    code: 'chi_sim',
    label: 'Chinese (Simplified)',
    native: '简体中文',
    latin: false,
    noSpaces: true,
  },
  {
    code: 'jpn',
    label: 'Japanese',
    native: '日本語',
    latin: false,
    noSpaces: true,
  },
  { code: 'kor', label: 'Korean', native: '한국어', latin: false },
];

export const DEFAULT_LANGUAGE = 'eng';

export const getLanguage = (code: string): OcrLanguage =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

/** The Tesseract language string to load, e.g. "sin+eng". The chosen
 *  language goes first so it wins when both could match. */
export function tesseractLangs(code: string): string {
  const lang = getLanguage(code);
  return lang.latin ? lang.code : `${lang.code}+eng`;
}
