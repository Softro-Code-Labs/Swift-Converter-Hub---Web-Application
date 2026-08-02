import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileStack, Zap, Shield, ArrowLeftRight } from 'lucide-react';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import {
  ToolPageHeader,
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
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

const STEPS = [
  {
    step: '01',
    title: 'Paste YAML or JSON',
    desc: 'A Kubernetes manifest, Docker Compose file, CI config, or plain JSON.',
  },
  {
    step: '02',
    title: 'Enable multi-document if needed',
    desc: "Turn on multi-doc mode to read or write YAML's --- document separators.",
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Get pretty-printed JSON, or clean YAML with your chosen indent width.',
  },
];

const USE_CASE_CARDS = [
  { title: 'Kubernetes manifests', desc: 'Deployments, services, config maps' },
  { title: 'Docker Compose', desc: 'docker-compose.yml service definitions' },
  { title: 'CI/CD configs', desc: 'GitHub Actions, GitLab CI, CircleCI' },
];

const FAQS = [
  {
    q: 'What does "multi-document" mode do?',
    a: 'YAML allows multiple independent documents in a single file, separated by a line containing just ---, which is exactly how a single Kubernetes manifest file often defines several resources (a Deployment and a Service, say) at once. Multi-doc mode reads each one separately and represents them as a JSON array; converting back from a JSON array writes each element as its own document with the --- separator.',
  },
  {
    q: 'What happens to YAML anchors and aliases (&name / *name)?',
    a: "They're resolved during parsing, so the JSON output contains the fully expanded value everywhere the alias was used rather than a reference. When converting back from JSON to YAML, each value is written out in full rather than being re-compressed into an anchor - so a round trip preserves the data but not the original anchor shorthand.",
  },
  {
    q: 'Why did I get an error with a specific line number?',
    a: "YAML is indentation-sensitive, so a single misplaced space can produce a parse error. This tool surfaces the exact line number and reason reported by the parser (for example, 'bad indentation of a mapping entry' at line 12), rather than a generic failure message, so you can jump straight to the problem.",
  },
  {
    q: 'Can I control the indent width when converting to YAML?',
    a: 'Yes - you can set the indent size and whether long lines should wrap, since different tools and style guides (Kubernetes YAML, Ansible playbooks, GitHub Actions) have different conventions for how YAML in that ecosystem is typically formatted.',
  },
  {
    q: 'Is my config file uploaded anywhere?',
    a: 'No. Both directions run locally in your browser using the js-yaml library - nothing is sent to a server, which matters since YAML configs like Compose files or CI pipelines often contain internal service names or non-secret but still private configuration.',
  },
];

export default function YamlJsonPage() {
  return (
    <div className="space-y-0">
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
          howToJsonLd({
            name: 'How to convert YAML to JSON online',
            description:
              'Convert YAML to JSON or JSON to YAML, including multi-document YAML.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'YAML to JSON Converter', path: '/data/yaml-json' },
        ]}
        badges={[{ label: 'YAML', color: 'rose' }, { label: 'JSON', color: 'amber' }]}
        title="Convert YAML to JSON (and Back)"
        description="Convert YAML - including multi-document Kubernetes manifests, Docker Compose files, and CI configs - to JSON, or JSON back to clean YAML."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: FileStack, label: 'Multi-document support' },
          { icon: ArrowLeftRight, label: 'Bidirectional' },
        ]}
      />

      <div className="px-6 py-6">
        <YamlJsonTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Common YAML files this handles"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={USE_CASE_CARDS}
      />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Both directions are powered by js-yaml, a widely used YAML 1.2 parser and serializer. YAML to JSON mode can split on --- document separators and parse each one independently for multi-document files, then reports the resolved line and reason for any syntax error directly from the parser. JSON to YAML mode serializes with anchors and aliases disabled, so every value is written out in full rather than compressed into YAML's reference shorthand - which keeps the output simpler to read and diff, at the cost of being slightly more verbose than hand-written YAML might be.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={FAQS}
      />
    </div>
  );
}
