import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.wasm': {
        loaders: ['@vercel/turbopack-wasm'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
