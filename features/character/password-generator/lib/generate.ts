/* ---------------------------------------------------------------------------
   Password, passphrase and PIN generation.

   All randomness comes from crypto.getRandomValues (the browser's
   cryptographically secure generator). Picks use rejection sampling, so
   every character / word is exactly equally likely - a plain `% n` would
   favour some characters slightly. Nothing is stored or sent anywhere.
--------------------------------------------------------------------------- */

export const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/~',
} as const;

export type CharsetId = keyof typeof CHARSETS;

/** Characters that are easy to confuse when read or typed: I l 1 | O 0 o. */
export const LOOK_ALIKES = 'Il1|O0o';
/** Symbols that break or confuse many forms, shells and keyboards. */
export const AMBIGUOUS_SYMBOLS = '{}[]()/\\\'"`~,;:.<>';

/** Uniform random integer in [0, max). */
export function randomInt(max: number): number {
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) {
    throw new RangeError(`randomInt: invalid range ${max}`);
  }
  // Largest multiple of `max` that fits in 32 bits; values above it are
  // rejected so every result has the same probability.
  const limit = Math.floor(2 ** 32 / max) * max;
  const buf = new Uint32Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % max;
  }
}

export function pick<T>(items: ArrayLike<T>): T {
  return items[randomInt(items.length)];
}

/** Fisher-Yates shuffle with secure randomness (in place). */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Random passwords --------------------------------------------------------

export interface PasswordOptions {
  length: number;
  sets: Record<CharsetId, boolean>;
  /** Replaces the default symbol set when not empty. */
  customSymbols: string;
  excludeLookAlikes: boolean;
  excludeAmbiguous: boolean;
  /** Any characters typed here never appear. */
  excludeChars: string;
  /** Every character appears at most once. */
  noRepeats: boolean;
  startWithLetter: boolean;
  minDigits: number;
  minSymbols: number;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  sets: { upper: true, lower: true, digits: true, symbols: true },
  customSymbols: '',
  excludeLookAlikes: false,
  excludeAmbiguous: false,
  excludeChars: '',
  noRepeats: false,
  startWithLetter: false,
  minDigits: 1,
  minSymbols: 1,
};

const unique = (s: string) => [...new Set([...s])].join('');

/** The characters each enabled set will actually draw from. */
export function resolvePools(o: PasswordOptions): Record<CharsetId, string> {
  const removed = new Set([
    ...o.excludeChars,
    ...(o.excludeLookAlikes ? LOOK_ALIKES : ''),
    ...(o.excludeAmbiguous ? AMBIGUOUS_SYMBOLS : ''),
  ]);
  const symbols = o.customSymbols.trim()
    ? unique(o.customSymbols.replace(/\s/g, ''))
    : CHARSETS.symbols;
  const keep = (s: string) => [...s].filter((c) => !removed.has(c)).join('');
  return {
    upper: o.sets.upper ? keep(CHARSETS.upper) : '',
    lower: o.sets.lower ? keep(CHARSETS.lower) : '',
    digits: o.sets.digits ? keep(CHARSETS.digits) : '',
    symbols: o.sets.symbols ? keep(symbols) : '',
  };
}

/** Why these options can't produce a password, or null if they can. */
export function validatePassword(o: PasswordOptions): string | null {
  const pools = resolvePools(o);
  const all = unique(Object.values(pools).join(''));
  if (!all) return 'Turn on at least one character type.';
  const enabled = (Object.keys(pools) as CharsetId[]).filter((k) => o.sets[k]);
  const empty = enabled.find((k) => !pools[k]);
  if (empty) return `Every ${LABELS[empty]} character is excluded.`;
  const required =
    enabled.length -
    (o.sets.digits ? 1 : 0) -
    (o.sets.symbols ? 1 : 0) +
    (o.sets.digits ? Math.max(1, o.minDigits) : 0) +
    (o.sets.symbols ? Math.max(1, o.minSymbols) : 0);
  if (required > o.length) {
    return `The minimums need ${required} characters - make the password longer.`;
  }
  if (o.noRepeats && all.length < o.length) {
    return `Only ${all.length} different characters are available, so a ${o.length}-character password must repeat some.`;
  }
  if (o.startWithLetter && !pools.upper && !pools.lower) {
    return 'Starting with a letter needs letters turned on.';
  }
  return null;
}

const LABELS: Record<CharsetId, string> = {
  upper: 'uppercase',
  lower: 'lowercase',
  digits: 'number',
  symbols: 'symbol',
};

export function generatePassword(o: PasswordOptions): string {
  const problem = validatePassword(o);
  if (problem) throw new Error(problem);
  const pools = resolvePools(o);
  const used = new Set<string>();
  const take = (pool: string) => {
    const available = o.noRepeats
      ? [...pool].filter((c) => !used.has(c))
      : [...pool];
    if (!available.length) throw new Error('Ran out of unique characters.');
    const c = pick(available);
    used.add(c);
    return c;
  };

  // Guarantee every enabled type (and the minimums) appears.
  const chars: string[] = [];
  for (const id of Object.keys(pools) as CharsetId[]) {
    if (!o.sets[id]) continue;
    const n =
      id === 'digits'
        ? Math.max(1, o.minDigits)
        : id === 'symbols'
          ? Math.max(1, o.minSymbols)
          : 1;
    for (let i = 0; i < n; i++) chars.push(take(pools[id]));
  }
  const all = unique(Object.values(pools).join(''));
  while (chars.length < o.length) chars.push(take(all));
  shuffle(chars);

  if (o.startWithLetter && !/[A-Za-z]/.test(chars[0])) {
    const letters = chars
      .map((c, i) => (/[A-Za-z]/.test(c) ? i : -1))
      .filter((i) => i >= 0);
    if (letters.length) {
      const j = pick(letters);
      [chars[0], chars[j]] = [chars[j], chars[0]];
    } else {
      // No letter was drawn: replace the first character with one.
      used.delete(chars[0]);
      chars[0] = take(pools.upper + pools.lower);
    }
  }
  return chars.join('');
}

