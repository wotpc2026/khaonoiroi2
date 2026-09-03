const thaiDigits = '๐๑๒๓๔๕๖๗๘๙';

export function normalizeDigits(value: string) {
  return value.replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)));
}

export function normalizeStudentCode(value: string) {
  return normalizeDigits(value).replace(/[–—−]/g, '-').replace(/\s+/g, '').trim();
}

export function studentAuthEmail(value: string) {
  return `${normalizeStudentCode(value)}@roster.com`;
}

export function legacyStudentAuthEmail(value: string) {
  return `${normalizeStudentCode(value)}@roster.local`;
}

export function parseLocalizedNumber(value: FormDataEntryValue | string | null) {
  const normalized = normalizeDigits(String(value ?? '')).replace(',', '.');
  return Number(normalized);
}
