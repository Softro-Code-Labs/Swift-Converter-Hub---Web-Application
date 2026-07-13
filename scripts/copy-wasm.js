const fs = require('fs');
const path = require('path');

const src = path.join(
  __dirname,
  '../node_modules/@imagemagick/magick-wasm/dist/magick.wasm',
);
const publicDir = path.join(__dirname, '../public');
const dest = path.join(publicDir, 'magick.wasm');

if (!fs.existsSync(src)) {
  console.error(`✗ Source wasm binary not found at ${src}`);
  console.error(
    '  Did @imagemagick/magick-wasm install correctly? Try removing node_modules and reinstalling.',
  );
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });

if (!fs.existsSync(dest)) {
  fs.copyFileSync(src, dest);
  console.log('✓ magick.wasm copied to public/');
} else {
  console.log('✓ magick.wasm already exists in public/');
}
