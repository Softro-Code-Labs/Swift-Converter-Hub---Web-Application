'use client';

import { useMemo } from 'react';
import type { Base64Options, Base64Result, JwtPayload } from '../types/base64';

// --- Helpers ------------------------------------------------------------------

function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromUrlSafe(b64: string): string {
  let s = b64.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}

export function encodeBase64(text: string, urlSafe: boolean): string {
  // Use TextEncoder to handle full Unicode correctly
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes)
    .map((b) => String.fromCharCode(b))
    .join('');
  const b64 = btoa(binary);
  return urlSafe ? toUrlSafe(b64) : b64;
}

export function decodeBase64(b64: string, urlSafe: boolean): string {
  const normalized = urlSafe ? fromUrlSafe(b64.trim()) : b64.trim();
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function isJwtToken(input: string): boolean {
  const parts = input.trim().split('.');
  return (
    parts.length === 3 &&
    parts.every((p) => /^[A-Za-z0-9_-]+$/.test(p)) &&
    parts[0].length > 0 &&
    parts[1].length > 0
  );
}

// --- JWT inspector ------------------------------------------------------------

function decodeJwtPart(part: string): Record<string, unknown> | null {
  try {
    const normalized = fromUrlSafe(part);
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Decodes a JWT's header/payload for inspection - does not verify the signature. */
export function inspectJwt(token: string): JwtPayload {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return {
      header: null,
      payload: null,
      signature: '',
      isExpired: null,
      expiresAt: null,
      issuedAt: null,
      error: 'Not a valid JWT - expected 3 dot-separated parts',
    };
  }

  const header = decodeJwtPart(parts[0]);
  const payload = decodeJwtPart(parts[1]);

  let expiresAt: Date | null = null;
  let issuedAt: Date | null = null;
  let isExpired: boolean | null = null;

  if (payload) {
    // exp/iat are Unix seconds per the JWT spec; Date expects milliseconds.
    if (typeof payload.exp === 'number') {
      expiresAt = new Date(payload.exp * 1000);
      isExpired = expiresAt < new Date();
    }
    if (typeof payload.iat === 'number') {
      issuedAt = new Date(payload.iat * 1000);
    }
  }

  return {
    header,
    payload,
    signature: parts[2],
    isExpired,
    expiresAt,
    issuedAt,
    error: null,
  };
}

// --- Main hook ----------------------------------------------------------------

export function useBase64(input: string, opts: Base64Options): Base64Result {
  return useMemo(() => {
    const empty: Base64Result = {
      output: '',
      error: null,
      isJwt: false,
      byteCount: 0,
      charCount: 0,
    };
    if (!input) return empty;

    const jwt = opts.mode === 'decode' && isJwtToken(input);

    try {
      let output: string;
      let byteCount = 0;

      if (opts.mode === 'encode') {
        output = encodeBase64(input, opts.urlSafe);
        byteCount = new TextEncoder().encode(input).length;
      } else {
        if (jwt) {
          output = input;
          byteCount = input.length;
        } else {
          output = decodeBase64(input, opts.urlSafe);
          byteCount = new TextEncoder().encode(output).length;
        }
      }

      return {
        output,
        error: null,
        isJwt: jwt,
        byteCount,
        charCount: output.length,
      };
    } catch (e) {
      return {
        ...empty,
        error: (e as Error).message,
        isJwt: jwt,
      };
    }
  }, [input, opts]);
}
