import { MARGINS, PAGE_SIZES, type PdfOptions } from '../types/imageToPdf';

/** Pixels are treated as 96 dpi when a page is sized to the image. */
const PX_TO_PT = 72 / 96;

export interface PageLayout {
  pageWidth: number;
  pageHeight: number;
  /** Where to draw the image, in PDF points (origin bottom-left). */
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Work out the page size and image placement for one image.
 * `imgW`/`imgH` are the image's pixel size after rotation.
 */
export function layoutPage(
  imgW: number,
  imgH: number,
  opts: PdfOptions,
): PageLayout {
  const m = MARGINS[opts.margin];

  if (opts.pageSize === 'fit') {
    const width = imgW * PX_TO_PT;
    const height = imgH * PX_TO_PT;
    return {
      pageWidth: width + m * 2,
      pageHeight: height + m * 2,
      x: m,
      y: m,
      width,
      height,
    };
  }

  let [pw, ph] = PAGE_SIZES[opts.pageSize];
  const landscape =
    opts.orientation === 'landscape' ||
    (opts.orientation === 'auto' && imgW > imgH);
  if (landscape) [pw, ph] = [ph, pw];

  const boxW = pw - m * 2;
  const boxH = ph - m * 2;
  // Scale down to fit; never enlarge small images beyond their 96-dpi size
  // so they don't turn blurry.
  const natW = imgW * PX_TO_PT;
  const natH = imgH * PX_TO_PT;
  const scale = Math.min(boxW / natW, boxH / natH, 1);
  const width = natW * scale;
  const height = natH * scale;

  return {
    pageWidth: pw,
    pageHeight: ph,
    x: (pw - width) / 2,
    y: (ph - height) / 2,
    width,
    height,
  };
}
