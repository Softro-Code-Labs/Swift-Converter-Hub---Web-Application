'use client';

import { useMemo } from 'react';
import type { TextStats } from '../types/wordCounter';

const READING_WPM = 238;
const SPEAKING_WPM = 130;

const STOP_WORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'shall',
  'can',
  'this',
  'that',
  'these',
  'those',
  'it',
  'its',
  'i',
  'you',
  'he',
  'she',
  'we',
  'they',
  'my',
  'your',
  'his',
  'her',
  'our',
  'their',
  'not',
  'no',
  'so',
  'if',
  'as',
  'by',
  'from',
  'up',
  'out',
  'about',
  'into',
  'than',
  'then',
  'when',
  'where',
  'who',
  'how',
  'what',
  'which',
  'there',
  'here',
  'all',
  'just',
  'more',
  'also',
  'some',
  'any',
  'each',
]);

function formatMinutes(minutes: number): string {
  if (minutes < 1) return '< 1 min';
  return `${Math.round(minutes)} min`;
}

export function useTextStats(text: string): TextStats {
  return useMemo(() => {
    if (!text.trim()) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: '0 min',
        speakingTime: '0 min',
        avgWordLength: 0,
        longestWord: '',
        topKeywords: [],
      };
    }

    const wordList = text.trim().split(/\s+/).filter(Boolean);
    const words = wordList.length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    const sentences =
      (text.match(/[^.!?]*[.!?]+/g) ?? []).length ||
      (text.trim().length > 0 ? 1 : 0);

    const paragraphs =
      text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length ||
      (text.trim().length > 0 ? 1 : 0);

    const readingTime = formatMinutes(words / READING_WPM);
    const speakingTime = formatMinutes(words / SPEAKING_WPM);

    const cleanWords = wordList.map((w) => w.replace(/[^a-zA-Z]/g, ''));
    const totalLetters = cleanWords.reduce((sum, w) => sum + w.length, 0);
    const avgWordLength =
      words > 0 ? Math.round((totalLetters / words) * 10) / 10 : 0;

    const longestWord = cleanWords.reduce(
      (longest, w) => (w.length > longest.length ? w : longest),
      '',
    );

    const freq: Record<string, number> = {};
    for (const w of cleanWords) {
      const key = w.toLowerCase();
      if (key.length >= 3 && !STOP_WORDS.has(key)) {
        freq[key] = (freq[key] ?? 0) + 1;
      }
    }
    const topKeywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
      avgWordLength,
      longestWord,
      topKeywords,
    };
  }, [text]);
}
