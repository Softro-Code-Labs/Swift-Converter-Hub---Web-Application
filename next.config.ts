import type { NextConfig } from 'next';

// Content Security Policy configuration.
const CSP_DIRECTIVES = [
  `default-src 'self'`,
  // Allow required scripts for WASM tools, ads, analytics, and external services.
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://www.googletagservices.com https://*.google.com https://*.gstatic.com https://www.clarity.ms`,

  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' https://fonts.gstatic.com data:`,
  `img-src 'self' data: blob: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://www.clarity.ms`,
  `connect-src 'self' https://www.clarity.ms https://*.googlesyndication.com https://*.google.com blob:`,
  `frame-src https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
].join('; ');

const nextConfig: NextConfig = {
  turbopack: {},

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent clickjacking attacks.
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

          // Prevent browsers from guessing file types.
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // Control how much referrer information is sent.
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          // Disable unnecessary browser features.
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },

          // Monitor CSP violations without blocking requests.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: CSP_DIRECTIVES,
          },
        ],
      },
    ];
  },

  webpack: (config) => {
    // Disable Node.js modules that are not required in the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    // Prevent browser bundling of server-side packages.
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: false,
    };

    // Keep optional Node dependencies external.
    config.externals = [
      ...(config.externals || []),
      {
        'utf-8-validate': 'commonjs utf-8-validate',
        bufferutil: 'commonjs bufferutil',
      },
    ];

    return config;
  },
};

export default nextConfig;
