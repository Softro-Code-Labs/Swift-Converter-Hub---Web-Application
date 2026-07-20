import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import TomlJsonTool from '@/features/data/toml-json/components';

export const metadata: Metadata = {
  title: 'TOML to JSON Converter',
  description:
    'Convert TOML to JSON or JSON to TOML instantly in your browser. Supports Cargo.toml, pyproject.toml, config.toml and any TOML config file - no server, no upload, 100% private.',
  keywords: [
    'toml to json converter',
    'json to toml converter',
    'toml json online free',
    'convert toml to json browser',
    'convert json to toml online',
    'toml json bidirectional',
    'toml json no upload',
    'toml converter free',
    'cargo toml to json',
    'pyproject toml converter',
    'toml config converter online',
    'rust config file converter',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/toml-json`,
  },
  openGraph: {
    title:
      'TOML ↔ JSON Converter - Cargo.toml, pyproject.toml & More | Data Studio',
    description:
      'Convert TOML to JSON or JSON to TOML. Cargo.toml, pyproject.toml, config files - instant, private, no server.',
    url: `${SITE_URL}/data/toml-json`,
    type: 'website',
  },
};

export default function TomlJsonPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'TOML to JSON Converter', path: '/data/toml-json' },
          ]),
          softwareApplicationJsonLd({
            name: 'TOML to JSON Converter',
            description:
              'Convert TOML to JSON or JSON to TOML instantly in your browser. Supports Cargo.toml, pyproject.toml, config.toml and any TOML config file - no server, no upload, 100% private.',
            path: '/data/toml-json',
            category: 'DeveloperApplication',
          }),
        ]}
      />
      <TomlJsonTool />
    </>
  );
}
