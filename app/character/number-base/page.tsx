import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import NumberBaseTool from '@/features/character/number-base/components';

export const metadata: Metadata = {
  title: 'Number Base Converter',
  description:
    'Convert numbers between binary, octal, decimal, and hexadecimal simultaneously as you type. Includes bit pattern visualiser, byte size, and common value reference - instant, private, no server.',
  keywords: [
    // Core intent
    'number base converter online',
    'binary decimal hex converter',
    'base converter online free',
    'number system converter',
    'binary to decimal converter',
    'decimal to binary converter',
    'hex to decimal converter',
    'decimal to hex converter',
    'octal converter online',
    'all bases converter tool',

    // Binary specific
    'binary number converter',
    'binary to hex online',
    'binary to octal converter',
    'convert binary to decimal free',
    'binary calculator browser',
    'binary number tool online',
    'base 2 converter free',
    'binary representation tool',
    'binary bit pattern viewer',
    'binary grouping nibble tool',

    // Hex specific
    'hexadecimal converter online',
    'hex to binary converter',
    'hex to octal free tool',
    'base 16 number converter',
    'hex colour to decimal',
    'hex number calculator browser',
    'hexadecimal decoder online',
    'hex prefix 0x converter',
    'hex digit converter tool',
    'live hex conversion tool',

    // Octal specific
    'octal to decimal converter',
    'octal to binary online',
    'base 8 converter free',
    'octal number system tool',
    'octal prefix 0o converter',

    // Bit / byte features
    'bit length calculator',
    'byte size calculator online',
    'bit pattern visualiser',
    'significant bits counter',
    '8 bit 16 bit 32 bit converter',
    'nibble bit viewer online',
    'binary bit grid display',
    'msb lsb bit viewer',
    'unsigned integer converter',
    'bigint base converter browser',

    // Dev / CS use cases
    'programmer calculator online',
    'developer number base tool',
    'computer science base converter',
    'cs number system practice',
    'bitwise operation helper',
    'common hex values reference',
    'powers of two converter',
    'network mask binary converter',
    'ascii decimal hex converter',
    'number base converter no install',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/number-base`,
  },
  openGraph: {
    title:
      'Number Base Converter - Binary, Octal, Decimal, Hex | Character Studio',
    description:
      'Edit any base and all four update live - with bit pattern display, byte size, and common value reference. Instant, private, no server.',
    url: `${SITE_URL}/character/number-base`,
    type: 'website',
  },
};

export default function NumberBasePage() {
  return <NumberBaseTool />;
}
