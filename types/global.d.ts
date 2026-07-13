export {};

declare global {
  interface Window {
    /** Google AdSense's async ad queue. Present once the AdSense loader
     * script has executed; absent (undefined) before that, or if the
     * script never loads (e.g. consent not yet given, ad blocker). */
    adsbygoogle?: unknown[] & { push: (params: object) => void };
  }
}
