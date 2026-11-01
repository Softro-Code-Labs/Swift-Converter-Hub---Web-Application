/* ---------------------------------------------------------------------------
   Turning the model's mask into the final image: edge refinement, the new
   background, cropping and export. Everything runs on canvases in the page.
--------------------------------------------------------------------------- */

export type BackgroundKind = 'transparent' | 'color' | 'blur' | 'image';
export type OutputFormat = 'png' | 'webp' | 'jpg';

export interface ComposeSettings {
  background: BackgroundKind;
  color: string;
  /** Used when background === 'image'. */
  backgroundImage: ImageBitmap | null;
  /** 0 = the model's natural soft edge, 100 = hard cut-out. */
  crispness: number;
  /** Blur radius applied to the edge, in output pixels at 1000 px wide. */
  feather: number;
  /** Crop the result to the subject. */
  cropToSubject: boolean;
  /** Space around the subject when cropping, % of its size. */
  padding: number;
}

export const DEFAULT_SETTINGS: ComposeSettings = {
  background: 'transparent',
  color: '#ffffff',
  backgroundImage: null,
  crispness: 25,
  feather: 0,
  cropToSubject: false,
  padding: 6,
};

/** Browsers (Safari especially) refuse canvases above ~16.7 megapixels. */
export const MAX_OUTPUT_PIXELS = 16_000_000;

export function fitWithin(w: number, h: number, maxPixels = MAX_OUTPUT_PIXELS) {
  const scale = Math.min(1, Math.sqrt(maxPixels / (w * h)));
  return {
    width: Math.max(1, Math.floor(w * scale)),
    height: Math.max(1, Math.floor(h * scale)),
    scaled: scale < 1,
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/**
 * Remap mask values: crispness pushes values towards 0 or 255 around the
 * midpoint, which removes faint halos and hardens hair/fur edges.
 */
export function refineMask(
  mask: Uint8Array,
  crispness: number,
): Uint8ClampedArray {
  const k = 1 + (crispness / 100) * 11; // contrast 1x..12x
  const lut = new Uint8ClampedArray(256);
  for (let v = 0; v < 256; v++) {
    lut[v] = Math.round(((v / 255 - 0.5) * k + 0.5) * 255);
  }
  const out = new Uint8ClampedArray(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = lut[mask[i]];
  return out;
}

/** The mask as an alpha-only canvas at the given output size. */
function maskCanvas(
  mask: Uint8Array,
  size: number,
  w: number,
  h: number,
  s: Pick<ComposeSettings, 'crispness' | 'feather'>,
) {
  const values = refineMask(mask, s.crispness);
  const small = canvas(size, size);
  const img = new ImageData(size, size);
  for (let i = 0; i < values.length; i++) img.data[i * 4 + 3] = values[i];
  small.getContext('2d')!.putImageData(img, 0, 0);

  const out = canvas(w, h);
  const ctx = out.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const blur = (s.feather * Math.max(w, h)) / 1000;
  if (blur > 0.2) ctx.filter = `blur(${blur.toFixed(1)}px)`;
  ctx.drawImage(small, 0, 0, w, h);
  return out;
}

/** Bounding box of the subject in 0..1 coordinates, or null if empty. */
export function subjectBounds(mask: Uint8Array, size: number, threshold = 24) {
  let minX = size;
  let minY = size;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < size; y++) {
    const row = y * size;
    for (let x = 0; x < size; x++) {
      if (mask[row + x] > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;
  return {
    x: minX / size,
    y: minY / size,
    w: (maxX - minX + 1) / size,
    h: (maxY - minY + 1) / size,
  };
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource & { width: number; height: number },
  w: number,
  h: number,
) {
  const scale = Math.max(w / src.width, h / src.height);
  const dw = src.width * scale;
  const dh = src.height * scale;
  ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

/**
 * Compose the final image at (at most) the given size.
 * `maxSide` keeps previews light; downloads pass null for full resolution.
 */
export function compose(
  source: ImageBitmap,
  mask: Uint8Array,
  maskSize: number,
  s: ComposeSettings,
  maxSide: number | null,
): HTMLCanvasElement {
  let { width: w, height: h } = fitWithin(source.width, source.height);
  if (maxSide && Math.max(w, h) > maxSide) {
    const k = maxSide / Math.max(w, h);
    w = Math.round(w * k);
    h = Math.round(h * k);
  }

  // Subject cut-out at full frame.
  const cut = canvas(w, h);
  const cctx = cut.getContext('2d')!;
  cctx.imageSmoothingQuality = 'high';
  cctx.drawImage(source, 0, 0, w, h);
  cctx.globalCompositeOperation = 'destination-in';
  cctx.drawImage(maskCanvas(mask, maskSize, w, h, s), 0, 0);

  // Background + subject.
  const full = canvas(w, h);
  const ctx = full.getContext('2d')!;
  if (s.background === 'color') {
    ctx.fillStyle = s.color;
    ctx.fillRect(0, 0, w, h);
  } else if (s.background === 'blur') {
    const r = Math.max(4, Math.round(Math.max(w, h) / 60));
    ctx.filter = `blur(${r}px)`;
    // Draw slightly larger so the blur doesn't fade at the edges.
    ctx.drawImage(source, -r * 2, -r * 2, w + r * 4, h + r * 4);
    ctx.filter = 'none';
  } else if (s.background === 'image' && s.backgroundImage) {
    drawCover(ctx, s.backgroundImage, w, h);
  }
  ctx.drawImage(cut, 0, 0);

  if (!s.cropToSubject) return full;
  const b = subjectBounds(mask, maskSize);
  if (!b) return full;
  const pad = s.padding / 100;
  const px = Math.max(0, (b.x - b.w * pad) * w);
  const py = Math.max(0, (b.y - b.h * pad) * h);
  const pw = Math.min(w - px, b.w * (1 + 2 * pad) * w);
  const ph = Math.min(h - py, b.h * (1 + 2 * pad) * h);
  const cropped = canvas(
    Math.max(1, Math.round(pw)),
    Math.max(1, Math.round(ph)),
  );
  cropped
    .getContext('2d')!
    .drawImage(full, px, py, pw, ph, 0, 0, cropped.width, cropped.height);
  return cropped;
}

const MIME: Record<OutputFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpg: 'image/jpeg',
};

export function toBlob(
  c: HTMLCanvasElement,
  format: OutputFormat,
): Promise<Blob> {
  let src = c;
  if (format === 'jpg') {
    // JPG has no transparency: put it on white.
    src = canvas(c.width, c.height);
    const ctx = src.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(c, 0, 0);
  }
  return new Promise((resolve, reject) =>
    src.toBlob(
      (b) =>
        b ? resolve(b) : reject(new Error('Could not encode the image.')),
      MIME[format],
      format === 'png' ? undefined : 0.92,
    ),
  );
}
