'use client';

import { useMemo } from 'react';
import type { ParsedUrl, EncodeResult, EncodeMode } from '../types/urlEncoder';

export function useEncodeDecoder(
  input: string,
  mode: EncodeMode,
): EncodeResult {
  return useMemo(() => {
    if (!input) {
      return { input, output: '', mode, changed: false };
    }
    try {
      let output: string;
      switch (mode) {
        case 'component':
          output = encodeURIComponent(input);
          break;
        case 'full':
          output = encodeURI(input);
          break;
        case 'decode':
          // Try decodeURIComponent first, fall back to decodeURI
          try {
            output = decodeURIComponent(input);
          } catch {
            output = decodeURI(input);
          }
          break;
        default:
          output = input;
      }
      return { input, output, mode, changed: output !== input };
    } catch (e) {
      return {
        input,
        output: `Error: ${(e as Error).message}`,
        mode,
        changed: false,
      };
    }
  }, [input, mode]);
}

export function useUrlParser(raw: string): ParsedUrl {
  return useMemo(() => {
    const empty: ParsedUrl = {
      protocol: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '',
      search: '',
      hash: '',
      origin: '',
      params: [],
      isValid: false,
      error: null,
    };

    if (!raw.trim()) return empty;

    try {
      // Auto-add protocol if missing
      const withProtocol =
        raw.startsWith('http://') || raw.startsWith('https://')
          ? raw
          : `https://${raw}`;
      const url = new URL(withProtocol);

      const params: { key: string; value: string }[] = [];
      url.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });

      return {
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        params,
        isValid: true,
        error: null,
      };
    } catch (e) {
      return { ...empty, error: (e as Error).message };
    }
  }, [raw]);
}
