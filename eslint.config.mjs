import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Generated/vendored assets copied into public/ at postinstall time
    // (scripts/copy-wasm.js, scripts/copy-ffmpeg.js) - not source code.
    'public/ffmpeg/**',
    'public/magick.wasm',
  ]),
  {
    // Plain CommonJS Node scripts run directly via `node scripts/x.js`
    files: ['scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);

export default eslintConfig;
