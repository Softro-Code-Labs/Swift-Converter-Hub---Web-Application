import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import NumberBaseTool from '@/features/character/number-base/components';

export const metadata: Metadata = {
  title: 'Number Base Converter',
  description:
    'Convert numbers between binary, octal, decimal, and hexadecimal simultaneously as you type. Includes bit pattern visualiser, byte size, and common value reference - instant, private, no server.',
  keywords: [
    'number base converter online',
    'binary decimal hex converter',
    'base converter online free',
    'number system converter',
    'binary to decimal converter',
    'decimal to binary converter',
    'hex to decimal converter',
    'decimal to hex converter',
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
