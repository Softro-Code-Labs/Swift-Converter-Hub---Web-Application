'use client';

import { useState, useEffect, useRef } from 'react';
import { md5 } from '../lib/md5';
import type {
  HashAlgorithm,
  HashResult,
  HashOptions,
} from '../types/hashGenerator';

const ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'];

async function computeWebCrypto(
  algorithm: HashAlgorithm,
  data: BufferSource,
  hmac: boolean,
  hmacKey: string,
): Promise<string> {
  if (hmac) {
    const keyData = new TextEncoder().encode(hmacKey || 'secret');
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: algorithm },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, data);
    return Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const buf = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function computeHash(
  algorithm: HashAlgorithm,
  input: string | ArrayBuffer,
  opts: HashOptions,
): Promise<string> {
  const isBuffer = input instanceof ArrayBuffer;

  if (algorithm === 'MD5') {
    if (isBuffer) {
      // Convert ArrayBuffer to string for MD5
      const bytes = new Uint8Array(input);
      const str = Array.from(bytes)
        .map((b) => String.fromCharCode(b))
        .join('');
      return md5(str);
    }
    return md5(input as string);
  }

  const data = isBuffer
    ? new Uint8Array(input)
    : new TextEncoder().encode(input as string);

  return computeWebCrypto(algorithm, data, opts.hmac, opts.hmacKey);
}

export function useHashGenerator(
  input: string | ArrayBuffer | null,
  opts: HashOptions,
) {
  const [results, setResults] = useState<HashResult[]>(
    ALGORITHMS.map((algorithm) => ({
      algorithm,
      hex: '',
      length: 0,
      status: 'idle' as const,
      error: null,
    })),
  );

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!input && input !== '') {
      setResults((prev) =>
        prev.map((r) => ({ ...r, hex: '', status: 'idle', error: null })),
      );
      return;
    }

    // Cancel previous computation
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Set all to computing
    setResults((prev) =>
      prev.map((r) => ({ ...r, status: 'computing', hex: '' })),
    );

    ALGORITHMS.forEach(async (algorithm) => {
      try {
        const hex = await computeHash(algorithm, input, opts);
        if (controller.signal.aborted) return;

        const formatted = opts.uppercase ? hex.toUpperCase() : hex;
        setResults((prev) =>
          prev.map((r) =>
            r.algorithm === algorithm
              ? {
                  ...r,
                  hex: formatted,
                  status: 'done',
                  error: null,
                  length: hex.length * 4,
                }
              : r,
          ),
        );
      } catch (e) {
        if (controller.signal.aborted) return;
        setResults((prev) =>
          prev.map((r) =>
            r.algorithm === algorithm
              ? { ...r, hex: '', status: 'error', error: (e as Error).message }
              : r,
          ),
        );
      }
    });

    return () => {
      controller.abort();
    };
  }, [input, opts]);

  return results;
}
