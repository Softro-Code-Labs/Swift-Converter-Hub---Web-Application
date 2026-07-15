export type EncodeMode = 'encode' | 'decode';
export type CharsetMode = 'standard' | 'url-safe';

export interface Base64Options {
  mode: EncodeMode;
  charset: CharsetMode;
  urlSafe: boolean;
}

export interface Base64Result {
  output: string;
  error: string | null;
  isJwt: boolean;
  byteCount: number;
  charCount: number;
}

export interface JwtPayload {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  isExpired: boolean | null;
  expiresAt: Date | null;
  issuedAt: Date | null;
  error: string | null;
}
