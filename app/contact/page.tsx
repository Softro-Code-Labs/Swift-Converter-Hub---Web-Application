import { Metadata } from 'next';
import ContactForm from '@/features/contact/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the Swift Converter Hub team. Report bugs, suggest features, or ask questions about our privacy-first file conversion tools.',
  keywords: [
    'contact swift converter hub',
    'swift converter hub support',
    'report a bug file converter',
    'feature request browser utility',
    'swift converter hub help',
    'contact webassembly tool team',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/contact' },
  openGraph: {
    title: 'Contact Swift Converter Hub - Privacy-First Local File Converters',
    description: 'Reach out with bugs, feature requests, or privacy questions.',
    url: 'https://swiftconverterhub.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
