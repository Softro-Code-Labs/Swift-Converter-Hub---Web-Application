import { Metadata } from 'next';
import ExcelJsonTool from '@/features/data/excel-json/components';

export const metadata: Metadata = {
  title: 'Excel to JSON Converter',
  description:
    'Convert Excel .xlsx, .xls, and .ods spreadsheets to JSON in your browser. Multi-sheet support, header row detection, date formatting, and empty cell control - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'excel to json converter',
    'xlsx to json converter',
    'xls to json online free',
    'convert excel to json browser',
    'spreadsheet to json converter',
    'excel json no upload',
    'xlsx json online tool',
    'excel to json instant',
    'workbook to json converter',
    'ods to json converter',

    // Multi-sheet features
    'excel multi sheet to json',
    'xlsx workbook json converter',
    'excel sheet picker json',
    'convert specific sheet json',
    'all sheets to json object',
    'excel sheet name json key',
    'multi tab excel json export',
    'excel sheet selector tool',
    'workbook sheet json browser',
    'excel to json all sheets',

    // Column & header features
    'excel header row json keys',
    'excel column to json field',
    'excel header detection json',
    'excel no header json array',
    'excel custom column json',
    'excel to json column mapping',
    'excel field names json',
    'excel to json key names',
    'xlsx header row converter',
    'excel to json table browser',

    // Date & format features
    'excel date to json iso',
    'excel date serial json',
    'excel to json date format',
    'xlsx date handling json',
    'excel empty cell json null',
    'excel to json pretty print',
    'excel to json minify',
    'xlsx to json formatting',
    'excel boolean json browser',
    'excel number type json',

    // Privacy & features
    'excel json no server upload',
    'offline excel json converter',
    'private excel converter browser',
    'excel json download output',
    'excel json copy clipboard',
    'excel json table preview',
    'client side xlsx parser',
    'browser excel json utility',
    'excel json row count',
    'excel json drag drop upload',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/data/excel-json',
  },
  openGraph: {
    title: 'Excel to JSON Converter - Multi-Sheet .xlsx Parser | Data Studio',
    description:
      'Convert .xlsx workbooks to JSON with sheet picker, header detection, date formatting - parsed in your browser, nothing uploaded.',
    url: 'https://swiftconverterhub.com/data/excel-json',
    type: 'website',
  },
};

export default function ExcelJsonPage() {
  return <ExcelJsonTool />;
}
