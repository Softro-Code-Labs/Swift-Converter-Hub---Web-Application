export const PDF_TO_WORD_FAQS = [
  {
    q: 'Will the Word document look exactly like my PDF?',
    a: "Not pixel-for-pixel. This tool reflows the PDF's text into a normal, editable Word document - it detects paragraphs and headings automatically, but tables, multi-column layouts, and exact positioning aren't preserved. If you mainly need to edit the text (not recreate the exact visual layout), this gets you there fast.",
  },
  {
    q: 'Does it work on scanned PDFs or photos of documents?',
    a: "No. This tool reads the text layer that's already embedded in the PDF - it doesn't perform OCR (optical character recognition). If your PDF is a scanned image with no selectable text, there's nothing for it to extract, and the downloaded file will say so instead of arriving empty.",
  },
  {
    q: 'Are images and tables carried over?',
    a: 'Not in this version - it focuses on getting the text into an editable, reflowable format. Tables usually still come through as reasonably readable text lines, just not as a formatted Word table.',
  },
  {
    q: 'Is my PDF uploaded to a server?',
    a: 'No. Everything happens locally in your browser using pdf.js to read the PDF and the docx library to build the Word file. Your document is never uploaded or transmitted anywhere.',
  },
  {
    q: 'What if my PDF is password-protected?',
    a: "You'll need to remove the password first (in a PDF reader that supports it) before converting - this tool can't prompt for or process a password.",
  },
];
