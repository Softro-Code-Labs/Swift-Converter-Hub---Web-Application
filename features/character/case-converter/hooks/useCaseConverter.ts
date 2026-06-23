'use client';

import { useMemo } from 'react';
import type { CaseId } from '../types/caseConverter';

// handles spaces, snake_case, kebab-case, camelCase, PascalCase
function toWords(text: string): string[] {
  return (
    text
      // insert space before uppercase letters in camel/pascal
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // replace separators with spaces
      .replace(/[-_.\s]+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
  );
}

function toTitleCase(words: string[]): string {
  const MINORS = new Set([
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'for',
    'nor',
    'on',
    'at',
    'to',
    'by',
    'in',
    'of',
    'up',
    'as',
    'is',
  ]);
  return words
    .map((w, i) =>
      i === 0 || !MINORS.has(w.toLowerCase())
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w.toLowerCase(),
    )
    .join(' ');
}

function toSentenceCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
}

function toAlternating(text: string): string {
  let upper = false;
  return text
    .split('')
    .map((c) => {
      if (c.match(/[a-zA-Z]/)) {
        const result = upper ? c.toUpperCase() : c.toLowerCase();
        upper = !upper;
        return result;
      }
      return c;
    })
    .join('');
}

function toInverse(text: string): string {
  return text
    .split('')
    .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
    .join('');
}

export function convertCase(text: string, caseId: CaseId): string {
  if (!text) return '';
  const words = toWords(text);

  switch (caseId) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return toTitleCase(words);
    case 'sentence':
      return toSentenceCase(text);
    case 'camel':
      return words
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
        )
        .join('');
    case 'pascal':
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join('');
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-');
    case 'constant':
      return words.map((w) => w.toUpperCase()).join('_');
    case 'dot':
      return words.map((w) => w.toLowerCase()).join('.');
    case 'alternating':
      return toAlternating(text);
    case 'inverse':
      return toInverse(text);
    default:
      return text;
  }
}

export function useCaseConverter(text: string, activeCase: CaseId): string {
  return useMemo(() => convertCase(text, activeCase), [text, activeCase]);
}
