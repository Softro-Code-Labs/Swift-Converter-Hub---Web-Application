'use client';

import { useCallback, useRef } from 'react';
import {
  CLASSIC_PARAGRAPHS,
  CLASSIC_WORDS,
  RANDOM_WORDS,
} from '../data/corpus';
import type { LoremOptions } from '../types/loremIpsum';

// Seeded shuffle so "regenerate" always gives new results
function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildSentence(words: string[], minLen = 6, maxLen = 18): string {
  const len = minLen + Math.floor(Math.random() * (maxLen - minLen));
  const picked = Array.from(
    { length: len },
    () => words[Math.floor(Math.random() * words.length)],
  );
  return capitalize(picked.join(' ')) + '.';
}

function buildParagraph(words: string[], sentenceCount = 4): string {
  const count = sentenceCount + Math.floor(Math.random() * 3); // 4-6 sentences
  return Array.from({ length: count }, () => buildSentence(words)).join(' ');
}

export function useLoremGenerator() {
  // Track call count so re-calling always generates fresh output
  const seedRef = useRef(0);

  const generate = useCallback((opts: LoremOptions): string => {
    seedRef.current++;
    const { type, count, corpus, startWithLorem } = opts;
    const wordPool = corpus === 'classic' ? CLASSIC_WORDS : RANDOM_WORDS;

    if (type === 'words') {
      const words = Array.from(
        { length: count },
        () => wordPool[Math.floor(Math.random() * wordPool.length)],
      );
      if (startWithLorem && corpus === 'classic') {
        words[0] = 'Lorem';
        if (count > 1) words[1] = 'ipsum';
      }
      return capitalize(words.join(' ')) + '.';
    }

    if (type === 'sentences') {
      const sentences = Array.from({ length: count }, () =>
        buildSentence(wordPool),
      );
      if (startWithLorem) {
        sentences[0] =
          corpus === 'classic'
            ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            : 'The quick brown fox jumped over the lazy dog sitting by the fence.';
      }
      return sentences.join(' ');
    }

    // paragraphs
    if (corpus === 'classic') {
      const pool = shuffled(CLASSIC_PARAGRAPHS);
      const parts: string[] = [];
      for (let i = 0; i < count; i++) {
        parts.push(pool[i % pool.length]);
      }
      if (startWithLorem) {
        parts[0] = CLASSIC_PARAGRAPHS[0]; // always start with real Lorem
      }
      return parts.join('\n\n');
    }

    // random paragraphs
    const parts = Array.from({ length: count }, () => buildParagraph(wordPool));
    if (startWithLorem) {
      parts[0] = 'The quick brown fox jumped over the lazy dog. ' + parts[0];
    }
    return parts.join('\n\n');
  }, []);

  return { generate };
}
