import { Metadata } from 'next';
import ContactForm from '@/features/contact/components/ContactForm';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/contact',
  title: 'Contact Us - Report a Bug or Suggest a Tool',
  description:
    'Report a bug, suggest a new tool or ask a question about Swift Converter Hub. We usually reply within one or two business days.',
  keywords: [
    'contact swift converter hub',
    'swift converter hub support',
    'report a bug file converter',
    'feature request browser utility',
    'swift converter hub help',
    'contact webassembly tool team',
    'swift converter hub contact form',
    'file converter customer support',
    'submit feature request tool',
    'report file converter issue',
  ],
});

export default function ContactPage() {
  return <ContactForm />;
}