/** Entropy in bits: how many guesses an attacker needs, as a power of 2. */
export function passwordEntropy(o: PasswordOptions): number {
  const size = unique(Object.values(resolvePools(o)).join('')).length;
  if (size < 2) return 0;
  if (o.noRepeats) {
    let bits = 0;
    for (let i = 0; i < o.length; i++) bits += Math.log2(Math.max(1, size - i));
    return bits;
  }
  return o.length * Math.log2(size);
}

// --- Passphrases -------------------------------------------------------------

export type WordCase = 'lower' | 'title' | 'upper' | 'random';

export interface PassphraseOptions {
  words: number;
  separator: string;
  wordCase: WordCase;
  /** Add one random digit after a random word. */
  addNumber: boolean;
  /** Add one random symbol after a random word. */
  addSymbol: boolean;
}

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  words: 5,
  separator: '-',
  wordCase: 'title',
  addNumber: true,
  addSymbol: false,
};

const PHRASE_SYMBOLS = '!@#$%&*?';

export function generatePassphrase(
  o: PassphraseOptions,
  wordlist: readonly string[],
): string {
  const words = Array.from({ length: o.words }, () => {
    const w = pick(wordlist);
    switch (o.wordCase) {
      case 'upper':
        return w.toUpperCase();
      case 'title':
        return w[0].toUpperCase() + w.slice(1);
      case 'random':
        return randomInt(2) ? w.toUpperCase() : w;
      default:
        return w;
    }
  });
  if (o.addNumber) words[randomInt(words.length)] += String(randomInt(10));
  if (o.addSymbol) words[randomInt(words.length)] += pick(PHRASE_SYMBOLS);
  return words.join(o.separator);
}

export function passphraseEntropy(o: PassphraseOptions, listSize: number) {
  let bits = o.words * Math.log2(listSize);
  if (o.wordCase === 'random') bits += o.words;
  // The extra character and where it goes.
  if (o.addNumber) bits += Math.log2(10) + Math.log2(o.words);
  if (o.addSymbol)
    bits += Math.log2(PHRASE_SYMBOLS.length) + Math.log2(o.words);
  return bits;
}

// --- PINs --------------------------------------------------------------------

export interface PinOptions {
  length: number;
  /** Reject PINs people guess first: 1234, 1111, 2580, years 19xx/20xx... */
  avoidCommon: boolean;
}

export const DEFAULT_PIN_OPTIONS: PinOptions = { length: 6, avoidCommon: true };

export function isCommonPin(pin: string): boolean {
  if (/^(\d)\1+$/.test(pin)) return true; // 0000, 1111
  const asc = '01234567890123456789';
  const desc = '98765432109876543210';
  if (asc.includes(pin) || desc.includes(pin)) return true; // 1234, 9876
  if (pin.length === 4 && /^(19|20)\d\d$/.test(pin)) return true; // a year
  if (/^(\d\d)\1+$/.test(pin)) return true; // 1212, 121212
  if (['2580', '0852', '1004', '7777', '5683', '0007'].includes(pin))
    return true;
  return false;
}

export function generatePin(o: PinOptions): string {
  for (;;) {
    const pin = Array.from({ length: o.length }, () => randomInt(10)).join('');
    if (!o.avoidCommon || !isCommonPin(pin)) return pin;
  }
}

export const pinEntropy = (o: PinOptions) => o.length * Math.log2(10);

// --- Strength ----------------------------------------------------------------

export type StrengthLevel = 0 | 1 | 2 | 3 | 4;

export const STRENGTH_LABELS = [
  'Very weak',
  'Weak',
  'Fair',
  'Strong',
  'Very strong',
] as const;

export function strengthLevel(bits: number): StrengthLevel {
  if (bits < 28) return 0;
  if (bits < 40) return 1;
  if (bits < 60) return 2;
  if (bits < 80) return 3;
  return 4;
}

/** Guesses per second for an offline attack on a fast hash with GPUs. */
export const GUESSES_PER_SECOND = 1e10;

/** Average time to guess, as readable text ("3 hours", "centuries"). */
export function crackTime(bits: number): string {
  const seconds = 2 ** (bits - 1) / GUESSES_PER_SECOND;
  if (seconds < 1) return 'instantly';
  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [365, 'day'],
    [1000, 'year'],
  ];
  let value = seconds;
  for (const [size, name] of units) {
    if (value < size) {
      const n = Math.max(1, Math.round(value));
      return `${n} ${name}${n === 1 ? '' : 's'}`;
    }
    value /= size;
  }
  // value is now in thousands of years
  if (value < 1000) return `${Math.round(value)} thousand years`;
  if (value < 1e6) return `${Math.round(value / 1000)} million years`;
  if (value < 13.8e6) return `${Math.round(value / 1e6)} billion years`;
  return 'longer than the age of the universe';
}
