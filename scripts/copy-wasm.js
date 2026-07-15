const fs = require('fs');
const path = require('path');

// Self-hosted locally instead of loading from a third-party CDN.
// Keeps processing dependencies under our control and maintains the privacy
// promise that files are processed inside the user's browser.

const SRC_DIR = path.join(
  __dirname,
  '../node_modules/@imagemagick/magick-wasm/dist/magick.wasm',
);
const PUBLIC_DIR = path.join(__dirname, '../public');
const DEST = path.join(PUBLIC_DIR, 'magick.wasm');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`✗ Source wasm binary not found at ${SRC_DIR}`);
  console.error(
    '  Did @imagemagick/magick-wasm install correctly? Try removing node_modules and reinstalling.',
  );
  process.exit(1);
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });

if (!fs.existsSync(DEST)) {
  fs.copyFileSync(SRC_DIR, DEST);
  console.log('✓ magick.wasm copied to public/');
} else {
  console.log('✓ magick.wasm already exists in public/');
}
