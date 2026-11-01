const fs = require('fs');
const path = require('path');

// ONNX Runtime Web for the background remover, self-hosted so the AI runs
// in the visitor's browser without contacting a third-party CDN.
// Files land in public/ort/<version>/ - the worker
// (public/workers/remove-background.worker.mjs) loads from the same path,
// so keep the version in package.json pinned exactly.

const PKG_DIR = path.join(__dirname, '../node_modules/onnxruntime-web');
const pkgJson = path.join(PKG_DIR, 'package.json');
if (!fs.existsSync(pkgJson)) {
  console.error('✗ onnxruntime-web is not installed. Run npm install.');
  process.exit(1);
}
const { version } = JSON.parse(fs.readFileSync(pkgJson, 'utf8'));
const SRC_DIR = path.join(PKG_DIR, 'dist');
const DEST_DIR = path.join(__dirname, '../public/ort', version);

// CPU-only build, and the WebGPU build (which also contains the CPU backend).
const FILES = [
  'ort.wasm.min.mjs',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
  'ort.min.mjs',
  'ort-wasm-simd-threaded.jsep.mjs',
  'ort-wasm-simd-threaded.jsep.wasm',
];

for (const file of FILES) {
  if (!fs.existsSync(path.join(SRC_DIR, file))) {
    console.error(`✗ Source file not found: ${path.join(SRC_DIR, file)}`);
    process.exit(1);
  }
}

fs.mkdirSync(DEST_DIR, { recursive: true });
let copied = 0;
for (const file of FILES) {
  const dest = path.join(DEST_DIR, file);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(path.join(SRC_DIR, file), dest);
    copied++;
  }
}
console.log(
  copied > 0
    ? `✓ onnxruntime-web ${version} copied to public/ort/${version}/ (${copied} file(s))`
    : `✓ onnxruntime-web ${version} already in public/ort/${version}/`,
);
