import type { NextConfig } from 'next';

const CSP_DIRECTIVES = [
  `default-src 'self'`,
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
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: CSP_DIRECTIVES,
          },
        ],
      },
    ];
  },

  webpack: (config: any) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      sharp: false,
    };

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
