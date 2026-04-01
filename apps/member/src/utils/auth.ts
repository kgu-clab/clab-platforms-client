const ACCESS_TOKEN_KEY = "clab_member_access_token";
const REFRESH_TOKEN_KEY = "clab_member_refresh_token";

/** JWT payload의 exp 필드를 기반으로 쿠키 Max-Age(초)를 계산합니다. */
function parseTokenMaxAge(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as { exp?: number };
    const remaining = (payload.exp ?? 0) - Math.floor(Date.now() / 1000);
    return Math.max(remaining, 0);
  } catch {
    return 14 * 24 * 60 * 60; // 14일 fallback
  }
}

/**
 * 세션 스토리지에서 접근 토큰을 가져옵니다.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * 쿠키에서 갱신 토큰을 가져옵니다.
 */
export function getRefreshToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${REFRESH_TOKEN_KEY}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * 접근 토큰은 세션 스토리지에, 갱신 토큰은 쿠키에 저장합니다.
 */
export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

  const maxAge = parseTokenMaxAge(refreshToken);
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(refreshToken)}; Max-Age=${maxAge}; Path=/; SameSite=Strict${secure}`;
}

/**
 * 접근 토큰(세션 스토리지)과 갱신 토큰(쿠키)을 모두 제거합니다.
 */
export function removeTokens(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  document.cookie = `${REFRESH_TOKEN_KEY}=; Max-Age=0; Path=/; SameSite=Strict`;
}

/**
 * 인증에 사용될 Authorization 헤더 객체를 생성합니다.
 * @param token - 사용할 토큰. 없으면 null.
 */
export function authorization(token: string | null): Record<string, string> {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}
