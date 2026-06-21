import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {},

  webpack: (config: any) => {
    // Prevent webpack from trying to bundle Node.js built-ins
    // that some packages reference but don't actually use in browser context
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
