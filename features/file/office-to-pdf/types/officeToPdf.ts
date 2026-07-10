export type OfficeFileType = 'docx' | 'xlsx' | 'unsupported';

export interface ConvertResult {
  htmlContent: string;
  fileName: string;
  fileType: OfficeFileType;
  pageEstimate: number;
  warnings: string[];
}

export function detectFileType(file: File): OfficeFileType {
  const name = file.name.toLowerCase();
  if (name.endsWith('.docx') || name.endsWith('.doc')) return 'docx';
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return 'xlsx';
  return 'unsupported';
}

export const ACCEPTED_TYPES =
  '.docx,.doc,.xlsx,.xls,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
