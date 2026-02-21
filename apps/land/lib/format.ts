/**
 * 8자리 숫자 문자열을 YYYY-MM-DD 형식으로 변환합니다.
 * @example formatBirth('20031021') // '2003-10-21'
 */
export function formatBirth(raw: string): string {
  if (raw.length !== 8) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

/**
 * ISO 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환합니다.
 * @example formatDate('2027-11-06T00:00:00') // '2027.11.06'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}
