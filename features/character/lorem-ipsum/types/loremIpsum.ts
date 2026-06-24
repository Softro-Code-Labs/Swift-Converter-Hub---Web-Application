export type GenerateType = 'paragraphs' | 'sentences' | 'words';
export type CorpusType = 'classic' | 'random';

export interface LoremOptions {
  type: GenerateType;
  count: number;
  corpus: CorpusType;
  startWithLorem: boolean;
}
