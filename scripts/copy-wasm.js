const fs = require('fs');
const path = require('path');

const src = path.join(
  __dirname,
  '../node_modules/@imagemagick/magick-wasm/dist/magick.wasm',
);
const dest = path.join(__dirname, '../public/magick.wasm');

if (!fs.existsSync(dest)) {
  fs.copyFileSync(src, dest);
  console.log('✓ magick.wasm copied to public/');
} else {
  console.log('✓ magick.wasm already exists in public/');
}
