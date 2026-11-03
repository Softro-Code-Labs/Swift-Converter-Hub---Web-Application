import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { LANGUAGES, getLanguage, tesseractLangs } from './languages';

describe('tesseractLangs', () => {
  it('reads Latin-script languages on their own', () => {
    expect(tesseractLangs('eng')).toBe('eng');
    expect(tesseractLangs('fra')).toBe('fra');
  });

  it('adds English to other scripts, chosen language first', () => {
    expect(tesseractLangs('sin')).toBe('sin+eng');
    expect(tesseractLangs('chi_sim')).toBe('chi_sim+eng');
  });

  it('falls back to English for unknown codes', () => {
    expect(getLanguage('xyz').code).toBe('eng');
  });
});

describe('self-hosted language data', () => {
  it('copies every language the tool offers, and no others', () => {
    const script = readFileSync(
      join(__dirname, '../../../../scripts/copy-tesseract.js'),
      'utf8',
    );
    const block = script.match(/const LANGS = \[([^\]]*)\]/)![1];
    const copied = [...block.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
    expect([...copied].sort()).toEqual(LANGUAGES.map((l) => l.code).sort());
  });
});
