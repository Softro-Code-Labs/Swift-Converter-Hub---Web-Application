import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import OfficeToPdfTool from '@/features/file/office-to-pdf/components';

export const metadata: Metadata = {
  title: 'Word / Excel to PDF Converter',
  description:
    'Convert .docx and .xlsx files to PDF in your browser using the built-in print dialog. No server, no upload, 100% private - powered by Mammoth.js and SheetJS.',
  keywords: [
    'word to pdf converter online',
    'excel to pdf converter free',
    'docx to pdf browser',
    'xlsx to pdf online free',
    'convert word to pdf no upload',
    'convert excel to pdf browser',
    'word pdf converter private',
    'excel pdf converter no server',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/office-to-pdf`,
  },
  openGraph: {
    title: 'Word / Excel to PDF - Browser Print Conversion | Document Suite',
    description:
      'Convert .docx and .xlsx to PDF via browser print dialog - preview, then save as PDF. Nothing uploaded.',
    url: `${SITE_URL}/file/office-to-pdf`,
    type: 'website',
  },
};

export default function OfficeToPdfPage() {
  return <OfficeToPdfTool />;
}
