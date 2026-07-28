import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64, isJwtToken, inspectJwt } from './useBase64';

describe('encodeBase64 / decodeBase64 round-trip', () => {
  it('round-trips plain ASCII text', () => {
    const encoded = encodeBase64('Hello, world!', false);
    expect(decodeBase64(encoded, false)).toBe('Hello, world!');
  });

  it('round-trips full Unicode text', () => {
    const text = 'こんにちは 🎉 café';
    const encoded = encodeBase64(text, false);
    expect(decodeBase64(encoded, false)).toBe(text);
  });

  it('produces standard base64 with + and / when urlSafe is false', () => {
    // Chosen so the standard alphabet includes a '+' character
    const encoded = encodeBase64('>>>???', false);
    expect(encoded).toContain('+');
  });

  it('produces URL-safe base64 with no +, /, or padding', () => {
    const encoded = encodeBase64('>>>???', true);
    expect(encoded).not.toMatch(/[+/=]/);
  });

  it('round-trips through the URL-safe alphabet', () => {
    const text = 'some text that base64-encodes with padding==';
    const encoded = encodeBase64(text, true);
    expect(decodeBase64(encoded, true)).toBe(text);
  });
});

describe('isJwtToken', () => {
  it('accepts a well-formed three-part token', () => {
    expect(isJwtToken('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.abc123_-')).toBe(
      true,
    );
  });

  it('rejects strings with the wrong number of segments', () => {
    expect(isJwtToken('only.two')).toBe(false);
    expect(isJwtToken('one')).toBe(false);
    expect(isJwtToken('a.b.c.d')).toBe(false);
  });

  it('rejects segments with invalid characters', () => {
    expect(isJwtToken('abc.def!.ghi')).toBe(false);
  });

  it('rejects empty header or payload segments', () => {
    expect(isJwtToken('.payload.sig')).toBe(false);
    expect(isJwtToken('header..sig')).toBe(false);
  });
});

describe('inspectJwt', () => {
  function makeToken(header: object, payload: object) {
    const part = (obj: object) => encodeBase64(JSON.stringify(obj), true);
    return `${part(header)}.${part(payload)}.fakesignature`;
  }

  it('decodes header and payload', () => {
    const token = makeToken(
      { alg: 'HS256', typ: 'JWT' },
      { sub: '1234567890', name: 'Test User' },
    );
    const result = inspectJwt(token);
    expect(result.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect(result.payload).toEqual({ sub: '1234567890', name: 'Test User' });
  });

  it('reports a token as not expired when exp is in the future', () => {
    const futureSeconds = Math.floor(Date.now() / 1000) + 3600;
    const token = makeToken(
      { alg: 'HS256' },
      { sub: '1', exp: futureSeconds },
    );
    const result = inspectJwt(token);
    expect(result.isExpired).toBe(false);
  });

  it('reports a token as expired when exp is in the past', () => {
    const pastSeconds = Math.floor(Date.now() / 1000) - 3600;
    const token = makeToken({ alg: 'HS256' }, { sub: '1', exp: pastSeconds });
    const result = inspectJwt(token);
    expect(result.isExpired).toBe(true);
  });

  it('handles malformed tokens without throwing', () => {
    expect(() => inspectJwt('not.a.jwt')).not.toThrow();
  });
});
