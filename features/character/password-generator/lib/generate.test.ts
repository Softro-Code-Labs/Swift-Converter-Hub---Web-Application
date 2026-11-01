import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PASSWORD_OPTIONS as D,
  generatePassword,
  validatePassword,
  passwordEntropy,
  generatePassphrase,
  generatePin,
  isCommonPin,
  randomInt,
  crackTime,
  strengthLevel,
  LOOK_ALIKES,
  type PasswordOptions,
} from './generate';

const opts = (o: Partial<PasswordOptions> = {}): PasswordOptions => ({
  ...D,
  ...o,
  sets: { ...D.sets, ...(o.sets ?? {}) },
});

describe('randomInt', () => {
  it('stays in range and covers every value', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 2000; i++) {
      const n = randomInt(7);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(7);
      seen.add(n);
    }
    expect(seen.size).toBe(7);
  });
});

describe('generatePassword', () => {
  it('has the requested length and every enabled type', () => {
    for (let i = 0; i < 200; i++) {
      const p = generatePassword(opts({ length: 12 }));
      expect(p).toHaveLength(12);
      expect(p).toMatch(/[A-Z]/);
      expect(p).toMatch(/[a-z]/);
      expect(p).toMatch(/[0-9]/);
      expect(p).toMatch(/[^A-Za-z0-9]/);
    }
  });

  it('meets minimum numbers and symbols', () => {
    for (let i = 0; i < 100; i++) {
      const p = generatePassword(
        opts({ length: 10, minDigits: 4, minSymbols: 3 }),
      );
      expect(p.replace(/\D/g, '').length).toBeGreaterThanOrEqual(4);
      expect(p.replace(/[A-Za-z0-9]/g, '').length).toBeGreaterThanOrEqual(3);
    }
  });

  it('never uses excluded, look-alike or ambiguous characters', () => {
    for (let i = 0; i < 200; i++) {
      const p = generatePassword(
        opts({
          length: 40,
          excludeLookAlikes: true,
          excludeAmbiguous: true,
          excludeChars: 'xyz',
        }),
      );
      for (const c of LOOK_ALIKES + '{}[]()/\\\'"`~,;:.<>xyz') {
        expect(p).not.toContain(c);
      }
    }
  });

  it('uses only custom symbols when given', () => {
    const p = generatePassword(
      opts({
        length: 64,
        customSymbols: '#!',
        sets: { ...D.sets, upper: false, lower: false, digits: false },
      }),
    );
    expect(p).toMatch(/^[#!]+$/);
  });

  it('can avoid repeats and start with a letter', () => {
    for (let i = 0; i < 200; i++) {
      const p = generatePassword(
        opts({ length: 30, noRepeats: true, startWithLetter: true }),
      );
      expect(new Set(p).size).toBe(30);
      expect(p[0]).toMatch(/[A-Za-z]/);
    }
  });

  it('explains impossible settings', () => {
    expect(
      validatePassword(
        opts({
          sets: { upper: false, lower: false, digits: false, symbols: false },
        }),
      ),
    ).toMatch(/at least one/);
    expect(
      validatePassword(opts({ length: 4, minDigits: 3, minSymbols: 3 })),
    ).toMatch(/longer/);
    expect(
      validatePassword(
        opts({
          length: 20,
          noRepeats: true,
          sets: { upper: false, lower: false, digits: true, symbols: false },
        }),
      ),
    ).toMatch(/repeat/);
    expect(validatePassword(opts({ excludeChars: '0123456789' }))).toMatch(
      /number/,
    );
  });

  it('reports entropy from the pool size', () => {
    // 26 lowercase letters, 10 characters
    const o = opts({
      length: 10,
      sets: { upper: false, lower: true, digits: false, symbols: false },
    });
    expect(passwordEntropy(o)).toBeCloseTo(10 * Math.log2(26), 5);
  });
});

describe('generatePassphrase', () => {
  const list = ['alpha', 'bravo', 'charlie', 'delta'];
  it('joins the right number of words', () => {
    const p = generatePassphrase(
      {
        words: 6,
        separator: '.',
        wordCase: 'lower',
        addNumber: false,
        addSymbol: false,
      },
      list,
    );
    expect(p.split('.')).toHaveLength(6);
    p.split('.').forEach((w) => expect(list).toContain(w));
  });
  it('adds a number and capitalises', () => {
    const p = generatePassphrase(
      {
        words: 4,
        separator: '-',
        wordCase: 'title',
        addNumber: true,
        addSymbol: false,
      },
      list,
    );
    expect(p).toMatch(/\d/);
    p.split('-').forEach((w) => expect(w[0]).toMatch(/[A-Z]/));
  });
});

describe('PINs', () => {
  it('spots common PINs', () => {
    for (const pin of ['1234', '0000', '9876', '1990', '2580', '121212']) {
      expect(isCommonPin(pin)).toBe(true);
    }
    expect(isCommonPin('8401')).toBe(false);
  });
  it('generates digits only, avoiding common ones', () => {
    for (let i = 0; i < 300; i++) {
      const pin = generatePin({ length: 4, avoidCommon: true });
      expect(pin).toMatch(/^\d{4}$/);
      expect(isCommonPin(pin)).toBe(false);
    }
  });
});

describe('strength', () => {
  it('grades by entropy', () => {
    expect(strengthLevel(20)).toBe(0);
    expect(strengthLevel(105)).toBe(4);
  });
  it('describes crack time', () => {
    expect(crackTime(10)).toBe('instantly');
    expect(crackTime(128)).toMatch(/universe/);
    expect(crackTime(50)).toMatch(/day|hour/);
  });
});
