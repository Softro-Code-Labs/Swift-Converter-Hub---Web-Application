import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import YamlJsonTool from '@/features/data/yaml-json/components';

export const metadata: Metadata = {
  title: 'YAML to JSON Converter',
  description:
    'Convert YAML to JSON or JSON to YAML instantly in your browser. Supports multi-document YAML, Kubernetes manifests, Docker Compose, CI configs, and API specs - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'yaml to json converter',
    'json to yaml converter',
    'yaml json online free',
    'convert yaml to json browser',
    'convert json to yaml online',
    'yaml json bidirectional',
    'yaml json no upload',
    'yaml converter free',
    'json to yaml instant',
    'yaml json private tool',

    // YAML features
    'yaml parser online free',
    'yaml multi document converter',
    'yaml anchors aliases converter',
    'yaml to json pretty print',
    'yaml to json sort keys',
    'yaml indent converter',
    'yaml line width converter',
    'yaml block scalar converter',
    'yaml flow style converter',
    'yaml comments parser',

    // JSON features
    'json to yaml indentation',
    'json to yaml line wrap',
    'json to yaml sort keys',
    'json nested to yaml browser',
    'json array to yaml list',
    'json to yaml download',
    'json to yaml clipboard',
    'json to yaml no server',
    'json to yaml instant preview',
    'json to yaml key count',

    // Dev & DevOps use cases
    'kubernetes yaml to json',
    'docker compose yaml converter',
    'ci pipeline yaml converter',
    'github actions yaml to json',
    'circleci yaml converter',
    'openapi yaml to json',
    'swagger yaml converter',
    'helm chart yaml json',
    'ansible yaml converter',
    'terraform yaml json converter',

    // Privacy & features
    'yaml json no server upload',
    'offline yaml json converter',
    'private yaml converter browser',
    'yaml json swap direction',
    'yaml json copy clipboard',
    'yaml json error line number',
    'client side yaml parser',
    'yaml json multi document',
    'yaml json key counter',
    'yaml json load example',
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
  return <YamlJsonTool />;
}
