import { Metadata } from 'next';
import { LegalLayout } from '@/components/site/LegalLayout';
import { Shield, Eye, BarChart2, Globe, Mail, CheckCircle } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';
import { SITE_OPERATOR } from '@/config/site';

export const metadata: Metadata = pageMetadata({
  path: '/privacy',
  title: 'Privacy Policy',
  description:
    'How Swift Converter Hub handles your data: files are processed in your browser and never uploaded. Details on analytics, ads, cookies and your choices.',
  keywords: [
    'swift converter hub privacy policy',
    'no upload file converter privacy',
    'browser based utility data security',
    'secure client side file processing',
    'gdpr compliant file converter',
    'local processing data protection policy',
    'private webassembly converter safety',
    'file converter data policy',
    'no server file storage policy',
    'cookie policy file converter',
    'user data protection online tool',
  ],
});

const SECTIONS = [
  {
    id: '1',
    icon: Shield,
    title: 'What we collect',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    content: (
      <>
        <p>
          We do not collect, store, or transmit any files you process using our
          tools. All file conversion happens entirely inside your browser using
          WebAssembly. Your files never leave your device.
        </p>
        <p className="mt-3">
          We use Microsoft Clarity to understand how the tools are used and
          improve them - this includes page views, clicks, scrolling, and
          anonymized session recordings/heatmaps of on-page interactions.
          Clarity masks the content of text input fields by default, so what you
          type is not captured. Files you convert are never involved, since they
          never leave your browser in the first place. See{' '}
          <a
            href="https://privacy.microsoft.com/en-us/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Microsoft&apos;s Privacy Statement
          </a>{' '}
          for how Microsoft handles this data.
        </p>
        <p className="mt-3">
          If you send us a message through the contact form, we receive the
          name, email address and message you enter so we can reply. It is
          delivered to our team by email (through our email provider, Resend)
          and is used only to answer you.
        </p>
      </>
    ),
  },
  {
    id: '2',
    icon: Eye,
    title: 'What we never see',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    content: (
      <ul className="space-y-2">
        {[
          'The content, pixels, or text of any file you process',
          'File names or metadata of files you process',
          'Any personal or identifying information from your files',
          'Your conversion history or output files',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: '3',
    icon: BarChart2,
    title: 'Advertising & analytics',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    content: (
      <>
        <p>
          To keep our tools free, we show ads through Google AdSense. These
          cookies cannot access your files or conversion data in any way.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this website or other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners
            to serve ads to you based on your visit to this site and/or other
            sites on the Internet.
          </li>
          <li>
            You may opt out of personalised advertising by visiting{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google Ads Settings
            </a>
            . You can also opt out of some third-party vendors&apos; use of
            cookies for personalised advertising at{' '}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              aboutads.info
            </a>{' '}
            or, in Europe,{' '}
            <a
              href="https://www.youronlinechoices.eu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              youronlinechoices.eu
            </a>
            .
          </li>
        </ul>
        <p className="mt-3">
          Learn more about{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            how Google uses information from sites that use its services
          </a>
          .
        </p>
        <p className="mt-3">
          We also use Google Analytics to understand traffic and usage patterns
          across the site. It never sees the content of your files either - only
          page views and general usage events.
        </p>
        <p className="mt-3">
          We use <strong>Google Consent Mode v2</strong> to respect your choice.
          Non-essential storage is set to &quot;denied&quot; by default until
          consent is given. For visitors in the EEA, UK, Switzerland, and
          applicable US states, consent for both advertising (Google AdSense)
          and analytics (Google Analytics) storage is collected through
          Google&apos;s own on-page consent prompt, which is shown automatically
          where required and updates these settings on our behalf - one Google
          tag reads this consent state for both products. Our own cookie banner
          is separate and only controls Microsoft Clarity.
        </p>
        <p className="mt-3">
          We also use Microsoft Clarity (see &quot;What we collect&quot; above
          for what it records), which stays disabled until you opt in. You can
          change your consent preferences at any time using the link in the
          footer.
        </p>
      </>
    ),
  },
  {
    id: '4',
    icon: Globe,
    title: 'Your rights & compliance',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    content: (
      <>
        <p>
          We never receive or store the files you process, so there is no copy
          of your files on our side to access, export or delete. Messages sent
          through the contact form are kept only as long as needed to reply;
          you can ask us to delete them at any time.
        </p>
        <p className="mt-3">
          We aim to respect your rights under data-protection laws such as the
          GDPR (EU and UK) and the CCPA (California), including the rights to
          access and delete personal data we hold about you. If you have
          questions about your rights, contact us at the address below.
        </p>
      </>
    ),
  },
  {
    id: '5',
    icon: Mail,
    title: 'Contact us',
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    content: (
      <>
        <p>
          Swift Converter Hub is owned and operated by {SITE_OPERATOR.name},
          which is responsible for this policy. Questions about this policy or
          how your data is handled? Reach us at:
        </p>
        <a
          href="mailto:privacy@swiftconverterhub.com"
          className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
        >
          privacy@swiftconverterhub.com
        </a>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      meta="Version 1.1, last updated November 2026"
      notice={
        <>
          <strong className="font-semibold">
            Your files never leave your device.
          </strong>{' '}
          All conversion happens in your browser. We have no servers that
          receive your files, so this isn&apos;t a promise we could break -
          it&apos;s how the site is built.
        </>
      }
      sections={SECTIONS.map(({ id, title, content }) => ({
        id,
        title,
        content,
      }))}
      related={{ label: 'Terms of Service', href: '/terms' }}
    />
  );
}
