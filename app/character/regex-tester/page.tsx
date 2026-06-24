import { Metadata } from 'next';
import RegexTesterTool from '@/features/character/regex-tester/components';

export const metadata: Metadata = {
  title: 'Regex Tester',
  description:
    'Test regular expressions live with match highlighting, capture group inspection, and flag controls (i, m, s, u). Powered by the JavaScript RegExp engine - instant, private, no server.',
  keywords: [
    // Original core keywords
    'regex tester online',
    'regular expression tester',
    'live regex matcher',
    'regex capture groups',
    'javascript regex tester',
    'regex flags online',
    'regex debugger browser',
    'regex match highlighter',
    'online regex validator',
    'regex pattern tester free',
    'named capture groups tester',
    'regex cheatsheet tool',
    'private regex tester no upload',
    'regex multiline dotall unicode',

    // Language Engine & Dialect Specifications
    'js regexp engine checker',
    'ecmascript regular expressions playground',
    'v8 regex engine test bench',
    'typescript match pattern tester',
    'regex matching engine browser',
    'test regex lookahead lookbehind',
    'non capturing groups regex test',
    'regex conditional match validator',

    // Specific Parsing & Debugging Actions
    'debug regular expression strings online',
    'regex substitution replacement helper',
    'extract text using regex match',
    'check regular expression for catastrophic backtracking',
    'explain regular expression code online',
    'regex match visualizer free',
    'test regex matching performance browser',
    'validate regex expression syntax error',

    // Practical Validation Use Cases
    'email validation regex tester',
    'password strength regex test online',
    'phone number regular expression checker',
    'url validation regex playground',
    'ipv4 ipv6 address regex parser',
    'date format regex string validator',
    'credit card validation pattern checker',
    'uuid alphanumeric match regex tool',

    // System Administration & Data Engineering
    'nginx rewrite rule regex checker',
    'apache htaccess redirect regex test',
    'log parser regular expression editor',
    'grep pattern validator browser',
    'google analytics ga4 filter regex check',
    'elasticsearch query pattern tester',
    'vs code find replace regex scratchpad',

    // Architecture, Performance & Privacy
    'offline regex sandbox browser',
    'client side regex stream evaluator',
    'secure data pattern extraction tool',
    'zero telemetry regex utility',
    'wasm accelerated regular expression compiler',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/regex-tester',
  },
  openGraph: {
    title: 'Regex Tester - Live Matching & Capture Groups | Character Studio',
    description:
      'Live highlights, capture group inspector, flag toggles, quick reference - instant, private, no server.',
    url: 'https://swiftconverterhub.com/character/regex-tester',
    type: 'website',
  },
};

export default function RegexTesterPage() {
  return <RegexTesterTool />;
}
