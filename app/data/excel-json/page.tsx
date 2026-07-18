import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import ExcelJsonTool from '@/features/data/excel-json/components';

export const metadata: Metadata = {
  title: 'Excel to JSON Converter',
  description:
    'Convert Excel .xlsx, .xls, and .ods spreadsheets to JSON in your browser. Multi-sheet support, header row detection, date formatting, and empty cell control - no server, no upload, 100% private.',
  keywords: [
    'excel to json converter',
    'xlsx to json converter',
    'xls to json online free',
    'convert excel to json browser',
    'spreadsheet to json converter',
    'excel json no upload',
    'xlsx json online tool',
    'excel to json instant',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/excel-json`,
  },
  openGraph: {
    title: 'Excel to JSON Converter - Multi-Sheet .xlsx Parser | Data Studio',
    description:
      'Convert .xlsx workbooks to JSON with sheet picker, header detection, date formatting - parsed in your browser, nothing uploaded.',
    url: `${SITE_URL}/data/excel-json`,
    type: 'website',
  },
};

export default function ExcelJsonPage() {
  return <ExcelJsonTool />;
}
