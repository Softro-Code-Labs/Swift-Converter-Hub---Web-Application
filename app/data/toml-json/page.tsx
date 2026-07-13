import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import TomlJsonTool from '@/features/data/toml-json/components';

export const metadata: Metadata = {
  title: 'TOML to JSON Converter',
  description:
    'Convert TOML to JSON or JSON to TOML instantly in your browser. Supports Cargo.toml, pyproject.toml, config.toml and any TOML config file - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'toml to json converter',
    'json to toml converter',
    'toml json online free',
    'convert toml to json browser',
    'convert json to toml online',
    'toml json bidirectional',
    'toml json no upload',
    'toml converter free',
    'toml json instant',
    'toml json private tool',

    // Rust / Cargo
    'cargo toml to json converter',
    'cargo.toml json parser',
    'rust config toml converter',
    'cargo toml json online',
    'rust toml json tool',
    'cargo manifest json',
    'rust project config converter',
    'cargo.toml parser browser',
    'rust toml to json free',
    'cargo dependencies json',

    // Python
    'pyproject toml to json',
    'pyproject.toml json converter',
    'python config toml json',
    'poetry toml json converter',
    'hatch toml json converter',
    'setup.cfg toml json',
    'python package toml json',
    'pyproject json parser browser',
    'python toml converter online',
    'pip toml json tool',

    // General config
    'toml config to json',
    'config toml json converter',
    'application config toml json',
    'toml file parser online',
    'toml to json table arrays',
    'toml inline table json',
    'toml datetime json converter',
    'toml array json list',
    'toml sort keys json',
    'toml comment stripped json',

    // Privacy & features
    'toml json no server upload',
    'offline toml json converter',
    'private toml converter browser',
    'toml json swap direction',
    'toml json copy clipboard',
    'toml json download output',
    'toml json error line number',
    'toml json key count',
    'toml json file drop upload',
    'client side toml parser',
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
  return <TomlJsonTool />;
}
