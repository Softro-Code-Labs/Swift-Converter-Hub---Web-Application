import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import YamlJsonTool from '@/features/data/yaml-json/components';

export const metadata: Metadata = {
  title: 'YAML to JSON Converter',
  description:
    'Convert YAML to JSON or JSON to YAML instantly in your browser. Supports multi-document YAML, Kubernetes manifests, Docker Compose, CI configs, and API specs - no server, no upload, 100% private.',
  keywords: [
    'yaml to json converter',
    'json to yaml converter',
    'yaml json online free',
    'convert yaml to json browser',
    'convert json to yaml online',
    'yaml json bidirectional',
    'yaml json no upload',
    'yaml converter free',
    'kubernetes yaml to json',
    'docker compose converter online',
    'yaml validator online free',
    'convert ci config to json',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/yaml-json`,
  },
  openGraph: {
    title:
      'YAML ↔ JSON Converter - Kubernetes, Docker & CI Configs | Data Studio',
    description:
      'Convert YAML to JSON or JSON to YAML. Multi-document, sort keys, custom indent - instant, private, no server.',
    url: `${SITE_URL}/data/yaml-json`,
    type: 'website',
  },
};

export default function YamlJsonPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'YAML to JSON Converter', path: '/data/yaml-json' },
          ]),
          softwareApplicationJsonLd({
            name: 'YAML to JSON Converter',
            description:
              'Convert YAML to JSON or JSON to YAML instantly in your browser. Supports multi-document YAML, Kubernetes manifests, Docker Compose, CI configs, and API specs - no server, no upload, 100% private.',
            path: '/data/yaml-json',
            category: 'DeveloperApplication',
          }),
        ]}
      />
      <YamlJsonTool />
    </>
  );
}
