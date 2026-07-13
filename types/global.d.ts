export {};

declare global {
  interface Window {
    adsbygoogle?: unknown[] & { push: (params: object) => void };
  }
}
