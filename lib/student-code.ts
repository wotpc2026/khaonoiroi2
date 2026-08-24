const thaiDigits = '๐๑๒๓๔๕๖๗๘๙';

export function normalizeDigits(value: string) {
  return value.replace(/[๐-๙]/g, (digit) => String(thaiDigits.indexOf(digit)));
}

export function normalizeStudentCode(value: string) {
  return normalizeDigits(value).replace(/\s+/g, '').trim();
}

export function parseLocalizedNumber(value: FormDataEntryValue | string | null) {
  const normalized = normalizeDigits(String(value ?? '')).replace(',', '.');
  return Number(normalized);
}
