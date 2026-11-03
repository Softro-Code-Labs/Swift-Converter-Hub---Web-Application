import { describe, expect, it } from 'vitest';
import { combineTexts, countWords, tidyText } from './text';

describe('tidyText', () => {
  const raw =
    'The quick brown fox jumps\nover the lazy dog. A long-\nstanding tradition.\n\n\n\nSecond paragraph   \nhere.\n';

  it('keeps lines as they are, tidying blank lines and trailing spaces', () => {
    expect(tidyText(raw, 'lines')).toBe(
      'The quick brown fox jumps\nover the lazy dog. A long-\nstanding tradition.\n\nSecond paragraph\nhere.',
    );
  });

  it('joins wrapped lines into paragraphs and mends split words', () => {
    expect(tidyText(raw, 'paragraphs')).toBe(
      'The quick brown fox jumps over the lazy dog. A longstanding tradition.\n\nSecond paragraph here.',
    );
  });

  it('keeps the hyphen of a compound split before a capital', () => {
    expect(tidyText('Read the Anglo-\nSaxon text', 'paragraphs')).toBe(
      'Read the Anglo-Saxon text',
    );
  });

  it('keeps list items on their own lines', () => {
    expect(
      tidyText('Shopping:\n- milk\n- bread that is\nwholemeal\n2. eggs', 'paragraphs'),
    ).toBe('Shopping:\n- milk\n- bread that is wholemeal\n2. eggs');
  });

  it('joins without spaces for languages written without them', () => {
    expect(tidyText('日本語の\n文章です', 'paragraphs', { noSpaces: true })).toBe(
      '日本語の文章です',
    );
  });

  it('mends split words in other scripts too', () => {
    expect(tidyText('Straßen-\nbahn', 'paragraphs')).toBe('Straßenbahn');
  });

  it('handles Windows line endings and empty input', () => {
    expect(tidyText('a\r\nb', 'paragraphs')).toBe('a b');
    expect(tidyText('  \n\n ', 'paragraphs')).toBe('');
  });
});

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('  one two\nthree ')).toBe(3);
    expect(countWords('')).toBe(0);
  });
});

describe('combineTexts', () => {
  it('returns a single text unchanged', () => {
    expect(combineTexts([{ name: 'a.png', text: 'Hello' }])).toBe('Hello');
  });

  it('puts each file under its name', () => {
    expect(
      combineTexts([
        { name: 'a.png', text: 'One' },
        { name: 'b.jpg', text: 'Two' },
      ]),
    ).toBe('===== a.png =====\n\nOne\n\n\n===== b.jpg =====\n\nTwo');
  });
});
