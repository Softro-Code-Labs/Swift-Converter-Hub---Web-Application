import { describe, it, expect } from 'vitest';
import { md5 } from './md5';

// Reference vectors from RFC 1321, Appendix A.5
describe('md5', () => {
  it('hashes the empty string', () => {
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('hashes a single character', () => {
    expect(md5('a')).toBe('0cc175b9c0f1b6a831c399e269772661');
  });

  it('hashes "abc"', () => {
    expect(md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
  });

  it('hashes "message digest"', () => {
    expect(md5('message digest')).toBe('f96b697d7cb7938d525a2f31aaf161d0');
  });

  it('hashes the lowercase alphabet', () => {
    expect(md5('abcdefghijklmnopqrstuvwxyz')).toBe(
      'c3fcd3d76192e4007dfb496cca67e13b',
    );
  });

  it('hashes alphanumerics spanning multiple 512-bit blocks', () => {
    expect(
      md5(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      ),
    ).toBe('d174ab98d277d9f5a5611c2c9f419d9f');
  });

  it('hashes a long repeated-digit string', () => {
    expect(
      md5(
        '12345678901234567890123456789012345678901234567890123456789012345678901234567890',
      ),
    ).toBe('57edf4a22be3c955ac49da2e2107b67a');
  });

  it('produces a 32-character lowercase hex string', () => {
    const hash = md5('any input at all');
    expect(hash).toMatch(/^[0-9a-f]{32}$/);
  });

  it('is deterministic', () => {
    expect(md5('repeatable')).toBe(md5('repeatable'));
  });

  it('produces different hashes for different input', () => {
    expect(md5('foo')).not.toBe(md5('bar'));
  });
});
