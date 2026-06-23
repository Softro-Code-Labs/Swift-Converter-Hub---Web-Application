export type CaseId =
  | 'upper'
  | 'lower'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'dot'
  | 'alternating'
  | 'inverse';

export interface CaseOption {
  id: CaseId;
  label: string;
  example: string;
  group: 'basic' | 'code' | 'fun';
}
