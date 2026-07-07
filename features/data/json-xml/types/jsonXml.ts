export type ConvertDirection = 'json-to-xml' | 'xml-to-json';

export interface JsonXmlOptions {
  direction: ConvertDirection;
  rootElement: string;
  prettyXml: boolean;
  prettyJson: boolean;
  attributePrefix: string;
  textKey: string;
  arrayIndicator: string;
}

export interface ConvertResult {
  output: string;
  nodeCount: number;
  error: string | null;
}

export const DEFAULT_OPTIONS: JsonXmlOptions = {
  direction: 'json-to-xml',
  rootElement: 'root',
  prettyXml: true,
  prettyJson: true,
  attributePrefix: '@',
  textKey: '#text',
  arrayIndicator: '[]',
};
