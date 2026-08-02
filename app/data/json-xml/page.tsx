import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Code2, Zap, Shield, ArrowLeftRight } from 'lucide-react';
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
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import JsonXmlTool from '@/features/data/json-xml/components';

export const metadata: Metadata = {
  title: 'JSON to XML Converter',
  description:
    'Convert JSON to XML or XML to JSON instantly in your browser. Supports XML attributes, custom root elements, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    'json to xml converter',
    'xml to json converter',
    'json xml online free',
    'convert json to xml browser',
    'convert xml to json online',
    'json xml bidirectional',
    'json xml no upload',
    'json xml instant',
    'json xml attribute converter',
    'convert api response to xml',
    'xml pretty print online',
    'json to xml with root element',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/json-xml`,
  },
  openGraph: {
    title:
      'JSON ↔ XML Converter - Bidirectional with Attribute Support | Data Studio',
    description:
      'Convert JSON to XML or XML to JSON with full attribute support, custom root tags, and pretty printing - instant, private, no server.',
    url: `${SITE_URL}/data/json-xml`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste JSON or XML',
    desc: 'The tool converts in whichever direction matches your input.',
  },
  {
    step: '02',
    title: 'Set root element and attribute prefix',
    desc: 'Name the wrapping root tag, and choose the prefix that marks a key as an XML attribute.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Get pretty-printed, indented XML or JSON.',
  },
];

const FAQS = [
  {
    q: 'How does it decide what becomes an XML attribute vs. an element?',
    a: 'Any JSON key starting with your chosen attribute prefix (@_ by default) becomes an XML attribute on its parent element instead of a nested child element - so {"@_id": "42", "name": "Widget"} produces <item id="42"><name>Widget</name></item> rather than nesting id as its own element.',
  },
  {
    q: 'How are JSON arrays represented in XML?',
    a: 'XML has no native concept of an array, so each item in a JSON array is written as a separate, repeated element with the same tag name - the standard convention used by most JSON-XML converters, and the one most XML parsers expect when reconstructing a list.',
  },
  {
    q: 'What happens to special characters like < and & in text values?',
    a: 'They are escaped to their XML entity equivalents (&lt;, &amp;, and so on) automatically, since those characters have structural meaning in XML and would otherwise produce invalid, unparseable output.',
  },
  {
    q: 'Can I set a custom root element name?',
    a: "Yes - since a JSON document can have any top-level shape but a well-formed XML document needs exactly one root element, you can specify what that wrapping tag should be called (it defaults to something generic like <root> otherwise).",
  },
  {
    q: 'Is my data uploaded anywhere?',
    a: 'No. Both conversion directions run locally in your browser using custom parsing logic - nothing is sent to a server.',
  },
];

export default function JsonXmlPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'JSON to XML Converter', path: '/data/json-xml' },
          ]),
          softwareApplicationJsonLd({
            name: 'JSON to XML Converter',
            description:
              'Convert JSON to XML or XML to JSON instantly in your browser. Supports XML attributes, custom root elements, pretty printing, and auto type coercion - no server, no upload, 100% private.',
            path: '/data/json-xml',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to convert JSON to XML online',
            description:
              'Convert JSON to XML or XML to JSON with attribute and root element support.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'JSON to XML Converter', path: '/data/json-xml' },
        ]}
        badges={[{ label: 'JSON', color: 'amber' }, { label: 'XML', color: 'blue' }]}
        title="Convert JSON to XML (and Back)"
        description="Convert JSON to XML or XML to JSON with full attribute support, a custom root element, and pretty printing - all processed in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Code2, label: 'Attribute support' },
          { icon: ArrowLeftRight, label: 'Bidirectional' },
        ]}
      />

      <div className="px-6 py-6">
        <JsonXmlTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'JSON to XML conversion walks your parsed JSON object recursively: keys matching your attribute prefix become XML attributes on the enclosing element, arrays are expanded into repeated sibling elements with the same tag name, and every other key becomes a nested child element - with tag names sanitized so they only contain characters XML actually allows. Text content is passed through an entity-escaping step so reserved characters like < and & never break the resulting markup. XML to JSON runs the same logic in reverse, using the browser\'s built-in XML parser to read the document structure before rebuilding it as a JSON object.',
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
