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
  // Legacy binary .doc files can't be read by mammoth (it only reads .docx),
  // so they are reported as unsupported with a how-to-fix message.
  if (name.endsWith('.docx')) return 'docx';
  if (/\.(xlsx|xlsm|xls|ods|csv)$/.test(name)) return 'xlsx';
  return 'unsupported';
}

export const ACCEPTED_TYPES =
  '.docx,.doc,.xlsx,.xlsm,.xls,.ods,.csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
