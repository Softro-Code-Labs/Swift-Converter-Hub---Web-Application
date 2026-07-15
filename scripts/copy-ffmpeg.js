const fs = require('fs');
const path = require('path');

// Self-hosted locally instead of loading from a third-party CDN.
// Keeps processing dependencies under our control and maintains the privacy
// promise that files are processed inside the user's browser.

const SRC_DIR = path.join(__dirname, '../node_modules/@ffmpeg/core/dist/umd');
const DEST_DIR = path.join(__dirname, '../public/ffmpeg');

const FILES = ['ffmpeg-core.js', 'ffmpeg-core.wasm'];

for (const file of FILES) {
  const src = path.join(SRC_DIR, file);
  if (!fs.existsSync(src)) {
    console.error(`✗ Source file not found: ${src}`);
    console.error(
      '  Did @ffmpeg/core install correctly? Try removing node_modules and reinstalling.',
    );
    process.exit(1);
  }
}

fs.mkdirSync(DEST_DIR, { recursive: true });

let copied = 0;
for (const file of FILES) {
  const src = path.join(SRC_DIR, file);
  const dest = path.join(DEST_DIR, file);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    copied++;
  }
}

console.log(
  copied > 0
    ? `✓ ffmpeg-core files copied to public/ffmpeg/ (${copied} file(s))`
    : '✓ ffmpeg-core files already exist in public/ffmpeg/',
);
