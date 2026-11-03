const fs = require('fs');
const path = require('path');

// Tesseract.js for the image-to-text (OCR) tool, self-hosted so text is read
// in the visitor's browser without contacting a third-party CDN.
//
//   public/tesseract/<version>/worker.min.js         - worker script
//   public/tesseract/<version>/tesseract-core-*.js   - engine (WASM inlined)
//   public/tesseract/lang/<model>/<lang>.traineddata.gz - language data
//
// features/image/ocr/lib/engine.ts loads from the same paths, so keep the
// versions in package.json pinned exactly. The language list must match
// features/image/ocr/lib/languages.ts (a unit test checks this).

const ROOT = path.join(__dirname, '..');
const NM = path.join(ROOT, 'node_modules');

const readVersion = (pkg) => {
  const pkgJson = path.join(NM, pkg, 'package.json');
  if (!fs.existsSync(pkgJson)) {
    console.error(`✗ ${pkg} is not installed. Run npm install.`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pkgJson, 'utf8')).version;
};

const version = readVersion('tesseract.js');
readVersion('tesseract.js-core');

// Smaller 8-bit "best_int" models: about a quarter of the size of "best",
// with practically the same accuracy.
const MODEL = '4.0.0_best_int';
const LANGS = [
  'eng',
  'spa',
  'fra',
  'deu',
  'por',
  'ita',
  'nld',
  'rus',
  'sin',
  'tam',
  'hin',
  'ara',
  'chi_sim',
  'jpn',
  'kor',
];

const ENGINE_DIR = path.join(ROOT, 'public/tesseract', version);
const LANG_DIR = path.join(ROOT, 'public/tesseract/lang', MODEL);

// Only the LSTM builds are needed (the legacy engine is never used). The
// worker picks one per device: relaxed SIMD, SIMD, or plain.
const COPIES = [
  [path.join(NM, 'tesseract.js/dist/worker.min.js'), ENGINE_DIR],
  ...[
    'tesseract-core-lstm.wasm.js',
    'tesseract-core-simd-lstm.wasm.js',
    'tesseract-core-relaxedsimd-lstm.wasm.js',
  ].map((f) => [path.join(NM, 'tesseract.js-core', f), ENGINE_DIR]),
  ...LANGS.map((lang) => [
    path.join(NM, `@tesseract.js-data/${lang}`, MODEL, `${lang}.traineddata.gz`),
    LANG_DIR,
  ]),
];

for (const [src] of COPIES) {
  if (!fs.existsSync(src)) {
    console.error(`✗ Source file not found: ${src}`);
    process.exit(1);
  }
}

let copied = 0;
for (const [src, destDir] of COPIES) {
  fs.mkdirSync(destDir, { recursive: true });
  const dest = path.join(destDir, path.basename(src));
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    copied++;
  }
}
console.log(
  copied > 0
    ? `✓ tesseract.js ${version} and ${LANGS.length} languages copied to public/tesseract/ (${copied} file(s))`
    : `✓ tesseract.js ${version} already in public/tesseract/`,
);
