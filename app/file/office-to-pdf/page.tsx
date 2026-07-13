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
    'docx to pdf instant free',
    'xlsx to pdf instant browser',
    'word to pdf no account',
    'excel to pdf no account',
    'docx pdf converter offline',
    'xlsx pdf converter offline',
    'word to pdf client side',
    'excel to pdf client side',
    'convert docx pdf free tool',
    'convert xlsx pdf free tool',
    'mammoth js docx converter',
    'sheetjs xlsx pdf browser',
    'word to pdf print dialog',
    'excel to pdf save as pdf',
    'office to pdf browser tool',
    'microsoft word pdf free',
    'microsoft excel pdf free',
    'doc to pdf online free',
    'xls to pdf online free',
    'word formatting pdf browser',
    'excel table pdf browser',
    'word headings pdf convert',
    'excel sheet pdf convert',
    'multi sheet excel pdf',
    'word document pdf preview',
    'excel spreadsheet pdf view',
    'word to pdf no watermark',
    'excel to pdf no watermark',
    'office to pdf secure browser',
    'word pdf private document',
    'excel pdf private data',
    'convert office files pdf',
    'word pdf instant preview',
    'excel pdf instant preview',
    'word to pdf formatting keep',
    'excel columns pdf export',
    'office pdf no install',
    'word pdf windows mac',
    'excel pdf windows mac',
    'office to pdf free tool',
    'word excel pdf converter',
    'docx xlsx pdf free online',
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
