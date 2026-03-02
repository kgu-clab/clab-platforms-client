/**
 * 타임존 정보가 없는 서버 날짜(UTC)를 올바르게 파싱
 */
function parseDate(dateString: string): Date {
  if (!dateString.endsWith("Z") && !dateString.includes("+")) {
    return new Date(dateString + "Z");
  }
  return new Date(dateString);
}

/**
 * ISO 8601 문자열을 YYYY-MM-DD 형식으로 변환
 */
export function formatDate(dateString: string): string {
  const date = parseDate(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 상대 시간 포맷 (24시간 이내면 "n시간 전", 그 외는 YYYY-MM-DD)
 */
export function formatRelativeTime(dateString: string): string {
  const date = parseDate(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  // 24시간 이내면 상대 시간 표시
  if (diffHours < 24 && diffHours >= 0) {
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes === 0) {
        return "방금 전";
      }
      return `${diffMinutes}분 전`;
    }
    return `${diffHours}시간 전`;
  }

  // 24시간 이상이면 날짜 포맷
  return formatDate(dateString);
}
