export interface ConvertProgress {
  stage: 'reading' | 'extracting' | 'building' | 'done';
  currentPage: number;
  totalPages: number;
}

export interface ConvertResult {
  url: string;
  fileName: string;
  pageCount: number;
  paragraphCount: number;
  sizeLabel: string;
  /** True if barely any text could be extracted - likely a scanned/image-only PDF. */
  lowTextWarning: boolean;
}

/** A single reconstructed line of text with the formatting we could infer from the PDF. */
export interface ExtractedLine {
  text: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  /** Vertical gap (in PDF points) above this line, relative to the previous one on the page. */
  gapAbove: number;
}

export interface ExtractedPage {
  lines: ExtractedLine[];
}
