'use client';

import { useMemo } from 'react';

export interface TextStats {
  words: number;
  characters: number; // with spaces
  charactersNoSpaces: number; // without spaces
  sentences: number;
  paragraphs: number;
  readingTime: string; // e.g. "2 min read"
  speakingTime: string; // e.g. "3 min"
  avgWordLength: number;
  longestWord: string;
  topKeywords: { word: string; count: number }[];
}

const READING_WPM = 238;
const SPEAKING_WPM = 130;

// Common English stop words to exclude from keyword density
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
  const m = Math.round(minutes);
  return `${m} min`;
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

    // Words: split on whitespace, filter empty
    const wordList = text.trim().split(/\s+/).filter(Boolean);
    const words = wordList.length;

    // Characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Sentences: split on . ! ? followed by whitespace or end
    const sentences =
      (text.match(/[^.!?]*[.!?]+/g) ?? []).length ||
      (text.trim().length > 0 ? 1 : 0);

    // Paragraphs: split on double newline
    const paragraphs =
      text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length ||
      (text.trim().length > 0 ? 1 : 0);

    // Reading / speaking times
    const readingTime = formatMinutes(words / READING_WPM);
    const speakingTime = formatMinutes(words / SPEAKING_WPM);

    // Avg word length (alpha chars per word)
    const cleanWords = wordList.map((w) => w.replace(/[^a-zA-Z]/g, ''));
    const totalLetters = cleanWords.reduce((sum, w) => sum + w.length, 0);
    const avgWordLength =
      words > 0 ? Math.round((totalLetters / words) * 10) / 10 : 0;

    // Longest word
    const longestWord = cleanWords.reduce(
      (longest, w) => (w.length > longest.length ? w : longest),
      '',
    );

    // Top keywords (exclude stop words, min 3 chars)
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
