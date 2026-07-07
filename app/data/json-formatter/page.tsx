import { Metadata } from 'next';
import JsonFormatterTool from '@/features/data/json-formatter/components';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description:
    'Beautify, minify, and validate JSON instantly in your browser. Sort keys, escape ASCII, inspect structure stats - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'json formatter online',
    'json beautifier free',
    'json minifier online',
    'json validator browser',
    'pretty print json online',
    'format json free tool',
    'json beautify no upload',
    'json formatter instant',
    'online json prettifier',
    'json lint browser free',

    // Beautify
    'json indent formatter',
    'json pretty print 2 spaces',
    'json pretty print 4 spaces',
    'json tab indentation',
    'json readable format online',
    'json format with newlines',
    'json expand compressed',
    'json whitespace adder',
    'json pretty online free',
    'json beautify tool no server',

    // Minify
    'json minify online free',
    'json compress whitespace',
    'json minifier browser',
    'compact json online tool',
    'json strip whitespace',
    'json size reducer online',
    'json payload compressor',
    'minify json no upload',
    'json one line converter',
    'json compact format browser',

    // Validate
    'json validator online',
    'validate json syntax browser',
    'check json valid online',
    'json syntax checker free',
    'json error finder online',
    'json parse error line number',
    'json lint validator browser',
    'json schema validator online',
    'json is valid checker',
    'json error location finder',

    // Features
    'json sort keys alphabetically',
    'json ascii escape tool',
    'json structure stats browser',
    'json key counter online',
    'json depth analyzer',
    'json type counter online',
    'json file upload formatter',
    'json drag drop formatter',
    'json use as input tool',
    'json formatter download',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/data/json-formatter',
  },
  openGraph: {
    title:
      'JSON Formatter & Validator - Beautify, Minify, Validate | Data Studio',
    description:
      'Beautify, minify, or validate JSON instantly. Sort keys, ASCII escape, structure stats - no server, no upload.',
    url: 'https://swiftconverterhub.com/data/json-formatter',
    type: 'website',
  },
};

export default function JsonFormatterPage() {
  return <JsonFormatterTool />;
}
